<template>
  <div class="header-wrapper">
    <span class="item-wrapper left">
      <HelpDialog />
    </span>
    <span class="item-wrapper left" @click="audioPlay = !audioPlay">
      <img :src="pauseIcon" v-if="audioPlay" />
      <img :src="playIcon" v-else />
    </span>
    <span class="title">{{ i18n('gameTitle') }}</span>
    <span class="item-wrapper" @click="toggleLanguage">
      <img class="small" :src="cnIcon" v-if="language === 'cn'" />
      <img class="small" :src="enIcon" v-else />
    </span>
    <span class="item-wrapper" @click="toggleTheme">
      <img :src="darkIcon" v-if="theme === 'dark'" />
      <img :src="lightIcon" v-else />
    </span>
    <audio :src="audio" ref="audioRef" loop="true"></audio>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import HelpDialog from './HelpDialog.vue';

import cnIcon from '../assets/cn-icon.svg';
import enIcon from '../assets/en-icon.svg';
import darkIcon from '../assets/dark-icon.svg';
import lightIcon from '../assets/light-icon.svg';
import playIcon from '../assets/play-icon.svg';
import pauseIcon from '../assets/pause-icon.svg';

import audio from '../assets/yzcw.mp3';
import { language, toggle as toggleLanguage } from '../plugins/i18n';
import { theme, toggle as toggleTheme } from '../utils/theme';

const audioRef = ref(null);
const audioPlay = ref(false);

onMounted(() => {
  watch(audioPlay, val => {
    if (val) audioRef.value.play();
    else audioRef.value.pause();
  });
});
</script>

<style scoped lang="scss">
.header-wrapper {
  max-width: 600px;
  margin: 0 auto;
  padding: 10px 8px;
  text-align: center;
  &:after {
    content: " ";
    display: table;
    clear: both;
  }
  .mr20 {
    margin-right: 20px;
  }
  .title {
    font-size: 16px;
    font-weight: bold;
    line-height: 28px;
  }
  .item-wrapper {
    cursor: pointer;
    margin: 0 8px;
    display: inline-block;
    float: right;
    &.left {
      float: left;
    }
    img {
      width: 24px;
      vertical-align: middle;
      &.small {
        width: 20px;
      }
    }
  }
}
</style>
