<template>
  <ClickGame />
</template>

<script setup>
import ClickGame from './components/ClickGame.vue';
</script>

<style lang="scss">
html, body, #app {
  height: 100vh;
  height: 100dvh;
  margin: 0;
  touch-action: manipulation;
  overscroll-behavior-y: none;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
body {
  background: var(--bg-color);
  --border-color: #eee;
  --text-color: #2c3e50;
  --bg-color: #fff;
  --card-bg-color: #fff;
  --card-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  --mask-color: rgba(255, 255, 255, 0.8);
  --zero-bg-color: #ddffdd;
  --one-bg-color: #f5f5f5;
  --two-bg-color: #e5e5e5;
  &.dark {
    --border-color: #444;
    --text-color: #eee;
    --bg-color: #333;
    --card-bg-color: #3d3d3d;
    --card-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    --mask-color: rgba(51, 51, 51, 0.8);
    --zero-bg-color: rgba(210, 210, 210, 0.90);
    --one-bg-color: rgba(160, 160, 160, 0.90);
    --two-bg-color: rgba(125, 125, 125, 0.90);
  }
}
</style>
