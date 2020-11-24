function interview(callback) {
    setTimeout(() => {
        if (Math.random() < 0.6) {
            callback(null, 'success');
        } else {
            callback(new Error('fail'));
        }
    });
}

/**
 * nodejs 回调函数规范
 * 第一个参数约定为异常
 */
interview((err, res) => {
    if (err) {
        return console.log('cry');
    }
    console.log('smile');
});
