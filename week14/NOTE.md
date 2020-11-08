学习笔记

# 组件化-动画系统

动画系统的核心是每一帧(16ms)执行一个动作，在JavaScript中实现帧的概念有三种方式:

- setTimeout()
- setInterval()
- requestAnimationFrame()

`requestAnimationFrame`是目前最好的方式，因为它是由系统决定动画回调函数执行的时机，而`setTimeout、setInterval`是被放入到异步队列中，它执行时机会受到主线程的影响，主线程执行完成后才会取执行异步队列，如果主线程执行执行时间超过一帧则会出现掉帧卡顿效果。

## 动画系统-时间线

时间线属于动画系统一部分，时间线的概念是为了控制动画执行的过程和状态，定义`TimeLine`时间线类，提供以下方法：

- start() // 开始动画
- pause() // 暂停
- resume() //继续
- reset() //重置

## 动画系统-动画类实现

- `Animation`类 提供一个构造函数传入必要参数: 对象,属性,开始值,结束值,动画时间,动画函数
- `TimeLine`做一些调整，增加一个添加动画方法`add`,TICK中调用添加的动画数组

## 动画系统-暂停和继续

- 暂停使用`cancelAnimationFrame`可以取消一个`requestAnimationFrame`
- 继续需要记录暂停动画的时间并且计算出暂停了多少时间，再次启动动画时候减去改时间差

## 动画系统-增加三次贝塞尔动画函数

目前动画只有匀速效果，接下来就是增加一些常用的动画函数`ease ease-in ease-out ease-in-out`:

- 动画函数需要实现 三次贝塞尔函数 直接copy
- animation 完善 reset 功能

- 三次贝塞尔函数 COPY

**动画重置**

- 暂停动画并且将相关值(PAUSE_TIME, ANIMATION, START_TIME, TICK_HANDLER)设置成默认值,将`tick`设置为`null`

**receive中使用动画函数**

- 使用传入的`timingFunction`计算出`progress`

## 动画系统-增加动画状态

我们发现在一开始调用`resume`或者`reset`动画会发生异常现象，我们需要做一层处理，只有动画开始的时候才能调用暂停，暂停状态才能调用继续：

- 增加三个状态

- 在动画开始、暂停、继续、重置中做状态处理:

## 总结

动画实现主要是基于`requestAnimationFrame`实现，最难理解部分是时间线(TimeLine)概念和`Animation.receive`中时间差计算，暂停和恢复动画思路,`Symbol`中使用场景值得学习。