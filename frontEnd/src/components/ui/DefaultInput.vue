<template>
  <input
    :type="props.type"
    :placeholder="props.text"
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    required
    v-bind="$attrs"
    :class="props.class"
    :style="props.placeholderColor ? { '--placeholder-color': props.placeholderColor } : {}"
  />
</template>

<script setup lang="ts">

const props = defineProps<{
  text: string,
  type: string,
  class?: string,
  placeholderColor?: string,
  modelValue?: string | number
}>();

defineEmits(['update:modelValue']);
defineOptions({ inheritAttrs: false });
</script>

<style scoped>



input {
  padding:2%;
  width: 55%;
  background-color: transparent;
  color: var(--white-default);
  border:1px solid var(--white-default);
  outline: none;
}




input::placeholder {
  color: var(--placeholder-color, var(--white-default)) !important;
  opacity: 1;
}

input:focus {
  outline: none;
  box-shadow: none;
}


</style>
