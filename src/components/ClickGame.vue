<template>
  <div class="wrapper" :class="theme">
    <TopHeader />
    <p>{{ i18n('bestScore') }}: {{ bestScore || '--' }} 🍔 {{ i18n('availableClicks') }}: {{ maxClick - clickCount }}</p>
    <div class="opt-area">
      <button @click="changeDifficulty(-1)" class="opt-icon" :class="{disable: difficulty === MIN_DIFFICULTY}">
        <i i-carbon-subtract-alt />
      </button>
      {{ difficulty }}
      <button @click="changeDifficulty(1)" class="opt-icon" :class="{disable: difficulty === MAX_DIFFICULTY}">
        <i i-carbon-add-alt />
      </button>
      <button @click="initGame" class="game-icon">{{ i18n('start') }}</button>
      <button @click="autoplayGame" :disabled="clickCount !== 0" class="game-icon">{{ i18n('godMode') }}</button>
    </div>
    <div class="game-area" :class="`cell-${cellSize}`">
      <div v-for="(item, idx_row) in gameData" :key="idx_row">
        <div class="cell" v-for="(cell, idx_col) in item" :key="idx_col">
          <div class="mask" v-show="maskData[idx_row][idx_col] === 0"></div>
          <button class="inner" :class="{zero: cell === 0, one: cell === 1, two: cell === 2, clicked: autoClick[0] === idx_row && autoClick[1] === idx_col}" @click="onCellClick(idx_row, idx_col)">{{ cell }}</button>
        </div>
      </div>
      <div v-if="gameResult >= WIN" class="win">
        <span>🎉🎉 {{ i18n('tipWin') }} 🎉🎉</span>
        <span v-if="gameResult === NB">{{ i18n('newBest') }}</span>
      </div>
      <div v-if="gameResult === LOSE" class="lose">👻👻 {{ i18n('tipLost') }} 👻👻</div>
      <div v-if="autoplaying" class="automask"></div>
    </div>
    <div class="opt-area">
      <button class="undo" @click="userUndo" :disabled="undoIndex < 0 || gameResult !== GAMING || autoplaying">
        <i i-carbon-previous-outline />
      </button>
      <button class="undo" @click="userRedo" :disabled="undoIndex === userOpts.length - 1 || gameResult !== GAMING || autoplaying">
        <i i-carbon-next-outline />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, watchEffect } from 'vue';
import TopHeader from './TopHeader.vue';
import { theme } from '../utils/theme';
import { difficulty, changeDifficulty, MIN_DIFFICULTY, MAX_DIFFICULTY } from '../utils/difficulty';

const BIG_VAL = 3;
const VIRTUAL_CLICK_EFFECT_DURATION = 220;
const VIRTUAL_CLICK_WAIT_DURATION = 300;
const [GAMING, LOSE, WIN, NB] = [0, 1, 2, 3];
const [TINY, MINI, SMALL, MIDDLE, LARGE] = ['tiny', 'mini', 'small', 'middle', 'large'];

const neighbours = [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]];
const clickCount = ref(0);
const gameResult = ref(GAMING);
const autoplaying = ref(false);
const autoClick = reactive([-1, -1]);
const userOpts = reactive([]);
const undoIndex = ref(-1);
const storageKey = computed(() => `__easy_click_game__${difficulty.value}`);
const maxClick = computed(() => Math.pow(difficulty.value, 2));
const cellSize = computed(() => difficulty.value <= 4 ? LARGE : difficulty.value <= 6 ? MIDDLE : difficulty.value <= 8 ? SMALL : difficulty.value <= 9 ? MINI : TINY);
const bestScore = ref(localStorage.getItem(storageKey.value));

let gameData, maskData;
let animationFrameId = null;
const historyOpts = {
  list: new Map(),
  add: function (opt) {
    if (!this.list.has(opt)) this.list.set(opt, 1);
    else if (this.list.get(opt) === 1) this.list.set(opt, 2);
    else this.list.delete(opt);
  }
};

const randomOnce = max => [Math.floor(Math.random() * max), Math.floor(Math.random() * max)];
const randomData = length => Array.from({ length }, () => Array.from({ length }, () => 0));
const sleep = ms => new Promise(res => setTimeout(res, ms));

watchEffect(() => {
  bestScore.value = localStorage.getItem(storageKey.value);
});
watch(difficulty, initGame, { immediate: true });
watch(gameResult, val => {
  if (val === WIN) updateBestScore();
});

function initGame() {
  gameData = reactive(randomData(difficulty.value));
  maskData = reactive(randomData(difficulty.value));
  randomSomeOperations();
  gameResult.value = GAMING;
  autoplaying.value = false;
  clickCount.value = 0;
  userOpts.length = 0;
  undoIndex.value = -1;
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  toggleMask(0);
}
async function autoplayGame() {
  autoplaying.value = true;
  const opts = [];
  Array.from(historyOpts.list.keys()).forEach(item => {
    const one = item.split(',').map(v => +v);
    opts.push(one);
    if (historyOpts.list.get(item) === 1) opts.push(one);
  });
  opts.sort((a, b) => a[0] + a[1] - b[0] - b[1]);
  for (let i = 0; i < opts.length; i++) {
    if (!autoplaying.value) return;
    onCellClick(...opts[i]);
    await virtualClick(...opts[i]);
    await sleep(VIRTUAL_CLICK_WAIT_DURATION);
  }
  autoplaying.value = false;
}
async function virtualClick(row, col) {
  autoClick[0] = row;
  autoClick[1] = col;
  await sleep(VIRTUAL_CLICK_EFFECT_DURATION);
  autoClick[0] = autoClick[1] = -1;
}
function randomSomeOperations() {
  historyOpts.list = new Map();
  for (let i = 0; i < difficulty.value - 1 << 1; i++) {
    const [row, col] = randomOnce(difficulty.value);
    onCellClick(row, col, true);
    historyOpts.add(`${row},${col}`);
    if (Math.random() < 0.5) {
      onCellClick(row, col, true);
      historyOpts.add(`${row},${col}`);
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
function operateCell(row, col, diff) {
  neighbours.forEach(([iRow, iCol]) => {
    iRow += row;
    iCol += col;
    if (iRow < 0 || iRow >= difficulty.value) return;
    if (iCol < 0 || iCol >= difficulty.value) return;
    gameData[iRow][iCol] = (gameData[iRow][iCol] + diff + BIG_VAL) % BIG_VAL;
  });
}
function onCellClick(row, col, isRandom) {
  clickCount.value++;
  if (!isRandom) {
    userOpts.length = undoIndex.value + 1;
    userOpts.push([row, col]);
    undoIndex.value++;
  }
  operateCell(row, col, 1);
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
function userUndo() {
  clickCount.value--;
  const [row, col] = userOpts[undoIndex.value];
  undoIndex.value--;
  operateCell(row, col, -1);
}
function userRedo() {
  clickCount.value++;
  const [row, col] = userOpts[undoIndex.value + 1];
  undoIndex.value++;
  operateCell(row, col, 1);
}
</script>

<style scoped lang="scss">
.wrapper {
  width: 100vw;
  min-width: 360px;
  min-height: 100vh;
  box-sizing: border-box;
  color: #2c3e50;
  &.dark {
    background: #444;
    color: #eee;
    .header-wrapper {
      border-bottom: 1px solid #333;
    }
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
  .header-wrapper {
    border-bottom: 1px solid #eee;
  }
  button,button:disabled {
    touch-action: manipulation;
  }
  .opt-icon,.game-icon {
    cursor: pointer;
    display: inline-block;
    border: 1px solid #e1e1e1;
    padding: 2px;
    width: 25px;
    height: 30px;
    margin: 0 4px;
    color: #222;
    text-align: center;
    font-style: normal;
    font-weight: bold;
    font-size: 15px;
    &.disable {
      color: #e1e1e1;
      cursor: not-allowed;
    }
  }
  .game-icon {
    margin-left: 10px;
    width: auto;
    padding: 5px 8px;
    font-size: 14px;
    background: rgba(60, 160, 60, 0.9);
    color: #fff;
    border: 0 none;
    &:disabled {
      background-color: #aaa;
      cursor: not-allowed;
    }
  }
  .opt-area {
    margin: 10px 0;
  }
  .game-area {
    display: inline-block;
    position: relative;
    padding: 10px;
    .win,.lose,.automask {
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
    .automask {
      background: rgba(255, 255, 255, 0);
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
        opacity: 1;
        &.zero {
          background-color: #ddffdd;
        }
        &.two {
          background-color: #e5e5e5;
        }
        &.clicked {
          opacity: 0.1;
        }
      }
    }
  }
  .undo {
    padding: 3px 18px;
    margin: 0 10px;
    font-size: 16px;
    color: rgba(20, 160, 20, 0.95);
    border: 1px solid #e1e1e1;
    border-radius: 15px;
    cursor: pointer;
    &:disabled {
      color: #aaa;
      cursor: not-allowed;
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
