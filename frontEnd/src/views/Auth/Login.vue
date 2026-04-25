<template>
  <div>
    <HeaderPush />
    
    <div class="login-page" >
      <div class="login-box">
        <img :src="headerLogo" alt="Logo FoodZero" class="login-logo" />
        <h1>Entrar</h1>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="email">E-mail</label>
            <input id="email" v-model="email" type="email" placeholder="Digite seu e-mail" required />
          </div>
          <div class="form-group">
            <label for="password">Senha</label>
            <input id="password" v-model="password" type="password" placeholder="Digite sua senha" required />
          </div>
          <button type="submit" class="login-btn">Entrar</button>
        </form>
        <p v-if="errorMsg" class="login-error">{{ errorMsg }}</p>
        <p class="signup-link">Não tem uma conta? <router-link to="/signup">Cadastre-se</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import HeaderPush from '../../components/ui/HeaderPush.vue';

import headerLogo from '../../assets/images/header-logo.png';

const email = ref('');
const password = ref('');
const errorMsg = ref('');
const router = useRouter();

async function handleLogin() {
  errorMsg.value = '';
  try {
    // Remove espaços em branco acidentais antes de enviar para a API
    const emailLimpo = email.value.trim();
    const senhaLimpa = password.value.trim();

    const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailLimpo, password: senhaLimpa, senha: senhaLimpa })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      if (res.status === 401 && err?.error === 'Invalid email') {
        errorMsg.value = 'E-mail não cadastrado.';
      } else if (res.status === 401 && err?.error === 'Invalid credentials') {
        errorMsg.value = 'Senha incorreta.';
      } else {
        errorMsg.value = err?.error || 'Erro ao tentar logar. Tente novamente.';
      }
      return;
    }
    const data = await res.json();
    if (data && data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/');
    } else {
      errorMsg.value = 'Erro inesperado ao logar.';
    }
  } catch (e) {
    errorMsg.value = 'Erro ao tentar logar. Tente novamente.';
  }
}
</script>
.login-error {
  color: #b85c38;
  margin-top: 0.7rem;
  font-size: 1rem;
  text-align: center;
}

<style scoped>
.login-page {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff8f0;
}
.login-box {
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
.login-logo {
  width: 80px;
  margin-bottom: 1.2rem;
}
.login-box h1 {
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
.login-btn {
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
.login-btn:hover {
  background: #a14d2c;
}
.signup-link {
  margin-top: 1.2rem;
  font-size: 0.98rem;
  color: #555;
}
.signup-link a {
  color: #b85c38;
  text-decoration: underline;
}
</style>
