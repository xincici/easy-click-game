import { ref, watchEffect } from 'vue';

const STORAGE_KEY = '__easy_click_game__theme';
const themeColor = {
  dark: '#444',
  light: '#fff'
};

export const theme = ref(localStorage.getItem(STORAGE_KEY) || 'light');

watchEffect(() => {
  localStorage.setItem(STORAGE_KEY, theme.value);
  document.querySelector('meta[name="theme-color"]').setAttribute('content', themeColor[theme.value]);
});
