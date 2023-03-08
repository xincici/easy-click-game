<template>
  <h2>Click Game <span title="make them all 0 to win!" @click="alert('make them all 0 to win!')">❓</span></h2>
  <div class="wrapper">
    <p>total click: {{ clickCount }}</p>
    <p>
      <em @click="e => changeDifficulty(-1)" class="opt-icon" :class="{disable: difficulty === MIN_ROW}">-</em>
      {{ difficulty }}
      <em @click="e => changeDifficulty(1)" class="opt-icon" :class="{disable: difficulty === MAX_ROW}">+</em>
      <em @click="initGame" class="reset-icon">Reset</em>
    </p>
    <div class="game-area">
      <div class="row" v-for="(item, idx_row) in gameData" :key="idx_row">
        <div class="cell" v-for="(cell, idx_col) in item" :key="idx_col">
          <span class="inner" :class="{zero: cell === 0}" @click="onCellClick(idx_row, idx_col)">{{ cell }}</span>
        </div>
      </div>
      <div v-if="gameResult" class="win">🎉🎉 You Win 🎉🎉</div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
const BIG_VAL = 3;
const INIT_DIFFICULTY = 5;
const MIN_ROW = 4;
const MAX_ROW = 10;
const alert = msg => window.alert(msg);

const neighbours = [[-1, 0], [1, 0], [0, -1], [0, 1]];
const clickCount = ref(0);
const difficulty = ref(INIT_DIFFICULTY);
const gameResult = ref(false);

const randomOnce = () => [Math.floor(Math.random() * difficulty.value), Math.floor(Math.random() * difficulty.value)];
const randomData = length => Array.from({ length }, () => Array.from({ length }, () => 0));

let gameData;
initGame();

function randomSomeOperations() {
  for (let i = 0; i < difficulty.value - 2 << 1; i++) {
    const [row, col] = randomOnce();
    onCellClick(row, col);
    if (Math.random() < 0.5) {
      onCellClick(row, col);
    }
  }
}
function changeDifficulty(diff) {
  if (difficulty.value === MIN_ROW && diff < 0 || difficulty.value === MAX_ROW && diff > 0) return;
  difficulty.value += diff;
  initGame();
}
function initGame() {
  gameData = reactive(randomData(difficulty.value));
  randomSomeOperations();
  gameResult.value = false;
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
}
function checkResult() {
  for (let i = 0; i < difficulty.value; i++) {
    for (let j = 0; j < difficulty.value; j++) {
      if (gameData[i][j] !== 0) return;
    }
  }
  gameResult.value = true;
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.wrapper {
  .game-area {
    display: inline-block;
    position: relative;
    padding: 8px;
    .win {
      background-color: #e1e1e1;
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      opacity: 0.85;
      font-weight: bold;
      color: #11aa11;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .opt-icon,.reset-icon {
    cursor: pointer;
    display: inline-block;
    border: 1px solid #e1e1e1;
    padding: 2px;
    width: 20px;
    margin: 0 4px;
    text-align: center;
    font-style: normal;
    font-weight: bold;
    &.disable {
      color: #e1e1e1;
    }
  }
  .reset-icon {
    margin-left: 10px;
    width: 50px;
    font-weight: normal;
  }
  .row {
    .cell {
      display: inline-block;
      border: 1px solid #e1e1e1;
      cursor: pointer;
      width: 40px;
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      font-weight: bold;
      margin: 2px;
      .inner {
        display: block;
        background-color: #eeeeee;
        &.zero {
          background-color: #ddffdd;
        }
      }
    }
  }
}
</style>