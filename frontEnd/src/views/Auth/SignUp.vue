<template>

  <div class="signUp">
    <HeaderPush />
    <div class="signup-page">
      <div class="signup-box">
        <img :src="headerLogo" alt="Logo FoodZero" class="signup-logo" />
        <h1>Criar Conta</h1>
        <form @submit.prevent="handleSignUp">
          <div class="form-group">
            <label for="name">Nome</label>
            <input id="name" v-model="name" type="text" placeholder="Digite seu nome" required />
          </div>
          <div class="form-group">
            <label for="email">E-mail</label>
            <input id="email" v-model="email" type="email" placeholder="Digite seu e-mail" required />
          </div>
          <div class="form-group">
            <label for="password">Senha</label>
            <input id="password" v-model="password" type="password" placeholder="Crie uma senha" required />
          </div>
          <div class="form-group">
            <label for="photo">Foto de perfil (opcional)</label>
            <input id="photo" type="file" accept="image/*" @change="onPhotoChange" />
          </div>
          <button type="submit" class="signup-btn">Cadastrar</button>
        </form>
        <p v-if="errorMsg" class="signup-error">{{ errorMsg }}</p>
        <p class="login-link">Já tem uma conta? <router-link to="/login">Entrar</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import HeaderPush from '../../components/ui/HeaderPush.vue';
import { listUsers, createUser } from '../../services/user';

import headerLogo from '../../assets/images/header-logo.png';

const name = ref('');
const email = ref('');
const password = ref('');
const photoFile = ref<File|null>(null);
const errorMsg = ref('');
const router = useRouter();

function onPhotoChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0] || null;
  photoFile.value = file;
}

async function handleSignUp() {
  errorMsg.value = '';
  try {
    const users = await listUsers();
    if (users.find(u => u.email === email.value)) {
      errorMsg.value = 'E-mail já cadastrado.';
      return;
    }
    let fileToSend = photoFile.value;
    if (!fileToSend) {
      // Buscar imagem default como blob e criar File
      // O caminho abaixo funciona em dev e build Vite
      const defaultImgUrl = new URL('../../assets/images/user-default.png', import.meta.url).href;
      const response = await fetch(defaultImgUrl);
      if (!response.ok) {
        errorMsg.value = 'Erro ao carregar imagem padrão.';
        return;
      }
      const blob = await response.blob();
      fileToSend = new File([blob], 'user-default.png', { type: blob.type });
    }
    const formData = new FormData();
    
    formData.append('name', name.value);
    formData.append('email', email.value);
    formData.append('senha', password.value);
    formData.append('phone', '');
    formData.append('role', 'user');
    formData.append('foto', fileToSend);

    const createdUser = await createUser(formData);
    console.log('Dados completos do usuário retornado:', createdUser);
    console.log('Caminho da imagem retornada (userImagePath):', createdUser.userImagePath);
    localStorage.setItem('user', JSON.stringify(createdUser));
    router.push('/');
  } catch (e: any) {
    errorMsg.value = e.message || 'Erro ao cadastrar. Tente novamente.';
  }
}
</script>

<style scoped>
html, body, #app {
  height: 100%;
  min-height: 100vh;
}

.signUp {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.signup-page {
  flex: 1 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff8f0;
}

.signup-box {
  background: #fff;
  padding: 2.5rem 2rem 2rem 2rem;
  border-radius: 1.2rem;
  box-shadow: 0 2px 16px rgba(0,0,0,0.07);
  min-width: 320px;
  max-width: 350px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.signup-logo {
  width: 80px;
  margin-bottom: 1.2rem;
}
.signup-box h1 {
  font-size: 2rem;
  color: #b85c38;
  margin-bottom: 1.5rem;
  font-family: 'Rufina', serif;
}
.form-group {
  width: 100%;
  margin-bottom: 1.1rem;
}
.form-group label {
  display: block;
  margin-bottom: 0.4rem;
  color: #333;
  font-weight: 500;
}
.form-group input {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1px solid #e0cfc2;
  border-radius: 0.5rem;
  font-size: 1rem;
  background: #f9f6f2;
  transition: border 0.2s;
}
.form-group input:focus {
  border: 1.5px solid #b85c38;
  outline: none;
}
.signup-btn {
  width: 100%;
  padding: 0.7rem;
  background: #b85c38;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background 0.2s;
}
.signup-btn:hover {
  background: #a14d2c;
}
.login-link {
  margin-top: 1.2rem;
  font-size: 0.98rem;
  color: #555;
}
.login-link a {
  color: #b85c38;
  text-decoration: underline;
}
.signup-error {
  color: #b85c38;
  margin-top: 0.7rem;
  font-size: 1rem;
  text-align: center;
}
</style>
