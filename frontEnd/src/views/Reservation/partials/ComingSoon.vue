
<template>
  <div class="coming-soon-wrapper">
    <HeaderPush />
    <div class="coming-soon-container" 
      :style="{ 
        backgroundImage: `linear-gradient(rgba(23,30,0,0.75), rgba(23,30,0, 0.90) ), url(${ComingSoonBg})` 
      }"
    >
    
    <div class="header">
      <h1>COMING SOON</h1>
      <div class="dotted-line"></div>
    </div>

    <div class="countdown">
      <span>
        <strong>{{ pad(months) }}</strong>
        <p>meses</p>
      </span>
      <span>
        <strong>{{ pad(days) }}</strong>
        <p>dias</p>
      </span>
      <span>
        <strong>{{ pad(hours) }}</strong>
        <p>horas</p>
      </span>
      <span>
        <strong>{{ pad(minutes) }}</strong>
        <p>minutos</p>
      </span>
      <span>
        <strong>{{ pad(seconds) }}</strong>
        <p>segundos</p>
      </span>
    </div>

    <DefaultButton text="View Menu" link="/menu" />
    </div>
  </div>

</template>


<script setup lang="ts">

import { ref, onMounted, onUnmounted } from 'vue';

import ComingSoonBg from "../../../assets/images/coming-soon-bg.png"
import DefaultButton from '../../../components/ui/DefaultButton.vue';
import HeaderPush from '../../../components/ui/HeaderPush.vue';

let comingSoonControl = false;

// 12 de junho de 2025, 11:00:00
const targetDate = new Date('2025-06-12T11:00:00');

const months = ref(0);
const days = ref(0);
const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);
let intervalId: number | undefined;

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

onMounted(() => {
  updateCountdown();
  intervalId = setInterval(updateCountdown, 1000);
});
onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});

function updateCountdown() {
  const now = new Date();
  let diff = targetDate.getTime() - now.getTime();
  if (diff < 0) diff = 0;

  // Cálculo de meses
  let start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());
  let end = new Date(targetDate);
  let m = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  let temp = new Date(start);
  temp.setMonth(temp.getMonth() + m);
  if (temp > end) {
    m--;
    temp.setMonth(temp.getMonth() - 1);
  }
  months.value = Math.max(0, m);

  let remainder = end.getTime() - temp.getTime();
  // Dias
  let d = Math.floor(remainder / (1000 * 60 * 60 * 24));
  remainder -= d * (1000 * 60 * 60 * 24);
  days.value = Math.max(0, d);
  // Horas
  let h = Math.floor(remainder / (1000 * 60 * 60));
  remainder -= h * (1000 * 60 * 60);
  // Minutos
  let min = Math.floor(remainder / (1000 * 60));
  remainder -= min * (1000 * 60);
  // Segundos
  let sec = Math.floor(remainder / 1000);

  if (diff === 0) {
    months.value = 0;
    days.value = 0;
    h = 0;
    min = 0;
    sec = 0;
  }

  hours.value = h;
  minutes.value = min;
  seconds.value = sec;
}

</script>

<style scoped>



.coming-soon-container {
  height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  
  font-family: 'Rufina';
  font-weight: 400;
  color: var(--white-default);
}

.header{
  width: 45vw;
  text-align: center;
}

h1{
  font-family: 'Rufina';
  font-size: 2rem;
  font-weight: 700;
}

span{
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
}

p{
  font-size: 0.8rem;
}

.dotted-line {
  width: 100%;
  border-bottom: 1px dashed var(--white-default);
  margin-bottom: 5%;
}

.countdown {
  display: flex;
  gap: 1.5rem;
  font-size: 2rem;
  margin-top: 2rem;
  margin-bottom: 2rem;
}
.countdown span strong {
  font-size: 2.5rem;
  font-family: 'Rufina', serif;
  margin-right: 0.25em;
}

</style>
