const http = require('http');
const querystring = require('querystring');
const url = require('url');
const fs = require('fs');
const path = require('path');
const game = require('./game');

http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);

  if (parsedUrl.pathname === '/favicon.ico') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (parsedUrl.pathname === '/') {
    fs.createReadStream(path.join(__dirname, 'index.html'))
      .pipe(res);
    return;
  }

  if (parsedUrl.pathname === '/game') {
    const query = querystring.parse(parsedUrl.query);
    const playerAction = query.action;

    try {
      const gameResult = game(playerAction);
      res.writeHead(200);
      if (gameResult === 0) {
        res.end('平局');

      } else if (gameResult === -1) {
        res.end('你输了');

      } else {
        res.end('你赢了');
      }
    } catch (error) {
      res.writeHead(500);
      res.end('年轻人你不讲武德，我劝你耗子尾汁！');
    }
  }

}).listen(3000);
