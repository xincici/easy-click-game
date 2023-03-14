import { ref, watchEffect } from 'vue';

const STORAGE_KEY = '__easy_click_game__theme';

export const theme = ref(localStorage.getItem(STORAGE_KEY) || 'light');

watchEffect(() => {
  localStorage.setItem(STORAGE_KEY, theme.value);
});
