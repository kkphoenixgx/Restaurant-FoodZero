<template>
  <div class="contact-section">
    <HeaderPush />
    <div class="contact-page">
      <h1>Contato</h1>
      <p>Entre em contato conosco para dúvidas, sugestões ou reservas. Em breve, um formulário estará disponível aqui.</p>
      <div class="contact-form-dummy">
        <input type="text" placeholder="Seu nome" />
        <input type="email" placeholder="Seu e-mail" />
        <textarea rows="5" placeholder="Sua mensagem"></textarea>
        <button type="button" @click="$router.push('/reservation')">Fazer uma Reserva Especial</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import HeaderPush from '../../components/ui/HeaderPush.vue';

// Página de contato genérica
</script>

<style scoped>
.contact-page {
  max-width: 800px;
  margin: 3rem auto;
  padding: 4rem;
  color: #222;
  background: #fff8f0;
  border-radius: 1.5rem;
  box-shadow: 0 10px 30px rgba(184, 92, 56, 0.05);
  text-align: center;
}
.contact-page h1 {
  font-size: 3rem;
  margin-bottom: 2rem;
  color: #b85c38;
  font-family: 'Rufina', serif;
}
.contact-page p {
  font-size: 1.2rem;
  margin-bottom: 2.5rem;
  line-height: 1.8;
  color: #444;
}
.contact-form-dummy {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  max-width: 500px;
  margin: 0 auto;
}
.contact-form-dummy input, .contact-form-dummy textarea {
  padding: 1rem;
  border-radius: 0.6rem;
  border: 1px solid #e0cfc2;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
}
.contact-form-dummy button {
  padding: 1rem;
  background: #b85c38;
  color: white;
  border: none;
  border-radius: 0.6rem;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}
.contact-form-dummy button:hover {
  background: #a14d2c;
}
</style>
