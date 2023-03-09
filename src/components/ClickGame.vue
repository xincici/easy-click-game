<template>
  <div class="wrapper">
    <h2>Easy Click Game <span class="help" title="make them all 0 to win!" @click="alert('make them all 0 to win!')">❓</span></h2>
    <p>Available Clicks: {{ maxClick - clickCount }}</p>
    <p>
      <button @click="e => changeDifficulty(-1)" class="opt-icon" :class="{disable: difficulty === MIN_DIFFICULTY}">--</button>
      {{ difficulty }}
      <button @click="e => changeDifficulty(1)" class="opt-icon" :class="{disable: difficulty === MAX_DIFFICULTY}">+</button>
      <button @click="initGame" class="reset-icon">Reset</button>
    </p>
    <div class="game-area" :class="`cell-${level}`">
      <div v-for="(item, idx_row) in gameData" :key="idx_row">
        <div class="cell" v-for="(cell, idx_col) in item" :key="idx_col">
          <button class="inner" :class="{zero: cell === 0}" @click="onCellClick(idx_row, idx_col)">{{ cell }}</button>
        </div>
      </div>
      <div v-if="gameResult === WIN" class="win">🎉🎉🎉 You Win 🎉🎉🎉</div>
      <div v-if="gameResult === LOSE" class="lose">👻👻👻 You Lose 👻👻👻</div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
const BIG_VAL = 3;
const INIT_DIFFICULTY = 6;
const MIN_DIFFICULTY = 4;
const MAX_DIFFICULTY = 10;
const [GAMING, WIN, LOSE] = [0, 1, 2];
const [SMALL, MIDDLE, LARGE] = ['small', 'middle', 'large'];
const alert = msg => window.alert(msg);

const neighbours = [[-1, 0], [1, 0], [0, -1], [0, 1]];
const clickCount = ref(0);
const difficulty = ref(INIT_DIFFICULTY);
const gameResult = ref(GAMING);
const maxClick = computed(() => Math.pow(difficulty.value, 2));
const level = computed(() => difficulty.value <= 5 ? LARGE : difficulty.value <= 7 ? MIDDLE : SMALL);

const randomOnce = max => [Math.floor(Math.random() * max), Math.floor(Math.random() * max)];
const randomData = length => Array.from({ length }, () => Array.from({ length }, () => 0));

let gameData;
initGame();

function randomSomeOperations() {
  for (let i = 0; i < difficulty.value - 1 << 1; i++) {
    const [row, col] = randomOnce(difficulty.value);
    onCellClick(row, col);
    if (Math.random() < 0.5) {
      onCellClick(row, col);
    }
  }
}
function changeDifficulty(diff) {
  if (difficulty.value === MIN_DIFFICULTY && diff < 0 || difficulty.value === MAX_DIFFICULTY && diff > 0) return;
  difficulty.value += diff;
  initGame();
}
function initGame() {
  gameData = reactive(randomData(difficulty.value));
  randomSomeOperations();
  gameResult.value = GAMING;
  clickCount.value = 0;
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
  .help {
    cursor: pointer;
    font-size: 16px;
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 1px solid #aa1111;
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
    letter-spacing: -1.2px;
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
      align-items: center;
      justify-content: center;
    }
    .lose {
      color: #aa1111;
    }
    .cell {
      display: inline-block;
      margin: 2px;
      .inner {
        cursor: pointer;
        display: block;
        width: 50px;
        height: 50px;
        line-height: 50px;
        border: 1px solid #e1e1e1;
        font-size: 16px;
        font-weight: bold;
        background-color: #eeeeee;
        &.zero {
          background-color: #ddffdd;
        }
      }
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
  }
}
</style>
