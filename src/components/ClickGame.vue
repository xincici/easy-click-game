<template>
  <div class="wrapper">
    <h2>Easy Click Game <span class="help" title="make them all 0 to win!" @click="alert('make them all 0 to win!')">?</span></h2>
    <p>Best Score: {{ bestScore || '--' }} 🍔 Available Clicks: {{ maxClick - clickCount }}</p>
    <p>
      <button @click="changeDifficulty(-1)" class="opt-icon" :class="{disable: difficulty === MIN_DIFFICULTY}">--</button>
      {{ difficulty }}
      <button @click="changeDifficulty(1)" class="opt-icon" :class="{disable: difficulty === MAX_DIFFICULTY}">+</button>
      <button @click="initGame" class="reset-icon">Reset</button>
    </p>
    <div class="game-area" :class="`cell-${level}`">
      <div v-for="(item, idx_row) in gameData" :key="idx_row">
        <div class="cell" v-for="(cell, idx_col) in item" :key="idx_col">
          <div class="mask" v-show="maskData[idx_row][idx_col] === 0"></div>
          <button class="inner" :class="{zero: cell === 0, one: cell === 1, two: cell === 2}" @click="onCellClick(idx_row, idx_col)">{{ cell }}</button>
        </div>
      </div>
      <div v-if="gameResult >= WIN" class="win">
        <span>🎉🎉 You Win 🎉🎉</span>
        <span v-if="gameResult === NB">New Best Score</span>
      </div>
      <div v-if="gameResult === LOSE" class="lose">👻👻 You Lose 👻👻</div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
const BIG_VAL = 3;
const INIT_DIFFICULTY = 6;
const MIN_DIFFICULTY = 3;
const MAX_DIFFICULTY = 10;
const [GAMING, LOSE, WIN, NB] = [0, 1, 2, 3];
const [MINI, SMALL, MIDDLE, LARGE] = ['mini', 'small', 'middle', 'large'];
const BEST_STORAGE_KEY = '__easy_click_game__';
const alert = msg => window.alert(msg);

const neighbours = [[-1, 0], [1, 0], [0, -1], [0, 1]];
const clickCount = ref(0);
const difficulty = ref(INIT_DIFFICULTY);
const gameResult = ref(GAMING);
const maxClick = computed(() => Math.pow(difficulty.value, 2));
const level = computed(() => difficulty.value <= 4 ? LARGE : difficulty.value <= 6 ? MIDDLE : difficulty.value <= 8 ? SMALL : MINI);
const bestScore = ref(localStorage.getItem(`${BEST_STORAGE_KEY}${difficulty.value}`));

watch(difficulty, () => {
  bestScore.value = localStorage.getItem(`${BEST_STORAGE_KEY}${difficulty.value}`);
});
watch(gameResult, val => {
  if (val === WIN) updateBestScore();
});

const randomOnce = max => [Math.floor(Math.random() * max), Math.floor(Math.random() * max)];
const randomData = length => Array.from({ length }, () => Array.from({ length }, () => 0));

let gameData, maskData;
let animationFrameId = null;
initGame();

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
  hoverMask(0);
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
function hoverMask(idx) {
  const row = ~~(idx / difficulty.value);
  const col = idx % difficulty.value;
  maskData[row][col] = 1;
  if (idx + 1 < difficulty.value * difficulty.value) {
    animationFrameId = requestAnimationFrame(() => {
      hoverMask(idx + 1);
    });
  }
}
function changeDifficulty(diff) {
  if (difficulty.value === MIN_DIFFICULTY && diff < 0 || difficulty.value === MAX_DIFFICULTY && diff > 0) return;
  difficulty.value += diff;
  initGame();
}
function updateBestScore() {
  const score = maxClick.value - clickCount.value;
  if (!bestScore.value || bestScore.value < score) {
    localStorage.setItem(`${BEST_STORAGE_KEY}${difficulty.value}`, score);
    bestScore.value = score;
    gameResult.value = NB;
  }
}
function onCellClick(row, col) {
  clickCount.value++;
  gameData[row][col] = (gameData[row][col] + 1) % BIG_VAL;
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.wrapper {
  button {
    touch-action: manipulation;
  }
  .help {
    cursor: pointer;
    font-size: 16px;
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 1px solid #aa1111;
    color: #aa1111;
    border-radius: 50%;
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
    background: #ee5555;
    color: #fff;
    letter-spacing: normal;
  }
  .game-area {
    display: inline-block;
    position: relative;
    padding: 8px;
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
@media only screen and (min-device-width: 320px) and (max-device-width: 480px) {
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
      width: 28px;
      height: 28px;
      line-height: 28px;
      font-size: 13px;
    }
  }
}
</style>
