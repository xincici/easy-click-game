<template>
  <ClickGame />
</template>

<script setup>
import ClickGame from './components/ClickGame.vue';
</script>

<style lang="scss">
html, body, #app {
  height: 100%;
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
body {
  --border-color: #eee;
  --text-color: #2c3e50;
  --bg-color: #fff;
  --mask-color: rgba(255, 255, 255, 0.8);
  --zero-bg-color: #ddffdd;
  --one-bg-color: #f5f5f5;
  --two-bg-color: #e5e5e5;
  &.dark {
    --border-color: #444;
    --text-color: #eee;
    --bg-color: #333;
    --mask-color: rgba(20, 20, 20, 0.8);
    --zero-bg-color: rgba(210, 210, 210, 0.90);
    --one-bg-color: rgba(160, 160, 160, 0.90);
    --two-bg-color: rgba(125, 125, 125, 0.90);
  }
}
</style>
