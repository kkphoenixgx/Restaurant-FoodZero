<template>
  <Header/>
  
  <section>
    <router-view />
  </section>
  
  <Footer/>
</template>

<script setup lang="ts">
  import Header from './components/layout/Header/Header.vue';
  import Footer from './components/layout/Footer.vue';
</script>

<style scoped>
section{
  min-height: 88.5vh;
}
</style>
