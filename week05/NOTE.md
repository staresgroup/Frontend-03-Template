学习笔记

这周进入了重学 CSS 的课程，主要讲解了 CSS 语法的 @ 规则和普通规则，以及通过爬虫获取了一份 CSS 属性表，然后讲解了选择器语法和选择器的优先级，最后介绍了伪类和伪元素的选择器。

要搭建知识体系，要找一份权威、具有完备性的文档或者标准来参考。CSS 的标准比较复杂，目前没有一份全面的标准，不过可以参考 CSS 2.1 标准，该标准将所有的内容写在了一个页面上，方便阅读和查看。

### CSS 语法

CSS 总体结构

- @charset
- @import
- rules
  - @media
  - @page
  - rule

### 收集 CSS 标准



### CSS 选择器

- 简单选择器
  - 通用选择器 *
  - 标签选择器 div
  - 类选择器 .item
  - id 选择器 #root
  - 属性选择器 a[target]
  - 伪类选择器 :hover
  - 伪元素选择器 ::before
- 复合选择器
  - 
- 复杂选择器
  - 

HTML 中存在命名空间，html、svg、MathML 分别为三个命名空间。svg 中只有 a 标签重复，svg | a 访问；MathML 中没有重复的名称。



### 选择器的优先级



### 伪类

伪类很早就已经被 CSS 引入，最早是为了支持链接标签的使用。

- :any-link 匹配所有超链接
- :visited 匹配已经访问过的超链接
- :link 匹配未访问过的超链接
- :hover 鼠标在链接上的状态，目前已经支持其他标签了
- :active 鼠标点击链接后生效
- :focus 所有能够获得焦点的元素都可以使用
- :target 给作为锚点的 a 标签使用

使用了 :visited 或 :link 后，无法更改除文字颜色之外的属性。

树形结构的伪类

- :empty 元素是否有子元素
- :nth-child() 父元素的第几个 child
- :nth-last-child() 从后往前数
- :first-child
- :last-child
- :only-child

逻辑型伪类选择器

- :not
- :where
- :has

不建议使用过于复杂的选择器，否则意味着 HTML 结构设计的不合理，完全可以通过为标签加 class 解决样式问题。

### 伪元素

- ::before
- ::after
- ::first-line
- ::first-letter

>  first-letter 可以设置 float 之类的，而 first-line 不行。

两种伪元素机制：

- 无中生有
- 括起来