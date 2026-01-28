<script lang="ts">
export default {
  data() {
    return {
      count: 0
    }
  },
}
</script>

<template>
  <button v-on:click="count++">Count is: {{ count }}</button>
</template>

<style scoped></style>
