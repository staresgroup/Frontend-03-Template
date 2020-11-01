学习笔记

### 组件化基础

对象和组件区别：

1. 对象 (Object) - 普通对象

- Properties: 属性
- Methods：方法
- Inherit：继承对象(原型继承关系)

1. 组件 (Component) - 复用性开发 UI强相关

- Properties: 强调从属关系 / 特性
- Methods
- Inherit
- Attribute: 强调描述性 / 属性
- Config & State：组件的配置(针对一次性配置，多用于全局) & 组件状态
- Event
- Lifecycle：创建 - ... - 销魂
- Children：树形结果基础

#### 生命周期

- 组件创建(created)
- 过程 (反复发生)
  - 挂载在组件树 (mounted) - 从组件树移除 (unMounted)
  - 代码修改/设置 (JS Change/Set) - 重新渲染/更新 (render/update)
  - 终端用户输入(User Input) - 重新渲染/更新 (render/update)
- 组件销毁(destoryed)