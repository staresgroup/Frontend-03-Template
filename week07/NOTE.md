学习笔记

### HTML 定义

XML 和 SGML 是 HTML 的超集。

HTML 的 NAMESPACE 包括 HTML、SVG、MathML.

### HTML 的标签语义：

- <hgroup> 表示具有关联关系的标题
- 标题要用 <h1> 这些标签
- 段落用 <p>
- 侧边栏用 <aside>
- 主体部分用 <main>
- 文章用 <article>
- 缩写用 <abbr>
- 定义用 <dfn>
- 代码用 <code>、<pre>、< 用 \&lt; 转义

### HTML 语法：

- start tag、end tag
- \<!DOCTYPE html>

- 等等

### DOM API

DOM API 是浏览器中最重要的 API，大概占据了 API 的 70%。

此外还有 BOM 等 API。

### Event API

理解事件，需要先理解事件对象模型。

addEventListen(type, listener, [, options])

type: click、keyon、keydown、mouseup、mousedown

[, options] : true / false 改变事件的模式（捕获模式、冒泡模式）

### Range API

Range API 可以操作 DOM 的任意部分，可以操作 DOM 的一半，但是不常用，在 Toy React 项目中使用了这一 API。

基本用法：

let range = document.createRange();

range.setStart(start, offset)

range.setEnd(start, offset)

### CSSOM

CSSOM 是和 CSS 对应的语言模型。可以通过 CSSOM 改变 CSS 的属性和值。

### CSSOM View

在获取到 Layout 信息后，CSS 也会带一些自身的属性，要对这些属性进行操作，需要依靠 CSSOM View。

主要和浏览器画上的视图相关。

window.innerHeight

window.innerWidth

window.outerHeight

window.outerWidth

window.devicePixelRatio

window.screen.width

window.screen.heigth

window.screen.availHeight

window.screen.availWidth

window.open(about:blank, _blank, "width, height")

moveTo()

### 其他 API

Web API 接口参考：https://developer.mozilla.org/zh-CN/docs/Web/API

也可以通过代码整理浏览器的 API。

```javascript
// khronos -- WebGL
// ECMA
// WHATWG -- HTML
// W3C

let names = Object.getOwnPropertyNames(window);

function filterOut(names, props) {
    props = props.reduce(
    	(previous, current) => {
            previous.add(current.toLowerCase());
            return previous;
        }, new Set()
    );
    return names.filter(e => !props.has(e.toLowerCase()))
}

// 事件
names = names.filter(e => !e.startsWith('on'));

// webkit
names = names.filter(e => !e.startsWith('webkit'));

console.log(names);
```

