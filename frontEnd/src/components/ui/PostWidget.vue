
<template>
  <div class="widget-post">
    
    <div v-if="props.tags" class="tags">
      
      <div v-for="tag in props.tags" :key="tag.id" class="tag-list">
        <div class="tag"> {{ tag.name }} </div>
      </div>

    </div>

    <div class="user">
      <img :src="userImage" @error="onImgError" alt="imagem de usuário">
      <span>Autor: {{ props.user?.name || 'Desconhecido' }}</span>
      <span v-if="props.date">Data: {{ new Date(props.date).toLocaleDateString() }}</span>
      <span>{{ props.comentaries || 0 }} coments</span>
    </div>
    <div class="dot-line"></div>
    <p>{{ props.description }}</p>
    <router-link :to="'/blog/'+props.id" class="post-link">
      <p>Read More</p>
      <img :src="arrowIcon" alt="arrow icon">
    </router-link>
    
  </div>
</template>

<script setup lang="ts">

import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';
import defaultUserImage from "../../assets/images/user-default.png"
import arrowIcon from "../../assets/images/icon-arrow.png"

const props = defineProps<{
  id :number,
  imagePath: string,
  description: string,
  tags: any[],
  user: any,
  date: Date,
  comentaries: number
}>();


const defaultServer = import.meta.env.VITE_API_SERVER || (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'https://backendrestaurantfoodzero-production.up.railway.app');
const userImageSrc = ref('');

const userImage = computed(() => {
  if (userImageSrc.value) return userImageSrc.value;
  const path = props.imagePath;
  if (!path || path === 'null' || path === 'undefined') return defaultUserImage;
  
  if (path.startsWith('http') || path.startsWith('data:') || path.includes('assets') || path.includes('src')) return path;
  
  const baseUrl = defaultServer.endsWith('/') ? defaultServer.slice(0, -1) : defaultServer;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${baseUrl}/${cleanPath}`;
});

function onImgError() {
  userImageSrc.value = defaultUserImage;
}

</script>

<style scoped>

.widget-post{
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 1rem;
  padding: 1.5rem;
  background: #fff;
}
.widget-post:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.1);
}


@media (max-width: 900px) {
  .widget-post {
    max-width: 100vw;
    min-width: 0;
    width: 100%;
  }
}
.widget-post h3{
  font-size: 1.8rem; 
  width: 100%;
  text-align: center;
}

.widget-post p{
  font-size: 1.1rem;
  line-height: 1.5;
  margin: 0.5rem 0;
}

.tags{
  max-width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.user{
  display: flex;
  gap: 4%;
  align-items: center;
  font-size: 1rem;
  margin: 0.5rem 0;
  flex-wrap: wrap;
}
.user img{
  width: 20px;
}
.tag-list{
  background-color: #000000cc;
  text-align: center;
  color: var(--white-default);
  padding: 0.2rem 0.8rem;
  border-radius: 4px;
  white-space: nowrap;
}

.dot-line {
  width: 100%;
  border-bottom: 1px dashed var(--black-default);
}


.post-link img{
  height: 8px;
}
.post-link{
  display: flex;
  text-decoration: none;
  color: black;
  align-items: center;
  gap: 1%;
}


</style>
