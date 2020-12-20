const cp = require('child_process');

const child = cp.fork(`${__dirname}/child.js`);

child.send('Haha');

child.on('message', (msg) => {
  console.log('[parent]', msg);
})
