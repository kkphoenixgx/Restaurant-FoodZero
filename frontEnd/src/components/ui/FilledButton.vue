
<template>
  <button
    class="default-button"
    :type="props.type ?? 'button'"
  >
    {{ props.text }}
  </button>
</template>

<script setup lang="ts">

const props = defineProps<{
  text: string,
  type?: 'button' | 'submit' | 'reset'
}>();

</script>

<style scoped>

.default-button{
  width: 15vw;
  max-width: 150px;
  min-width: fit-content;
  padding:10px;
  border: none;
  
  background-color: var(--green-seconday);
  color: var(--white-default);

  cursor: pointer;  
}

button:active{
  background-color: var(--green-havier);
}

</style>
