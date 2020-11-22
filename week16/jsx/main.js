import { createElement, Component } from './framework.js'

class Carousel extends Component{
  constructor() {
    super();
    this.attributes = Object.create(null);
  }
  setAttribute(name, value) {
    this.attributes[name] = value;
  }
  render() {
    this.root = document.createElement('div');
    this.root.classList.add('carousel');
    for (let item of this.attributes.data) {
      const child = document.createElement('div');
      child.style.backgroundImage = `url(${item})`;
      this.root.appendChild(child);
    }
    const children = this.root.children;
    const width = 500;
    let position = 0;
    this.root.addEventListener('mousedown', (e) => {
      const startX = e.clientX;
      const move = (event) => {
        const moveX = event.clientX - startX;
        // let current = position - Math.round(moveX / width); // 0, -1, -2, -3
        const current = position - (( moveX - moveX % width ) / 500);
        // 当前图片的左右两侧的图片位置计算
        for (let offset of [-1, 0, 1]) {
          let pos = current + offset;
          pos = (pos + children.length) % children.length;
          const child = children[pos];
          child.style.transition = 'none';
          child.style.transform = `translateX(${-pos * width + offset * width + moveX % width }px)`;
        }
      }
      const up = (event) => {
        const moveX = event.clientX - startX;
        position = position - Math.round(moveX / width);
        // 当前图片的左右两侧的图片位置计算
        for (let offset of [0, -Math.sign(Math.round(moveX / width) - moveX + width/2 * Math.sign(moveX))]) {
          let pos = position + offset;
          pos = (pos + children.length) % children.length;
          const child = children[pos];
          child.style.transition = '';
          child.style.transform = `translateX(${-pos * width + offset * width}px)`;
        }
        this.root.removeEventListener('mousemove', move);
        this.root.removeEventListener('mouseup', up);
      }
      // 处理触发拖拽造成的 mouseup 失效
      this.root.ondragstart = (event) => {
        return false;
      };
      // 处理 onmouseleave 造成的 mouseup 失效
      this.root.onmouseleave = (event) => {
        up(event);
      }
      this.root.addEventListener('mousemove', move);
      this.root.addEventListener('mouseup', up);
    })
    
    return this.root;
  }
  mountTo(parent) {
    parent.appendChild(this.render());
  }
}

const images = [
  'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg',
  'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg',
  'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg',
  'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg'
]

const config = {
  width: 500,
  timeout: 3000,
}

const swipper = <Carousel data={images} />;

swipper.mountTo(document.body);