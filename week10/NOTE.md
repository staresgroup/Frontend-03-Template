学习笔记

# 使用 LL 算法构建 AST

AST ：Abstract Syntax Tree 即抽象语法树，在编译原理领域经常见到。

- 词法
  - TokenNumber:
    - 1 2 3 4 5 6 7 8 9 0的组合
  - Operator: + - * /
  - Whitespace:  <SP>
  - LineTerminator: <LF> <CR>

- 语法

```
<Expression>::=
  <AdditiveExpression><EOF>

<AdditiveExpression>::=
  <MultiplicativeExpression>
  |<AdditiveExpression><+><MultiplicativeExpression>
  |<AdditiveExpression><-><MultiplicativeExpression>

<MultiplicativeExpression>::=
  <Number>
  |<MultiplicativeExpression><*><Number>
  |<MultiplicativeExpression></><Number>
```

「词法分析」这个过程其实就是将一串文本拆分成一个个的单词（Token）。

词法分析如果用正则来做的话，就非常简单了。我们利用正则 () 捕获规则，就可以直接将对应的 Token 直接拆出来。

有了 Token 之后我们就可以进行「语法分析」了，语法分析就是在词法分析的基础之上得到程序的语法结构。这个结构是一棵树，一般叫做「抽象语法树（Abstract Syntax Tree）」，简称 AST。

既然是要构建一棵树，我们就有两种方法。一种是自顶向下，向下扫描 Token 串，构建它的子节点。另一种是自底向上，先将最下面的叶子节点识别出来，然后再组装上一级节点。

也就是说语法分析一般有两种算法，它们分别对应的就是 LL 和 LR。

LL 分析器是一种处理某些上下文无关文法的自顶向下分析器。因为它从左（Left）到右处理输入，再对句型执行最左推导出语法树（Left derivation，相对于 LR 分析器）。能以此方法分析的文法称为 LL 文法。

LR 分析器是一种自底向上（bottom-up）的上下文无关语法分析器。LR 意指由左（Left）至右处理输入字符串，并以最右边优先派生（Right derivation）的推导顺序（相对于 LL 分析器）建构语法树。能以此方式分析的语法称为 LR 语法。而在 LR(k) 这样的名称中，k 代表的是分析时所需前瞻符号（lookahead symbol）的数量，也就是除了目前处理到的输入符号之外，还得再向右引用几个符号之意；省略 （k）时即视为 LR(1)，而非 LR(0)。