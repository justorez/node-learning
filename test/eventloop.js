// 简单模拟事件循环
const eventloop = {
  queue: [],

  loop() {
    while (this.queue.length) {
      const callback = this.queue.shift();
      callback();
    }

    setTimeout(this.loop.bind(this), 50);
  },

  add(callback) {
    this.queue.push(callback);
  }
}

eventloop.loop();

setTimeout(() => {
  eventloop.add(() => console.log(1));
}, 500);

setTimeout(() => {
  eventloop.add(() => console.log(2));
}, 800);
