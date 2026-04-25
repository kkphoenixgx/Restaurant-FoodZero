<template>
  <div class="user-view">
    <HeaderPush />
    <div class="user-view-page">
      <h1>Perfil do Usuário</h1>
      <form class="user-form" @submit.prevent="handleSave">
        <div class="user-photo-section">
          <img :src="userImagePreview || getImageUrl(form.userImagePath) || defaultUser" alt="Foto do usuário" class="user-photo" />
          <input type="file" accept="image/*" @change="onPhotoChange" />
        </div>
        <DefaultInput class="user-input" type="text" text="Nome" v-model="form.name" placeholder-color="#222" />
        <DefaultInput class="user-input" type="email" text="Email" v-model="form.email" placeholder-color="#222" />
        <DefaultInput class="user-input" type="text" text="Telefone" v-model="form.phone" placeholder-color="#222" />
        <DefaultInput class="user-input" type="password" text="Senha" v-model="form.senha" placeholder-color="#222" />
        <FilledButton type="submit" text="Salvar Alterações" />
      </form>
      <DefaultToast v-if="showToast" :color="toastColor" :text="toastText" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import HeaderPush from '../../components/ui/HeaderPush.vue';
import DefaultInput from '../../components/ui/DefaultInput.vue';
import FilledButton from '../../components/ui/FilledButton.vue';
import DefaultToast from '../../components/ui/DefaultToast.vue';
import { updateUser, getUser } from '../../services/user';
import User from '../../types/Model/User';

import defaultUser from '../../assets/images/user-default.png';

const showToast = ref(false);
const toastText = ref('');
const toastColor = ref('green');
const userImagePreview = ref<string | null>(null);
const photoFile = ref<File | null>(null);

const defaultServer = import.meta.env.VITE_API_SERVER || (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'https://backendrestaurantfoodzero-production.up.railway.app');

function getImageUrl(path: string | null | undefined) {
  if (!path || path === 'null' || path === 'undefined') return '';
  if (path.startsWith('http') || path.startsWith('data:image')) return path;
  const baseUrl = defaultServer.endsWith('/') ? defaultServer.slice(0, -1) : defaultServer;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${baseUrl}/${cleanPath}`;
}

function getUserFromLocalStorage(): User | null {
  const localUser = localStorage.getItem('user');
  if (!localUser) return null;
  const parsed = JSON.parse(localUser);
  
  let user = new User(
    parsed._id ?? parsed.id,
    parsed._name ?? parsed.name,
    parsed._email ?? parsed.email,
    parsed._senha ?? parsed.senha,
    parsed._userImagePath ?? parsed.userImagePath,
    parsed._phone ?? parsed.phone,
    parsed._role ?? parsed.role
  );
  return user;
}


const user = getUserFromLocalStorage();
const form = reactive({
  id: user?.id ?? '',
  name: user?.name ?? '',
  email: user?.email ?? '',
  phone: user?.phone ?? '',
  senha: '',
  userImagePath: user?.userImagePath ?? '',
  role: user?.role ?? '',
});

async function fetchUserData(id: number) {
  try {
    const freshUser = await getUser(id);
    form.name = freshUser.name;
    form.email = freshUser.email;
    form.phone = freshUser.phone;
    form.userImagePath = freshUser.userImagePath ?? '';
    form.role = freshUser.role;
    form.senha = ''; // Limpa a senha na tela
    localStorage.setItem('user', JSON.stringify(freshUser));
  } catch (e) {
    console.error('Erro ao buscar dados atualizados do usuário:', e);
  }
}

onMounted(async () => {
  if (form.id) {
    await fetchUserData(Number(form.id));
  }
});

function onPhotoChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) {
    photoFile.value = file;
    const reader = new FileReader();
    reader.onload = ev => {
      userImagePreview.value = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}

async function handleSave() {
  try {
    const userFromStorage = getUserFromLocalStorage();
    
    const userId = userFromStorage?.id;

    let updated;
    if(userId){
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('phone', form.phone);
      if (form.senha.trim()) {
        formData.append('senha', form.senha);
      }
      formData.append('role', form.role);
      if (photoFile.value) {
        formData.append('foto', photoFile.value);
      }

      updated = await updateUser(userId, formData);
      
      // Faz o GET (pega os dados reais do banco) logo após o PUT terminar
      await fetchUserData(userId);
      userImagePreview.value = null; // Reseta o preview local para usar a imagem oficial do back
      photoFile.value = null;

      toastText.value = 'Perfil atualizado com sucesso!';
      toastColor.value = 'green';
      showToast.value = true;
    }
    else throw new Error("User não possui id")

    
  
  } catch (e) {
    toastText.value = 'Erro ao atualizar perfil.';
    toastColor.value = 'red';
    showToast.value = true;
  }
}
</script>

<style scoped>
.user-view-page {
  max-width: 700px;
  margin: 0 auto;
  padding: 3rem 1rem;
  color: #222;
}
.user-view-page h1 {
  font-size: 2.2rem;
  margin-bottom: 1.5rem;
  color: #b85c38;
}
.user-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  margin-top: 2rem;
}
.user-photo-section {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}
.user-photo {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #b85c38;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 0.8rem;
  color: #b85c38;
  background-color: #f9f6f2;
}
.user-input {
  width: 100%;
  max-width: 400px;
  color: black;
}
</style>