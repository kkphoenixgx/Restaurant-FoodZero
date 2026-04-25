<template>
  <div class="reservation-form">

    <div class="header">
      <h1>Make a Reservation</h1>
      <p>Get in touch with the restaurant</p>
    </div>

    <form @submit.prevent="handleSubmit">
      <img :src="formFlower" alt="Decorative Flower">
 
      <DefaultInput class="reservation-input" type="number" text="Quantity of persons" v-model="form.personsQuantity" placeholder-color="#000" />

      <div class="date">
        <DefaultInput class="reservation-input" type="date" text="--/--/--" v-model="form.date" placeholder-color="#000"/>
        <select v-model="form.time">
          <option value="11:00">11:00 am</option>
          <option value="12:00">12:00 am</option>
          <option value="13:00">01:00 pm</option>
          <option value="14:00">2:00 pm</option>
          <option value="15:00">3:00 pm</option>
          <option value="16:00">4:00 pm</option>
          <option value="17:00">5:00 pm</option>
          <option value="18:00">6:00 pm</option>
          <option value="19:00">7:00 pm</option>
          <option value="20:00">8:00 pm</option>
          <option value="21:00">9:00 pm</option>
          <option value="22:00">10:00 pm</option>  
        </select>
      </div>

      <FilledButton type="submit" text="Book Now" />
    </form>

    <DefaultToast v-if="showToast" :color="toastColor" :text="toastText" />
  </div>
</template>

<script setup lang="ts">

import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { createReservation } from '../../../services/reservation';

import formFlower from "../../../assets/images/form-flower-Mint.png"

import FilledButton from '../../../components/ui/FilledButton.vue';
import DefaultInput from '../../../components/ui/DefaultInput.vue';

import DefaultToast from '../../../components/ui/DefaultToast.vue';

import User from '../../../types/Model/User';


const form = reactive({
  date: '',
  time: '11:00',
  personsQuantity: 1,
});

const router = useRouter();

let showToast = ref(false);
let toastText = ref('Success');
let toastColor = ref('green');

function getUserFromLocalStorage(): User | null {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

async function handleSubmit() {
  const user = getUserFromLocalStorage();

  if(!user){
    showToast.value = true;
    toastColor.value = "blue";
    toastText.value = 'Subscribe First!';
    setTimeout(() => {
      router.push('/subscribe');
    }, 1000);
    return;
  }
  
  const reservationTime = new Date(`${form.date}T${form.time}`);
  
  const reservation = {
    reservationTime,
    personsQuantity: form.personsQuantity,
    user: user,
  };

  try {
    await createReservation(reservation);
    showToast.value = true;
    toastColor.value = "green";
    toastText.value = 'Reserva realizada com sucesso!';
    
  } catch (e) {
    showToast.value = true;
    toastColor.value = "red";
    toastText.value = 'Erro ao criar reserva.';
    console.error(e);
  }
}
</script>

<style scoped>

  .reservation-form{
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    background-color: var(--white-secondary);
    color: black;
    position: relative;
  }

  img{
    width: 200px;
    position: absolute;
    top: 4%;
    left: 10%;
  }

  .header{
    color: var(--black-default);
    margin: 9% 0 4% 0;
  }
  h1{
    font-size: 3.5rem;
  }
  p{
    font-size: 1.1rem;
  }
  
  form{
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    width: 80%;
    margin-bottom: 9%;
  }

  .reservation-input{
    border-color: var(--black-default);
    color: var(--black-default);
    width: 100%;
    padding: 1%;
    height: 7vh;
    margin-bottom: 3vh;
  }

  .name, .date{
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
  }
  .name input, .date input{
    width: 48%;
  }
  .date input{
    width: 70%
  }
  
  select{
    color: var(--black-default);
    margin-bottom: 3vh;
    padding: 1%;
    height: 7vh;
  }

</style>
