import { ref, watch } from 'vue';

const en = {
  bestScore: 'Best Score',
  availableClicks: 'Avaliable Clicks',
  start: 'Start',
  helpTip: 'Click for help!',
  helpMsg: `Clicking a block will increase the numbers inside the block and its upper, lower, left and right blocks (if any) by 1.
When the number is 2, adding 1 to it will make it become 0. Find a way to make all the numbers become 0 to win the game, which is guaranteed to have a feasible solution. If there are no more moves left and the player has not won, the game will be lost.`,
  newBest: 'New Best Score',
  tipWin: 'You Win',
  tipLost: 'You Lose'
};
const cn = {
  bestScore: '最佳得分',
  availableClicks: '剩余点击',
  start: '开始',
  helpTip: '查看帮助',
  helpMsg: `点击一个方块，方块本身和它上下坐右四个方块(如果有的话)
内部数字都会加 1，当数字是 2 的时候，再加 1 则变为 0
想办法让所有数字都变为 0 来赢得游戏，游戏保证有可行解
当剩余可点击次数为 0 时，如果仍然没有获胜，则游戏失败`,
  newBest: '新纪录诞生',
  tipWin: '你赢了',
  tipLost: '你输了'
};
const BEST_STORAGE_KEY = '__easy_click_game__';

const langs = {
  en, cn
}

export const language = ref(localStorage.getItem(`${BEST_STORAGE_KEY}language`) || 'en');

watch(language, val => {
  language.value = val;
  localStorage.setItem(`${BEST_STORAGE_KEY}language`, val);
}, { immediate: true });

export const i18n = function(key) {
  return langs[language.value][key];
};