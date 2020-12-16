# 性能优化

## 一、压力测试工具

- [ab](http://httpd.apache.org/docs/2.0/programs/ab.html)
- [webbench](http://home.tiscali.cz/~cz210552/webbench.html)
- [autocannon](https://www.npmjs.com/package/autocannon)

ab 常用参数
- `-c` 并发数
- `-n` 请求次数
- `-t` 请求时间（单位：秒）

```bash
ab.exe -c200 -n1600 http://localhost:3000/download
```

上述命令对应的 ab 测试报告

```http
Server Software:
Server Hostname:        localhost
Server Port:            3000

Document Path:          /download
Document Length:        250962 bytes

Concurrency Level:      200
Time taken for tests:   6.780 seconds
Complete requests:      1600
Failed requests:        0
Total transferred:      401761600 bytes
HTML transferred:       401539200 bytes
Requests per second:    235.98 [#/sec] (mean)
Time per request:       847.530 [ms] (mean)
Time per request:       4.238 [ms] (mean, across all concurrent requests)
Transfer rate:          57865.97 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    1   2.9      0      16
Processing:   174  780 145.3    794    1011
Waiting:       37  708 138.0    736     870
Total:        174  780 145.4    794    1011

Percentage of the requests served within a certain time (ms)
  50%    794
  66%    823
  75%    855
  80%    870
  90%    902
  95%    937
  98%    980
  99%    980
 100%   1011 (longest request)
```

## 二、系统性能监控工具

- top
- iostat

## 三、Node.js 性能分析工具

1、自带的 profile

```bash
# 添加运行参数
node --prof xxx.js

# 分析日志文件
node --prof-process xxx.log > profile.txt
```

2、Chrome 开发者工具

```bash
# 开启 debug
node --inspect-brk xxx.js

# 打开 chrome 调试页
chrome://inspect
```

然后利用开发者工具相关功能分析即可。

3、Clinic

- <https://clinicjs.org/>
- <https://www.npmjs.com/package/clinic>

简单用例

```bash
clinic doctor -- node server.js
# or
clinic bubbleprof -- node server.js
# or
clinic flame -- node server.js
```

手动结束命令后自动生成网页报告。

## 四、计算性能优化的本质

- 减少不必要的计算
- 空间换时间

Node.js HTTP 服务性能优化准则：提前计算。

## 五、内存优化管理

V8 内存结构
- 新生代：容量小，垃圾回收更快
- 老生代：容量大，垃圾回收更慢

内存优化最好的手段：使用池，规避创建和销毁的性能消耗。

## 七、C++ 扩展

使用 C++ 编写 Node.js 扩展，实现一些计算耗时功能，进而提高性能。

- 收益：C++ 运算比 JavaScript 更快
- 成本：C++ 变量和 V8 变量的转换

需要考虑收益是否大于成本？

## 八、多进程优化

Node.js 事件循环
- 主线程运行 V8 和 javascript
- 多个子线程通过事件循环调度
