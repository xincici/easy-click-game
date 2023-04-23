<template>
  <div class="toggle-wrapper">
    <Toggle v-model="audioPlay" trueValue="play" falseValue="pause" onLabel="🔊" offLabel="🔇" class="mr20" />
    <Toggle v-model="theme" trueValue="dark" falseValue="light" onLabel="🌙" offLabel="🌝" class="theme-toggle mr20" />
    <Toggle v-model="language" trueValue="en" falseValue="cn" onLabel="EN" offLabel="中文" />
    <audio :src="audio" ref="audioRef" loop="true"></audio>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import Toggle from '@vueform/toggle';
import '@vueform/toggle/themes/default.css';

import audio from '../assets/yzcw.mp3';
import { language } from '../plugins/i18n';
import { theme } from '../utils/theme';

const audioRef = ref(null);
const audioPlay = ref(false);

onMounted(() => {
  watch(audioPlay, val => {
    if (val === 'play') audioRef.value.play();
    else audioRef.value.pause();
  });
});
</script>

<style scoped lang="scss">
.toggle-wrapper {
  padding: 15px;
  text-align: right;
  .mr20 {
    margin-right: 20px;
  }
  .theme-toggle :deep(.toggle-on) {
    background: #222;
    border-color: #222;
  }
  .toggle-wrapper {
    margin: 0 5%;
    text-align: right;
  }
}
</style>
