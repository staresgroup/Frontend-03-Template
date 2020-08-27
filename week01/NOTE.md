学习笔记

优秀的前端工程师是什么样的?

- 领域知识，可能是相互关联的
- 能力、潜力，比如可以完成同样的效果，但是另外一个工程师可以更高效地完成
- 职业规划：工程师 -> 资深工程师 -> 专家 -> 经理



个人的目标要和企业的目标一致，才能获得更快的发展，要做出对企业多的贡献。



职业发展观：做更高层级的事情，承担更多的责任。



<em> You </em> are the owner of your career.



职业发展：

成长、晋升、成就互相交替

成就：业务型成就、工程型成就、技术难题



前端技能模型：

- 编程能力、架构能力、工程能力
- 前端知识
- 领域知识（导购页面和阿里云的控制台的业务完全不同，导购页需要吸引用户直接购买，直接跳转到购买页面；控制台涉及各种表单的流转和请求）



前端技术不是武林秘籍，真正的能力是练出来的。



前端学习方法：

- 整理法

  - 顺序关系：编译 -> -> 词法分析 -> 语法分析 -> 代码优化 -> 代码生成
  - 组合关系：CSS 规则 （选择器、属性、值）
  - 维度关系：JavaScript （文法、语义、运行时），文法（词法、语法）、运行时（类型、执行过程）
  - 分类关系：CSS 简单选择器（id 选择器、class 选择器、通用选择器、属性选择器、元素选择器、伪类选择器、伪元素选择器）

  要注重知识的完备性。

- 追溯法
  - 源头：最早出现的论文或杂志、最初的实现案例
  - 标准和文档：w3.org、developer.mozilla.org、msdn.microsoft.com、developer.apple.com
  - 大师



HTML 中有多少种标签？

HTMLElement?

HTMLElement.prototype?

```javascript
for (let p of Object.getOwnPropertyNames(window)) {
    try {
        if ((typeof window[p] === "function") && (window[p].prototype instanceof HTMLElement)) {
            console.log(p);
        }
    } catch (e) {
        
    }
}
```



遍历 window 对象的属性

```javascript
for (let p in window) {
	console.log(p);
}
```

Object.getOwnPropertyNames(window) 以数组的形式返回 window 对象的所有属性



whatwg.org



闭包，和 Lambda 表达式相关



0.1 + 0.2 != 0.3，涉及到双精度浮点数在内存中的表示的问题，0.1 是不是 0.1，0.2 是不是 0.2，0.1 + 0.2 是不是 0.1 + 0.2



面试

- 打断意味着对说的话不感兴趣

- 争论 & 压力面试，尽量客观陈述，不要情绪不好，可能对方根本没当回事

- 难题：展现分析过程，缩小问题规模

题目类型

项目型问题、知识型问题、开放性问题、案例性问题、有趣的问题



知识体系

HTML、JavaScript、CSS、API



