function interview(round, cost=500) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.6) {
        resolve('success');
      } else {
        reject(round);
      }
    }, cost);
  })
}

function deadline(time) {
  return new Promise((resolve, reject) => {
    setTimeout(reject, time)
  })
}

// 模拟三轮面试
// interview(1)
//   .then(() => {
//     return interview(2)
//   })
//   .then(() => {
//     return interview(3)
//   })
//   .then(() => {
//     console.log('smile')
//   })
//   .catch(round => {
//     console.log(`cry at round ${round}`)
//   })

// 全部成功，整体才成功；有一个失败，则整体失败
// 模拟同时面试多家公司
// Promise.all([
//   interview('Tencent'),
//   interview('Alibaba')
// ])
// .then(res => console.log(`${res} smile`)) // 两家都成功才开心
// .catch(err => {
//   console.log(`cry for ${err}`)
// })

// 任意一个状态改变则整体随之改变
Promise.race([
  interview('Tencent'),
  deadline(200) // 只等200ms
])
.then(res => console.log(`${res} smile`)) // 只要有一家成功就开心了
.catch(err => {
  if (!err) {
    console.log(`Don't wait`);
  } else {
    console.log(`cry for ${err}`);
  }
})
