const glob = require('glob');
const path = require('path');

const root = path.resolve(__dirname, '../');

console.time('sync');
const res = glob.sync(root + '/**/*'); // 阻塞
console.log(`[sync] ${res.length}`);
console.timeEnd('sync');

console.log();

console.time('async');
glob(root + '/**/*', (err, res) => {
  if (err) {
    return console.log(err);
  }
  console.log(`[async] ${res.length}`);
});
console.timeEnd('async');
