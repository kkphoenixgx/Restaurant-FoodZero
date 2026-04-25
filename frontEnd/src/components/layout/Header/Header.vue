<template>
  
  <header>
    <Navigation :height="navHeight" @update:height="navHeight = $event" />

    <div class="header-left">
      <img @click="handleLogoClick()" :src="headerLogo" alt="Logo do header">
      <div class="hamburguer-menu" @click="toggleNavigation">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
    <div class="header-right">
      <DefaultLink class="header-link phone-link" type="tel" text="+86 852 346 000" />      
      <RouterLink v-if="!isLoggedIn" to="/login" class="auth-link">Login</RouterLink>
      <div v-else class="auth-group">
        <RouterLink to="/userview" class="auth-link">Perfil</RouterLink>
        <a href="#" @click.prevent="handleLogout" class="auth-link">Sair</a>
      </div>
      <DefaultButton text="Reservations" link="/reservation" />
    </div>
  </header>

</template>


<script setup lang="ts">
  import headerLogo from "../../../assets/images/header-logo.png"
  
  import Navigation from "./partials/Navigation.vue";

  import DefaultButton from "../../ui/DefaultButton.vue";
  import DefaultLink from "../../ui/DefaultLink.vue";

import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute, RouterLink } from "vue-router";

const navHeight = ref('0vh');
const router = useRouter()
const route = useRoute()
const isLoggedIn = ref(false);

function toggleNavigation() {
  navHeight.value = navHeight.value === '0vh' ? '100vh' : '0vh';
}

function handleLogoClick(){
  router.push('/');
}

function checkLoginState() {
  isLoggedIn.value = !!localStorage.getItem('user');
}

onMounted(() => {
  checkLoginState();
});

watch(() => route.path, () => {
  checkLoginState();
});

function handleLogout() {
  localStorage.removeItem('user');
  checkLoginState();
  router.push('/login');
}

</script>

<style scoped>


  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    min-height: 70px;
    padding: 1% 2%;
    background-color: transparent;
    position: absolute;
    z-index: 5;
    box-sizing: border-box;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 1.2rem;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 1.2rem;
    margin-right: 0;
  }

  .header-link {
    margin-right: 0;
  }

  .header-left img {
    width: 110px;
    min-width: 70px;
    max-width: 30vw;
    height: auto;
    cursor: pointer;
  }

.auth-link {
  color: var(--white-default);
  text-decoration: none;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
}
.auth-link:hover {
  text-decoration: underline;
  color: var(--green-lighter);
}
.auth-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

  /* ----------- Hamburguer ----------- */

  .hamburguer-menu {
    width: 32px;
    height: 32px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    gap: 6px;
    margin-left: 1rem;
  }
  .hamburguer-menu span {
    display: block;
    width: 25px;
    height: 2px;
    background: var(--white-default);
    border-radius: 2px;
    transition: 0.3s;
  }

  @media (max-width: 900px) {
    header {
      flex-direction: column;
      align-items: stretch;
      height: auto;
      padding: 1rem 0.5rem;
      min-width: 0;
    }
    .header-left, .header-right {
      width: 100%;
      justify-content: space-between;
      gap: 0.5rem;
    }
    .header-left img {
      width: 80px;
      min-width: 50px;
      max-width: 40vw;
    }
    .header-right {
      margin-right: 0;
      justify-content: flex-end;
    }
  .phone-link {
    display: none;
  }
    .hamburguer-menu {
      margin-left: 0.5rem;
    }
  }

  @media (max-width: 600px) {
    header {
      padding: 0.5rem 0.2rem;
    }
    .header-left img {
      width: 60px;
      min-width: 36px;
    }
  }

  /* ----------- Hamburguer ----------- */

  .hamburguer-menu {
    width: 32px;
    height: 32px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    gap: 6px;
    margin-left: 7%;
  }
  .hamburguer-menu span {
    display: block;
    width: 25px;
    height: 1px;
    background: var(--white-default);
    border-radius: 2px;
    transition: 0.3s;
  }
</style>
