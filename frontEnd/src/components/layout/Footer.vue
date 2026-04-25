<template>
  <footer>
    <div class="grid-container">
      <div class="text-logo">
        <div class="text">
          <p>Food</p>
          <p>Zero.</p>
        </div>
      </div>
      <div class="contact">
        <h3>Contact</h3>
        <div class="contact-links">
          <DefaultLink class="smaller-text" type="tel" text="+86 852 346 000" />
          <DefaultLink class="smaller-text" type="mailto" text="info@foodzero.com" />
          <DefaultLink class="smaller-text contact-adress" type="https" label="1959 Sepulveda Blvd. Culver City, CA, 90230" text="https://www.google.com/maps/place/1959+Sepulveda+Blvd,+Culver+City,+CA+90230,+EUA/data=!4m2!3m1!1s0x80c2ba478e1c0e95:0x2a8789f8cf9f9766?sa=X&ved=1t:242&ictx=111" />
        </div>
      </div>
      <div class="subscribe">
        <h3>Never Miss a Recipe</h3>
        
        <div class="subscribe-form">
          <DefaultInput class="subscribeEmailInput" type="email" text="Email Adress" />
          <FilledButton text="Subscribe" @click="handleSubscribe" />
        </div>
        
        <DefaultToast v-if="showToast" :color="toastColor" :text="toastText" />
        <p class="smaller-text" >Join our subscribers and get best recipe delivered each week!</p>

      </div>
    </div>
    
    <div class="comercial-footer">
      <div class="dotted-line"></div>
     
      <div class="comercial-container">
        <p class="medium-text" >© 2020 Zero Inc. All rights Reserved</p>
        
        <div class="icons">
          <a href="#"> <img :src="iconFacebook" alt="icon fecebook"> </a>
          <a href="#">  <img :src="iconInstagram" alt="icon instagram"> </a>
          <a href="#">  <img :src="iconTwetter" alt="icon tweeter"> </a>
          <a href="#">  <img :src="iconYoutube" alt="icon youtube"> </a>
        </div>
      </div>


    </div>

  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import iconFacebook from "../../assets/images/icon-facebook.png"
import iconInstagram from "../../assets/images/icon-instagram.png"
import iconTwetter from "../../assets/images/icon-twetter.png"
import iconYoutube from "../../assets/images/icon-youtube.png"

import DefaultLink from "../ui/DefaultLink.vue"
import FilledButton from "../ui/FilledButton.vue"
import DefaultInput from "../ui/DefaultInput.vue"
import DefaultToast from '../ui/DefaultToast.vue'

const showToast = ref(false);
const toastText = ref('');
const toastColor = ref('');

function handleSubscribe(){
  toastText.value = 'Feature ainda não implementada!';
  showToast.value = true;
  toastColor.value = "rgba(178, 4, 4, 0.848)";
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
}

</script>

<style scoped>

footer{
  display: flex;
  padding: 3%;
  align-content: center;
  flex-direction: column;
  background-color: var(--green-secondary-havier);
  color: var(--white-default);

}

.grid-container {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  align-items: center;
}

.text-logo, .contact{
  padding: 10%;
}

.text-logo {
  grid-column: 1 / 2;
  font-size: 2.8rem;
  margin: 0 auto;
}
.text{
  width: 100%;
  display: flex;
  flex-direction: column;
}
.contact {
  grid-column: 2 / 3;
}
.subscribe {
  grid-column: 3 / 4;
}

.subscribeEmailInput{
  margin-right: 3%;
}

h3{
  font-size: 1.5rem;
  margin-bottom: 3%;
}

.contact-links {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
}
.contact-adress {
  margin-top: 0;
  word-break: break-word;
  white-space: normal;
}
.smaller-text{
  font-size: 1rem;
}
.medium-text{
  font-size: 1.1rem;
}

.subscribe-form{
  display: flex;
}

.comercial-footer{
  display: flex;
  flex-direction: column;
}
.comercial-container{
  display: flex;
  justify-content: space-between;
}

.comercial-container p{
  margin-left: 5%;
}
.dotted-line {
  width: 100%;
  border-bottom: 1px dashed var(--white-default);
  margin-bottom: 3%;
}

.icons{
  display: flex;
  margin-right: 5%;
}
.icons a{
  height: fit-content;
  display: block;
  width: fit-content;
  margin-right: 6%;
}
.icons img{
  width: 13px;
}


</style>
