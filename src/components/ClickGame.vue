<template>
  <div class="wrapper" :class="theme">
    <p class="toggle-wrapper">
      <Toggle v-model="audioPlay" trueValue="play" falseValue="pause" onLabel="🔊" offLabel="🔇" class="mr20" />
      <Toggle v-model="theme" trueValue="dark" falseValue="light" onLabel="🌙" offLabel="🌝" class="theme-toggle mr20" />
      <Toggle v-model="language" trueValue="en" falseValue="cn" onLabel="EN" offLabel="中文" />
    </p>
    <h2><span class="title">{{ i18n('gameTitle') }}</span> <span class="help" :title="i18n('helpTip')" @click="helpShow = true"><font-awesome-icon icon="fa-solid fa-circle-question" /></span></h2>
    <p>{{ i18n('bestScore') }}: {{ bestScore || '--' }} 🍔 {{ i18n('availableClicks') }}: {{ maxClick - clickCount }}</p>
    <p>
      <button @click="changeDifficulty(-1)" class="opt-icon" :class="{disable: difficulty === MIN_DIFFICULTY}">--</button>
      {{ difficulty }}
      <button @click="changeDifficulty(1)" class="opt-icon" :class="{disable: difficulty === MAX_DIFFICULTY}">+</button>
      <button @click="initGame" class="reset-icon">{{ i18n('start') }}</button>
    </p>
    <div class="game-area" :class="`cell-${cellSize}`">
      <div v-for="(item, idx_row) in gameData" :key="idx_row">
        <div class="cell" v-for="(cell, idx_col) in item" :key="idx_col">
          <div class="mask" v-show="maskData[idx_row][idx_col] === 0"></div>
          <button class="inner" :class="{zero: cell === 0, one: cell === 1, two: cell === 2}" @click="onCellClick(idx_row, idx_col)">{{ cell }}</button>
        </div>
      </div>
      <div v-if="gameResult >= WIN" class="win">
        <span>🎉🎉 {{ i18n('tipWin') }} 🎉🎉</span>
        <span v-if="gameResult === NB">{{ i18n('newBest') }}</span>
      </div>
      <div v-if="gameResult === LOSE" class="lose">👻👻 {{ i18n('tipLost') }} 👻👻</div>
    </div>
    <HelpDialog :help-show="helpShow" @hideHelp="helpShow = false" />
    <audio :src="audio" ref="audioRef" loop="true"></audio>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, watchEffect, onMounted } from 'vue';
import Toggle from '@vueform/toggle';
import '@vueform/toggle/themes/default.css';
import audio from '../assets/yzcw.mp3';
import HelpDialog from './HelpDialog.vue';
import { language } from './i18n';
import { theme } from './theme';
import { difficulty, changeDifficulty, MIN_DIFFICULTY, MAX_DIFFICULTY } from './difficulty';

const BIG_VAL = 3;
const [GAMING, LOSE, WIN, NB] = [0, 1, 2, 3];
const [TINY, MINI, SMALL, MIDDLE, LARGE] = ['tiny', 'mini', 'small', 'middle', 'large'];

const neighbours = [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]];
const clickCount = ref(0);
const gameResult = ref(GAMING);
const helpShow = ref(false);
const audioPlay = ref(false);
const audioRef = ref(null);
const storageKey = computed(() => `__easy_click_game__${difficulty.value}`);
const maxClick = computed(() => Math.pow(difficulty.value, 2));
const cellSize = computed(() => difficulty.value <= 4 ? LARGE : difficulty.value <= 6 ? MIDDLE : difficulty.value <= 8 ? SMALL : difficulty.value <= 9 ? MINI : TINY);
const bestScore = ref(localStorage.getItem(storageKey.value));

let gameData, maskData;
let animationFrameId = null;

const randomOnce = max => [Math.floor(Math.random() * max), Math.floor(Math.random() * max)];
const randomData = length => Array.from({ length }, () => Array.from({ length }, () => 0));

watchEffect(() => {
  bestScore.value = localStorage.getItem(storageKey.value);
});
watch(difficulty, initGame, { immediate: true });
watch(gameResult, val => {
  if (val === WIN) updateBestScore();
});
onMounted(() => {
  watch(audioPlay, val => {
    if (val === 'play') audioRef.value.play();
    else audioRef.value.pause();
  });
});

function initGame() {
  gameData = reactive(randomData(difficulty.value));
  maskData = reactive(randomData(difficulty.value));
  randomSomeOperations();
  gameResult.value = GAMING;
  clickCount.value = 0;
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  toggleMask(0);
}
function randomSomeOperations() {
  for (let i = 0; i < difficulty.value - 1 << 1; i++) {
    const [row, col] = randomOnce(difficulty.value);
    onCellClick(row, col);
    if (Math.random() < 0.5) {
      onCellClick(row, col);
    }
  }
}
function toggleMask(idx) {
  const row = ~~(idx / difficulty.value);
  const col = idx % difficulty.value;
  maskData[row][col] = 1;
  if (idx + 1 < difficulty.value * difficulty.value) {
    animationFrameId = requestAnimationFrame(() => {
      toggleMask(idx + 1);
    });
  }
}
function updateBestScore() {
  const score = maxClick.value - clickCount.value;
  if (!bestScore.value || bestScore.value < score) {
    localStorage.setItem(storageKey.value, score);
    bestScore.value = score;
    gameResult.value = NB;
  }
}
function onCellClick(row, col) {
  clickCount.value++;
  neighbours.forEach(([iRow, iCol]) => {
    iRow += row;
    iCol += col;
    if (iRow < 0 || iRow >= difficulty.value) return;
    if (iCol < 0 || iCol >= difficulty.value) return;
    gameData[iRow][iCol] = (gameData[iRow][iCol] + 1) % BIG_VAL;
  });
  checkResult();
  if (clickCount.value === maxClick.value && gameResult.value !== WIN) {
    gameResult.value = LOSE;
  }
}
function checkResult() {
  for (let i = 0; i < difficulty.value; i++) {
    for (let j = 0; j < difficulty.value; j++) {
      if (gameData[i][j] !== 0) return;
    }
  }
  gameResult.value = WIN;
}

</script>

<style scoped lang="scss">
.wrapper {
  width: 100vw;
  min-height: 100vh;
  padding: 40px 0;
  box-sizing: border-box;
  color: #2c3e50;
  &.dark {
    background: rgba(0, 0, 0, 0.85);
    color: #eee;
    .game-area {
      .win,.lose {
        background-color: #333;
      }
      .cell .inner {
        background: rgba(160, 160, 160, 0.90);
        &.two {
          background: rgba(125, 125, 125, 0.90);
        }
        &.zero {
          background: rgba(210, 210, 210, 0.90);
        }
      }
    }
  }
  button {
    touch-action: manipulation;
  }
  .mr20 {
    margin-right: 20px;
  }
  ::v-deep .theme-toggle .toggle-on {
    background: #444;
    border-color: #444;
  }
  .toggle-wrapper {
    margin: 0 5%;
    text-align: right;
  }
  .title,.help {
    vertical-align: middle;
    display: inline-block;
  }
  .help {
    cursor: pointer;
    font-size: 20px;
    color: #cc3333;
  }
  .opt-icon,.reset-icon {
    cursor: pointer;
    display: inline-block;
    border: 1px solid #e1e1e1;
    padding: 2px;
    width: 25px;
    height: 30px;
    margin: 0 4px;
    text-align: center;
    font-style: normal;
    font-weight: bold;
    letter-spacing: -3px;
    &.disable {
      color: #e1e1e1;
    }
  }
  .reset-icon {
    margin-left: 10px;
    width: 50px;
    font-weight: bold;
    background: rgba(60, 160, 60, 0.9);
    color: #fff;
    letter-spacing: normal;
    border: 0 none;
  }
  .game-area {
    display: inline-block;
    position: relative;
    padding: 10px;
    .win,.lose {
      background-color: #f1f1f1;
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      opacity: 0.95;
      font-weight: bold;
      color: #11aa11;
      font-size: 18px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .lose {
      color: #aa1111;
    }
    .cell {
      display: inline-block;
      margin: 2px;
      position: relative;
      .mask {
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 1;
        background: #ccc;
      }
      .inner {
        cursor: pointer;
        display: block;
        width: 44px;
        height: 44px;
        line-height: 44px;
        padding: 0;
        border: 1px solid #e1e1e1;
        font-size: 16px;
        font-weight: bold;
        background-color: #f5f5f5;
        color: #222;
        &.zero {
          background-color: #ddffdd;
        }
        &.two {
          background-color: #e5e5e5;
        }
      }
    }
  }
}
@media only screen and (min-width: 320px) and (max-width: 720px) {
  .wrapper .game-area {
    &.cell-large .cell .inner {
      width: 50px;
      height: 50px;
      line-height: 50px;
    }
    &.cell-middle .cell .inner {
      width: 44px;
      height: 44px;
      line-height: 44px;
    }
    &.cell-small .cell .inner {
      width: 38px;
      height: 38px;
      line-height: 38px;
    }
    &.cell-mini .cell .inner {
      width: 33px;
      height: 33px;
      line-height: 33px;
    }
    &.cell-tiny .cell .inner {
      width: 30px;
      height: 30px;
      line-height: 30px;
      font-size: 13px;
    }
  }
}
</style>
