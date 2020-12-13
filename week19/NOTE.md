学习笔记

# 发布系统

发布系统分为三个子系统：

- 线上服务系统：用户使用
- 发布系统：程序员发布系统供线上使用，分为同级部署、集群部署
- 发布工具：命令行工具对接发布系统

## 初始化 Server

使用 VirtualBox 安装 Ubuntu Server.

镜像使用 http://mirrors.aliyun.com

默认自带 Node.js

使用 node --version 查看版本

sudo apt install n

sudo n install latest



使用自己的云主机进行实验。(Ubuntu 18.04)

### node 版本

系统自带 Node.js，也可以手动安装：sudo apt install nodejs

node --version

v8.10.0 

版本比较低，需要进行升级。但是我这里需要先更换镜像源。

### 配置镜像源

#### 配置 DNS

先配置云服务器的内网 DNS。

vim /etc/resolv.conf

在 nameserver 前加上 DNS 服务器的 IP 地址。

使用 cat /etc/resolv.conf 查看是否配置成功。

nslookup www.baidu.com 查看文件系统域名是否可以解析到 IP 地址。

对于使用 DHCP 的服务器来说，需要锁定 /etc/resolv.conf。

#### 配置镜像源

mv /etc/apt/sources.list /etc/apt/sources.list.bak

**wget -O /etc/apt/sources.list http://mirrors.myhuaweicloud.com/repo/sources.list.bionic**

apt update 更新软件列表

### 安装 Node.js 版本管理软件

npm install -g n

n 是 Node.js 写的 Node.js 版本管理工具。

n latest

也可以去 Node.js 的官网下载，手工安装。

#### Linux 下安装 Node.js

使用 Windows 的电脑下载 node 的 tar.gz 包，通过 scp 命令上传到云服务器。

tar -xvf node 解压文件

然后为 nodejs/bin/npm 和 nodejs/bin/node 建立软链接到 /usr/local/bin



## 利用 Express 编写服务器

只讲述发布静态文件。

最广泛的服务器框架是 Express.

mkdir server

cd server

npx express-generator

npm install

（routes 和 views 中的代码都用不到，可以删掉，我们只用 public 中的代码）

npm start

localhost:3000

删除 app.js 中的 route 相关的代码。

在 public 目录下创建 index.html 文件，随便添加几行代码，浏览器可以访问到，说明可以把 routes 和 views 中的内容删除。

服务器一般默认安装了 openssh，如果没有可以通过 apt install openssh 安装。

如果 ssh 服务没有启动，可以使用 service ssh start 启动。

使用 scp 命令将文件拷贝到服务器的 server 目录下，使用 npm start 启动。

## 实现一个发布系统

发布系统就是将本地开发的软件传递到服务器上，对外提供服务。

发布系统包括两个部分：发布服务器、发布工具。

mkdir publish-server

mkdir publish-tool

通过 publish-tool 将文件发送到 publish-server

在 publish-server 中创建 server.js，创建一个服务器。

```js
let http = require('http');

http.createServer(function(req, res) {
	console.log(req);
	res.end('Hello world.');
}).listen(8082);
```

在 publish-tool 中创建 publish.js。

```javascript
let http = require('http');

let request = http.request({
	hostname: '127.0.0.1',
	port: 8082
}, response => {
	console.log(response)
});

request.end();
```

请求和响应都是流式处理，我们会利用流的方式来实现我们的发布服务。

### Node.js 中的流

流分为两部分：可读流、可写流

ReadableStream、WriteableStream

两个 Event: close、data

write()

end()

publish.js

```javascript
let http = require('http');
let fs = require('fs');

let request = http.request({
    hostname: '127.0.0.1',
    port: 8082,
    method: 'POST',
    headers: {
        'Content-Type': 'octet-stream'
    }
}, response => {
    console.log(response);
})

let file = fs.createReadStream("./package.json");
file.on('data', chunk => {
    console.log(chunk.toString());
    request.write(chunk);
})
file.on('end', chunk => {
    console.log('read finished')
    request.end(chunk);
})
```

server.js

```javascript
let http = require('http');

http.createServer(function(req, res) {
    console.log(req.headers);
    req.on('data', chunk => {
        console.log(chunk);
    })
    req.on('end', chunk => {
        res.end('Success');
    })
}).listen(8082);
```

### 改造 server

publish-server/server.js

```javascript
let http = require('http');
let fs = require('fs');

http.createServer(function(request, response) {
    console.log(request.headers);

    let outFile = fs.createWriteStream('../server/public/index.html')

    request.on('data', chunk => {
        outFile.write(chunk);
    })
    request.on('end', () => {
        outFile.end();
        response.end('Success');
    })
}).listen(8082);
```

publish-tool/publish.js

```javascript
let http = require('http');
let fs = require('fs');

let request = http.request({
    hostname: '127.0.0.1',
    port: 8082,
    method: 'POST',
    headers: {
        'Content-Type': 'octet-stream'
    }
}, response => {
    console.log(response);
})

let file = fs.createReadStream("./sample.html");
file.on('data', chunk => {
    console.log(chunk.toString());
    request.write(chunk);
})
file.on('end', chunk => {
    console.log('read finished')
    request.end(chunk);
})
```



为 publish-server 和 server 中添加 scripts.

### 实现多文件发布

多文件发布需要用到压缩包，npm 中可以使用 archiver

npm install archiver --save

npm install unzipper --save

不使用 --save-dev 是因为这些包都是在生产环境中要使用的。

pipe 方法可以将一个可读的流导入一个可写的流中。

publish-server/server.js

```javascript
let http = require('http');
let fs = require('fs');
let unzipper = require('unzipper');

http.createServer(function(request, response) {
    console.log('request')
    // let outFile = fs.createWriteStream('../server/public/tmp.zip')
    // request.pipe(outFile);
    request.pipe(unzipper.Extract({path: '../server/public/'}))
}).listen(8082);
```

publish-tool/publish.js

```javascript
let http = require('http');
let fs = require('fs');
let archiver = require('archiver');


let request = http.request({
    hostname: '127.0.0.1',
    port: 8082,
    method: 'POST',
    headers: {
        'Content-Type': 'application/octet-stream',
    }
}, response => {
    console.log(response);
})

// let file = fs.createReadStream("./sample.html");

const archive = archiver('zip', {
    zlib: { leverl: 9 }
});

archive.directory('sample/', false);

archive.pipe(fs.createWriteStream('tmp.zip'));

archive.finalize();

archive.pipe(request);
```

### 用 GitHub oAuth 做登录实例

并不能让所有的人都可以上传文件到服务器，还涉及到鉴权的问题。

