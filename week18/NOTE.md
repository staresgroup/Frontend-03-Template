学习笔记

# 工具链（二）

测试工具是工具链中非常重要的一环。

对于大部分的开源软件来说，测试都是必需品。

## Mocha

Mocha 是一个测试框架。

https://mochajs.org/#getting-started

安装：

npm install --global mocha

demo:

mkdir test-demo

cd test-demo

touch add.js

mkdir test

touch test.js

主要文件：

- add.js
- test/test.js

add.js

```javascript
function add(a, b) {
	return a + b;
}
module.export = add;
```

test/test.js

```javascript
var assert = require('assert');
var add = require('../add.js');

describe('add function testing', () => {
    it('1+2 should be 3', function() {
        assert.equal(add(1, 2), 3);
    });

    it('-5+2 should be -3', () => {
        assert.equal(add(-5, 2), -3);
    })
})
```

终端中使用 mocha 命令执行测试用例。

> Note: add.js 中使用了 module.export 语句，如果写成 export 则不行，因为在 Node.js 中没有支持 export 语法的，需要使用 babel。

### 非模块写法

npm install --save -dev @babel-core @babel/register

mocha --require @babel/register

最佳实践永远是调 local 的工具。

## code coverage

代码覆盖率。

使用到的工具：nyc

npm install --save-dev nyc

### 

