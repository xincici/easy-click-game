/*
 * @Author      : linye
 * @Created At  : 2023-04-11 12:50:24
 * @Description : 
 */

const fs = require('fs');

const sw = fs.readFileSync('./sw.js', { encoding: 'utf-8' });

const swArr = sw.split('\n');

swArr[0] = `const cacheName = 'easy-click-game-${Date.now()}';`;

fs.writeFileSync('./sw.js', swArr.join('\n'), 'utf-8');
