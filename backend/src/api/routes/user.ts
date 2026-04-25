import { Router, Request, Response } from 'express';
import DaoUser from '../db/DaoUser';
import User from '../model/User';
import PasswordService from '../service/passwordService';
import { IAuthenticationResponse } from '../../interfaces/IAuthenticationResponse';

import fs from 'fs';
import multer from 'multer';
import path from 'path';

const router = Router();
const dao = new DaoUser();

(async () => {
  await dao.initConnection();
})();

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname).toLowerCase());
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];
    if (!allowedExts.includes(ext)) {
      return cb(null, false); 
    }
    cb(null, true);
  }
});

function deleteOldImage(imagePath: string | null) {
  if (!imagePath) return;

  const fullPath = path.join(process.cwd(), 'public', imagePath);
  fs.unlink(fullPath, (err) => {
    if (err) console.error('Erro ao apagar imagem antiga:', err);
  });
}

router.get('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const user = await dao.getUser(id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

router.get('/', async (_req: Request, res: Response) => {
  const users = await dao.listUsers();
  res.json(users);
});


router.post('/', upload.single('foto'), async (req: Request, res: Response) => {
  try {
    const { name, email, phone, userImagePath } = req.body;
    const senha = req.body.senha || req.body.password;
    const role = req.body.role || 'user';
    
    const file = req.file;

    // Se a imagem não vier como arquivo, tentamos ler o texto (caso o front mande uma string padrão)
    let imagePath = userImagePath || null;
    if (imagePath === 'undefined' || imagePath === 'null' || imagePath === '') {
      imagePath = null;
    }

    if (file) {
      imagePath = `/uploads/${file.filename}`;
    }

    const cryptedPassword = await PasswordService.encryptPassword(senha);

    const user = new User(0, name, email, cryptedPassword, imagePath, phone, role);

    const insertId = await dao.postUser(user);
    const createdUser = await dao.getUser(insertId);
    
    res.status(201).json(createdUser);

  } catch (err) {
    res.status(400).json({ error: 'Invalid data', details: err });
  }
});

router.post('/login', async (req, res) => {
  // Agora o backend aceita tanto o campo "senha" quanto "password" do front
  const { email, senha, password } = req.body;
  const plainTextPassword = senha || password;

  try {
    const authResponse: IAuthenticationResponse = await dao.getUserHashAndId(email);

    if (!plainTextPassword) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const isCorrectPassword = await PasswordService.comparePassword(authResponse.hash, plainTextPassword);

    if (isCorrectPassword) {
      res.json({
        message: 'Logged in',
        user: await dao.getUser(authResponse.id)
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }

  } catch (error) {
    // Trata o throw "Usuário não encontrado" do DaoUser retornando um 401 claro
    if (error instanceof Error && error.message === 'Usuário não encontrado') {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.status(500).json({ error: 'Login failed', details: error instanceof Error ? error.message : error });
  }
});



router.put('/:id', upload.single('foto'), async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { name, email, phone, role, userImagePath } = req.body;
    const senha = req.body.senha || req.body.password;

    const file = req.file;

    const oldUser = await dao.getUser(id);
    if (!oldUser) return res.status(404).json({ error: 'User not found' });

    let imagePath: string | null = oldUser.userImagePath;


    if (typeof userImagePath !== 'undefined') {

      if (userImagePath === '' || userImagePath === null) {
        deleteOldImage(oldUser.userImagePath);
        imagePath = null;
      }

    }

    if (file) {
      deleteOldImage(oldUser.userImagePath);
      imagePath = `/uploads/${file.filename}`;
    }

    // Só criptografa a senha se ela foi enviada (não sobrescreve com senha vazia)
    let cryptedPassword = oldUser.senha;
    if (senha && senha.trim() !== '' && senha !== 'undefined' && senha !== 'null') {
      cryptedPassword = await PasswordService.encryptPassword(senha);
    }

    const updatedUser = new User(id, name, email, cryptedPassword, imagePath, phone, role);
    await dao.updateUser(id, updatedUser);

    res.json({ message: 'User updated successfully' });

  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Invalid data', details: err });
  }
});


router.delete('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const user = await dao.getUser(id);

  if (user?.userImagePath) {
    deleteOldImage(user.userImagePath);
  }

  await dao.deleteUserById(id);
  res.json({ message: 'User deleted successfully' });
});

export default router;
