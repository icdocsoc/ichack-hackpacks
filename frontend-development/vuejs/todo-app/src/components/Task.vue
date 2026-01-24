<script lang="ts">
export default {
  props: {
    name: String,
    description: String,
  }
}
</script>

<template>
  <div class="row box">
    <div class="columnl">
      <button class="box" v-on:click="$emit('task_completed')">Done</button>
    </div>
    <div class="columnr">
      <h4>{{ name }}</h4>
      <p>{{ description }}</p>
    </div>
  </div>
</template>
