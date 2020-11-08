 	const TICK = Symbol('tick');
const TICK_HANDLER = Symbol('tick-handler');
const ANIMATIONS = Symbol('animations');
const START_TIME = Symbol('start-time');
const PAUSE_START = Symbol('pause-start');
const PAUSE_TIME = Symbol('pause-time');

export class Timeline {
    constructor() {
        this.state = 'Inited';
        this[ANIMATIONS] = new Set();
        this[START_TIME] = new Map();
    }

    start() {
        if (this.state !== 'Inited') {
            console.error('Timeline is not inited');
            return;
        }
        this.state = 'Started';
        this.startTime = Date.now();
        this[PAUSE_TIME] = 0;
        this[TICK] = () => {
            for (let animation of this[ANIMATIONS]) {
                let startTime = this[START_TIME].get(animation);
                if (startTime < this.startTime) {
                    startTime = this.startTime;
                }
                let over = animation.receive(Date.now() - startTime - this[PAUSE_TIME]);
                if (over) {
                    this[ANIMATIONS].delete(animation);
                    this[START_TIME].delete(animation);
                }
            }
            this[TICK_HANDLER] = requestAnimationFrame(this[TICK]);
        };
        this[TICK]();
    }

    pause() { 
        if (this.state !== 'Started') {
            console.error('Timeline is not started');
            return;
        }
        this.state = 'Paused';
        this[PAUSE_START] = Date.now();
        cancelAnimationFrame(this[TICK_HANDLER]);
    }
    resume() { 
        if (this.state !== 'Paused') {
            console.error('Timeline is not paused');
            return;
        }
        this.state = 'Started'
        this[PAUSE_TIME] += Date.now() - this[PAUSE_START];
        this[TICK]();
    }

    reset() { 
        this.pause();
        this.state = 'Inited';
        this.startTime = Date.now();
        this[ANIMATIONS] = new Set();
        this[START_TIME] = new Map();
        this[PAUSE_TIME] = 0;
        this[PAUSE_START] = 0;
        this[TICK_HANDLER] = null;
    }

    add(animation, startTime) {
        if (arguments.length < 2) {
            startTime = Date.now();
        }
        this[ANIMATIONS].add(animation);
        this[START_TIME].set(animation, startTime);
    }
}

export class Animation {
    // object, property 属性
    // startValue, endValue 起始值，终止值
    // duration 时长
    // timingFunction 差值函数，随着时间是怎么变化的
    constructor(object, property, startValue, endValue, duration, delay, timingFunction, template) {
        this.object = object;
        this.property = property;
        this.startValue = startValue;
        this.endValue = endValue;
        this.duration = duration;
        this.delay = delay || 0;
        this.timingFunction = timingFunction || (v => v);
        this.over = false;
        this.template = template || (v => v);
    }

    receive(time) {
        if (this.over || time < this.delay) {
            return this.over;
        }
        time = time - this.delay;
        if (time > this.duration) {
            time = this.duration;
            this.over = true;
        }
        let range = this.endValue - this.startValue;
        let process = this.timingFunction(time / this.duration);
        this.object[this.property] = this.template(this.startValue + range * process);
        return this.over;
    }
}