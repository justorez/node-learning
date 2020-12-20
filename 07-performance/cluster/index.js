const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
  for (let i = 0; i < os.cpus().length/2; i++) {
    const worker = cluster.fork();
    checkHeartbeat(worker);
  }

  // 监听子进程退出，重起一个子进程
  cluster.on('exit', () => {
    setTimeout(() => {
      const worker = cluster.fork();
      checkHeartbeat(worker);
    }, 3000)
  })
} else {
  require('./app');

  process.on('message', (msg) => {
    // 回应心跳
    if (msg === `ping#${process.pid}`) {
      console.log(`[pong] #${process.pid}`);
      process.send(`pong#${process.pid}`);
    }
  })

  process.on('uncaughtException', (err) => {
    console.error(err); // 捕捉无法处理的异常，打印或上报错误信息

    process.exit(1);
  })

  // 监听内存泄露
  const timer = setInterval(() => {
    const usage = Math.floor(process.memoryUsage().rss / 1024 / 1024);

    console.log(`[内存使用量] #${process.pid} ${usage}MB`);
    if (usage > 200) {
      console.log(`[内存泄露] #${process.pid} OOM!`);
      clearInterval(timer);
      process.exit(1);
    }
  }, 5000)
}

/**
 * 子进程心跳检测
 * @param {Worker} worker
 */
function checkHeartbeat(worker) {
  let missedPing = 0;
  const timer = setInterval(() => {
    if (worker.isDead()) {
      return clearInterval(timer);
    }

    console.log(`[ping] #${worker.process.pid}`);
    worker.send(`ping#${worker.process.pid}`);
    missedPing++;

    if (missedPing >= 3) {
      try {
        worker.exit(1);
      } catch (error) { // 子进程卡死无法退出，则强制结束
        process.kill(worker.process.pid);
      }
    }
  }, 3000);

  worker.on('message', (msg) => {
    if (msg === `pong#${worker.process.pid}`) {
      missedPing--;
    }
  });
}

