const fs = require('fs');
const path = require('path');
const express = require('express');
const game = require('./game');

const app = express();

app.get('/', (req, res) => {
  res.status(200);
  res.send(fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8'));
});

app.get('/favicon.ico', (req, res) => {
  res.status(200).send();
});

app.get('/game', (req, res) => {
  const playerAction = req.query.action;

  try {
    const gameResult = game(playerAction);
    res.status(200);
    if (gameResult === 0) {
      res.send(`<span class="normal">平局</span>`);

    } else if (gameResult === -1) {
      res.send(`<span class="fail">你输了</span>`);

    } else {
      res.send(`<span class="success">你赢了</span>`);
    }
  } catch (error) {
    res.status(500).send('年轻人你不讲武德，我劝你耗子尾汁！');
  }
});

app.listen(3000, () => {
  console.log('http://localhost:3000');
});
