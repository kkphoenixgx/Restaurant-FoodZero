
<template>
  <a
    v-if="props.type === 'https' || props.type === 'http'"
    :href="props.text"
    target="_blank"
    rel="noopener noreferrer"
  >
    {{ props.label}}
  </a>

  <a
    v-else
    :href="props.type + ':' + props.text"
  >
    {{ props.text }}
  </a>

</template>

<script setup lang="ts">
const props = defineProps<{
  type: string,
  text: string,
  label?: string
}>();
</script>

<style scoped>

a{
  font-family: 'Inter';
  text-decoration: none;
  color: var(--white-default);
  font-size: 0.8rem;
  min-width: fit-content;
  margin-top: 1%;
}

</style>
