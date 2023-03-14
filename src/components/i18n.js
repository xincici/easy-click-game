import { ref, watchEffect } from 'vue';

const en = {
  gameTitle: 'Easy Click Game',
  bestScore: 'Best Score',
  availableClicks: 'Avaliable Clicks',
  start: 'Start',
  helpTip: 'Click for help!',
  helpMsg: `Clicking a block will increase the numbers inside the block and its upper, lower, left and right blocks (if any) by 1. When the number is 2, adding 1 to it will make it become 0. 
Find a way to make all the numbers become 0 to win the game. If there are no more moves left and the player has not won, the game will be lost.`,
  help1: 'Difficulty of the game is 3 ~ 10.',
  help2: 'Every new game is guaranteed to have a feasible solution.',
  help3: 'The initial available number of clicks in the game is the square of the current game difficulty.',
  confirmText: 'OK, I See',
  newBest: 'New Best Score',
  tipWin: 'You Win',
  tipLost: 'You Lose'
};
const cn = {
  gameTitle: '点击游戏',
  bestScore: '最佳得分',
  availableClicks: '剩余点击',
  start: '开始',
  helpTip: '查看帮助',
  helpMsg: `点击一个方块，方块本身和它上下左右四个方块（如果有的话），内部数字都会加 1，当数字是 2 的时候，再加 1 则变为 0。
想办法让所有数字都变为 0 来赢得游戏。当剩余可点击次数为 0 时，如果仍然没有获胜，则游戏失败。`,
  help1: '游戏难度 3 ~ 10',
  help2: '每个新游戏都保证有可行解',
  help3: '游戏的剩余点击次数是当前游戏难度的平方',
  confirmText: '好的，明白',
  newBest: '新纪录诞生',
  tipWin: '你赢了',
  tipLost: '你输了'
};
const STORAGE_KEY = '__easy_click_game__language';

const langs = { en, cn };

export const language = ref(localStorage.getItem(STORAGE_KEY) || 'en');

watchEffect(() => {
  document.title = langs[language.value]['gameTitle'];
  localStorage.setItem(STORAGE_KEY, language.value);
});

export default {
  install: app => {
    app.config.globalProperties.i18n = fullKey => {
      return fullKey.split('.').reduce((obj, key) => {
        if (obj) return obj[key];
      }, langs[language.value]);
    };
  }
}