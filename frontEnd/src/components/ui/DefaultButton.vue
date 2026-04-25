
<template>
  <a v-if="props.link"
    :href="props.link"
    class="default-button-link"
  >
    <button class="default-button">{{ props.text }}</button>
  </a>

  <button v-else class="default-button" >
    {{ props.text }}
  </button>
  
</template>

<script setup lang="ts">

const props = defineProps<{
  text: string,
  link?: string
}>();

</script>

<style scoped>
.default-button-link {
  text-decoration: none;
}
.default-button {
  width: 15vw;
  max-width: 150px;
  min-width: fit-content;
  padding: 10px;
  background-color: transparent;
  color: var(--white-default);
  border: 1px solid var(--white-default);
  cursor: pointer;
}
</style>
