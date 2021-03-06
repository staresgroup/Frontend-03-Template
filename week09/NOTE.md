学习笔记

### 寻路 | 实现一个地图编辑器

需求：

- 实现一个地图编辑器，鼠标点击进行绘制，有保存按钮，使得刷新页面后绘制的地图不消失。鼠标右键可以清除绘制的地图上的某一点。

### 寻路 | 广度优先搜索

1. 队列边进边出。
2. 先指定一个初始值进入，后续进的是周围的四个，一直这样下去；出的是队列的头。
3. 进的时候，不是全让进的，如果遇到边或者已经走过的，就不让再入队了。
4. 结束是用循环中的值与目标值做对比，一样就结束。

### 寻路 | 通过异步编程可视化路径算法

1. 在 insert 中，让走过的变绿，并且，加入 30 ms 延迟，这样方便观察。
2. 相关异步的地方使用 async 和 await 即可。

### 寻路 | 处理路径问题

1. 用一个对象来存储节点和此节点的上一个节点。
2. 达到终点后，做一个循环，一直找上一个节点，直到起点。

### 寻路 | 启发式搜索（一）

将 queue 的数据结构加强一下，使之能以一定优先级出。
因为进是出的周围，所以如果出的是最优的，那么进的也就是最优的。一直循环，直到结束。
这样的数据结构仍然是数组，只是出这下找一个距离终点最近的。

### 寻路 | 启发式搜索（二）

将 Sorted 替换成更好的数据结构。（推荐使用二叉堆）