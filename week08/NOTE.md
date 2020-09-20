学习笔记

本周学习了制作一个 Tic-Tac-Toe 的游戏，该游戏是 React 的官方教程给的一个例子，当然这里我们是不用 React 框架实现一个游戏。

游戏的棋盘可以使用二维数组来模拟.

```html
<div id="board"></div>
    <script>
      let pattern = [
        [2, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
      ];

      let color = 1;

      console.log(pattern);

      function show() {
        let board = document.getElementById("board");
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.innerText =
              pattern[i][j] === 2 ? "❌" : pattern[i][j] === 1 ? "⭕️" : "";
            board.appendChild(cell);
          }
          board.appendChild(document.createElement("br"));
        }
      }
      show(pattern);
    </script>
```

给棋盘添加事件，给每个格子 cell 加上 click 事件，然后在对应的位置画上对应的棋子.

```html
function show() {
        let board = document.getElementById("board");
        // 绘制之前需要清空棋盘，然后重新绘制
        board.innerHTML = "";
        for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
        let cell = document.createElement("div");
        cell.classList.add("cell");
        cell.innerText =
        pattern[i][j] === 2 ? "❌" : pattern[i][j] === 1 ? "⭕️" : "";
        cell.addEventListener("click", () => move(j, i));
        board.appendChild(cell);
        }
        board.appendChild(document.createElement("br"));
        }
    }

    function move(x, y) {
    pattern[y][x] = color;
    // 让color从1变2，从2变1交替变化
    color = 3 - color;
    show();
    }
```

判断胜负，首先规则表明输赢有 6 条线，三横三纵两斜，任意一行满足同色，就获胜.

```
 <script>
// ......
function check(pattern, color) {
 for (let y = 0; y < 3; y++) {
   let win = true;
   for (let x = 0; x < 3; x++) {
     if (pattern[y * 3 + x] !== color) {
       win = false;
       break;
     }
   }
   if (win) return true;
 }

 for (let y = 0; y < 3; y++) {
   let win = true;
   for (let x = 0; x < 3; x++) {
     if (pattern[x * 3 + y] !== color) {
       win = false;
       break;
     }
   }
   if (win) return true;
 }

 {   // 正对角线
   let win = true;
   for (let i = 0; i < 3; i++) {
     if (pattern[i * 3 + i] !== color) {
       win = false;
       break;
     }
   }
   if (win) return true;
 }

 {   // 反对角线
   let win = true;
   for (let i = 0; i < 3; i++) {
     if (pattern[i * 3 + 2 - i] !== color) {
       win = false;
       break;
     }
   }
   if (win) return true;
 }

 return false;
}
</script>
```

加入初步 AI 的能力，假设当前有一步能赢，我们把它挑出来，检查是不是要赢了，如果检查出来有一方要赢了，给出一个提示.

```html
    // 循环遍历上面每一个空节点，如果有一个空节点能让check变赢，那么久可用在willWin上去打上win了，但是如果willWin直接走这一步，然后执行check，原来的pattern就已经被破坏掉了，所以要写一个克隆函数
  function willWin(pattern, color) {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        //如果当前位置不是空的，直接跳过去
        if (pattern[i][j]) {
          continue;
        }
        let tmp = clone(pattern);
        tmp[i][j] = color;
        if (check(tmp, color)) {
          return true;
        }
      }
    }
    return false;
  }
 
```

红绿灯代码：

```javascript
const trafficDOM = document.getElementById("traffic");

function turnRed() {
	const traffic = trafficDOM.getElementsByTagName("div");
	for (let i = 0; i < traffic.length; i++) {
		traffic[i].classList.remove("light");
		document.getElementsByTagName("red")[0].classList.add("light");
	}
}

function turnYello() {
	const traffic = trafficDOM.getElementsByTagName("div");
	for (let i = 0; i < traffic.length; i++) {
		traffic[i].classList.remove("light");
		document.getElementsByTagName("yello")[0].classList.add("light");
	}
}

function turnGreen() {
	const traffic = trafficDOM.getElementsByTagName("div");
	for (let i = 0; i < traffic.length; i++) {
		traffic[i].classList.remove("light");
		document.getElementsByTagName("red")[0].classList.add("light");
	}
}

drawLight();

function drawLight() {
	setTimeout(() => {
		turnGreen();
		setTimeout(() => {
			turnYellow();
			setTimeout(() => {
				turnRed();
				drawLight();
			}, 3000)
		}, 3000)
	}, 3000)
}
```

