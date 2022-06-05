一直觉得 UmiJS 默认支持的 [Mock 数据](https://umijs.org/zh-CN/docs/mock) 这个功能挺好用的，那如果项目不是用 UmiJS 创建的呢？所以就想写一个工具来启动 mock 服务。

## 我的需求

1. 默认根据 mock 文件夹中文件内容来返回接口数据
2. 默认接口响应时间为 100 到 300 ms
3. 默认所有接口都会成功，这样 mock 文件夹中就只用写希望模拟的请求的数据，比如删除啊编辑啊就不用写了，因为这种一般只关心是否成功

## 大概思路

1. 使用 [Express](http://expressjs.com/) 来启动一个后端服务，当有请求过来时，就根据 mock 文件夹内容去返回响应数据
2. 使用 [chokidar](https://github.com/paulmillr/chokidar) 来监听 mock 文件夹变动
3. 由于需要考虑接口路径中带参数的场景，可以用 [path-to-regexp](https://github.com/pillarjs/path-to-regexp) 来看路径是否匹配

## How to use

After `npm i @findtools/mock-server` , add a script `"mock": "mock-server"` to your `package.json` , and then `npm run mock` to start the mock server. If you want to see all options, run `npm run mock -- --help` .

The server default watches `mock` folder. Following is a mock file example. you can use [Mock.js](http://mockjs.com/examples.html) to generate random data.

```js
// mock/user.js
const { mock } = require('mockjs')

module.exports = {
  'GET /api/current-user': (req, res) => {
    res.send(
      mock({
        username: '@string(6,12)',
      })
    )
  },
}
```

## How to add custom response header

You can add a key `mock-server` in your `package.json` , following is an example. Besides, other options can be configured in `package.json` too.

```json
"mock-server": {
  "responseHeader": {
    "Access-Control-Allow-Headers": "content-type,authorization,others-xxx-in-request-header",
    "Access-Control-Expose-Headers": "xxx-in-response-header-need-to-tell-frontend"
  }
}
```

## How to ignore specific files

For example, `mock-server -i **/mock/**/*.generated.js` will ignore all `*.generated.js` .

If you want to ignore more files, configure them in package.json.

```json
"mock-server": {
  "ignored": [
    "**/mock/**/*.generated.js",
    "**/mock/swagger.json"
  ]
},
```
