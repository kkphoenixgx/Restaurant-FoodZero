<template>
  <HeaderPush />
  <section class="portifolio-page">
    <h1>Portfólio</h1>
    <p>Veja alguns dos nossos trabalhos, eventos e pratos especiais.</p>
  </section>
</template>

<script setup lang="ts">
import HeaderPush from '../../components/ui/HeaderPush.vue';

// Página de portfólio genérica
</script>

<style scoped>
.portifolio-page {
  max-width: 700px;
  margin: 0 auto;
  padding: 3rem 1rem;
  color: #222;
}
.portifolio-page h1 {
  font-size: 2.2rem;
  margin-bottom: 1.5rem;
  color: #b85c38;
}
.portifolio-page p {
  font-size: 1.1rem;
  margin-bottom: 1.2rem;
  line-height: 1.7;
}
</style>
