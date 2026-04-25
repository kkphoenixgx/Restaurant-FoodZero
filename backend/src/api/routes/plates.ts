import { Router, Request, Response } from 'express';
import DaoPlate from '../db/DaoPlate';
import DaoPlateCategory from '../db/DaoPlateCategory';
import Plate from '../model/Plate';
import fs from 'fs';
import multer from 'multer';
import path from 'path';

const router = Router();
const plateDao = new DaoPlate();
const plateCategoryDao = new DaoPlateCategory();

(async () => {
  await plateDao.initConnection();
  await plateCategoryDao.initConnection();
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

function deleteOldImage(imagePath: string | null | undefined) {
  if (!imagePath) return;
  const fullPath = path.join(process.cwd(), 'public', imagePath);
  fs.unlink(fullPath, (err) => {
    if (err) console.error('Erro ao apagar imagem antiga:', err);
  });
}

function extractCategoryIds(body: any): number[] | null {
  // Verifica se alguma das chaves comuns de categorias foi enviada no FormData
  const keys = ['categoryIds', 'categoryIds[]', 'categories', 'categories[]', 'category', 'categoryId', 'category_id', 'category_ids'];
  const hasKey = keys.some(k => Object.prototype.hasOwnProperty.call(body, k));
  
  if (!hasKey) return null; // Front não enviou nenhuma info de categoria

  const raw = body.categoryIds ?? body['categoryIds[]'] ?? body.categories ?? body['categories[]'] ?? body.category ?? body.categoryId ?? body.category_id ?? body.category_ids;
  
  if (raw === undefined || raw === null || raw === 'undefined' || raw === 'null' || raw === '') return [];
  
  let parsed: any[] = [];
  if (typeof raw === 'string') {
    try {
      const j = JSON.parse(raw);
      parsed = Array.isArray(j) ? j : [j];
    } catch {
      parsed = raw.split(',');
    }
  } else if (Array.isArray(raw)) {
    parsed = raw;
  } else {
    parsed = [raw];
  }

  return parsed
    .map((item: any) => {
      if (typeof item === 'object' && item !== null) return Number(item.id || item._id);
      return Number(item);
    })
    .filter((id: number) => !isNaN(id) && id > 0);
}

router.get('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const plate = await plateDao.getPlate(id);
  if (plate) {
    res.json(plate);
  } else {
    res.status(404).json({ error: 'Plate not found' });
  }
});
router.get('/', async (_req: Request, res: Response) => {
  const plates = await plateDao.listPlates();
  res.json(plates);
});
router.get('/:id/categories', async (req: Request, res: Response) => {
  const plateId = parseInt(req.params.id);
  try {
    const categoryIds = await plateCategoryDao.getCategoriesByPlate(plateId);
    res.json(categoryIds);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get categories', details: err });
  }
});
router.get('/category/:categoryId', async (req: Request, res: Response) => {
  const categoryId = parseInt(req.params.categoryId);
  try {
    const plateIds = await plateCategoryDao.getPlatesByCategory(categoryId);
    const plates = await Promise.all(plateIds.map(id => plateDao.getPlate(id)));

    res.json(plates.filter(Boolean));
  } catch (err) {
    res.status(500).json({ error: 'Failed to get plates', details: err });
  }
});


router.post('/', upload.single('foto'), async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const file = req.file;

    let imagePath = body.imagePath || '';
    if (file) {
      imagePath = `/uploads/${file.filename}`;
    }

    const plate = new Plate(
      0,
      body.name,
      Number(body.price || body.value),
      body.description,
      imagePath
    );

    // Extrai os Ids de forma segura independente do nome da chave enviada
    const parsedCategoryIds = extractCategoryIds(body) || [];

    const plateId = await plateDao.postPlate(plate, parsedCategoryIds);

    res.status(201).json({ message: 'Plate created successfully', plateId });
  } catch (err) {
    console.error('Erro ao criar prato:', err);
    res.status(400).json({ 
      error: 'Invalid data', 
      details: err instanceof Error ? { message: err.message, stack: err.stack } : err 
    });
  }
});

router.put('/:id', upload.single('foto'), async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const body = req.body;
    const file = req.file;

    const oldPlate = await plateDao.getPlate(id);
    if (!oldPlate) {
      return res.status(404).json({ error: 'Plate not found' });
    }

    let imagePath: string = oldPlate.imagePath;

    if (typeof body.imagePath !== 'undefined') {
      if (body.imagePath === '' || body.imagePath === null) {
        deleteOldImage(oldPlate.imagePath);
        imagePath = '';
      }
    }

    if (file) {
      deleteOldImage(oldPlate.imagePath);
      imagePath = `/uploads/${file.filename}`;
    }

    const updatedPlate = new Plate(
      id,
      body.name,
      Number(body.price || body.value),
      body.description,
      imagePath
    );

    await plateDao.updatePlate(id, updatedPlate);

    const parsedCategoryIds = extractCategoryIds(body);

    // Só limpa/atualiza se a chave de categorias realmente veio no payload do PUT
    if (parsedCategoryIds !== null) {
      const oldCategoryIds = await plateCategoryDao.getCategoriesByPlate(id);
      for (const oldId of oldCategoryIds) {
        await plateCategoryDao.removeAssociation(id, oldId);
      }
      
      for (const newId of parsedCategoryIds) {
        await plateCategoryDao.associate(id, newId);
      }
    }

    const savedPlate = await plateDao.getPlate(id);
    res.json(savedPlate);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data', details: err });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const plate = await plateDao.getPlate(id);
  if (plate?.imagePath) {
    deleteOldImage(plate.imagePath);
  }

  const categoryIds = await plateCategoryDao.getCategoriesByPlate(id);
  for (const categoryId of categoryIds) {
    await plateCategoryDao.removeAssociation(id, categoryId);
  }

  await plateDao.deletePlateById(id);
  res.json({ message: 'Plate deleted successfully' });
});

export default router;
