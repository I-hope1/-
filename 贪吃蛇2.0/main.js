let width = 40, height = 40;

let content = document.getElementById('content');
content.style.setProperty('--width', width)
content.style.setProperty('--height', height)

for (let i = 0, len = width * height; i < len; i++) {
	let div = document.createElement('div')
	div.index = i
	div.x = i % width, div.y = i / width | 0;
	div.show = function(){
		var flag = this.className == ''
		this.classList.add('show')
		return flag
	}
	content.appendChild(div)
}

let result = document.getElementById('result');

let map = [...content.children]
let rotation = [-width, 1, width, -1], rotArr = ['top', 'right', 'bottom', 'left'];

const Game = {
	food: false,
	arrs: {
		clear(){
			if (this.body) this.body.forEach(elem => {
				elem.className = ''
				this.leave[elem.index] = elem
			})
			this.body = [], this.leave = map.slice()
		},
		pop(){
			let item = this.body.pop()
			item.className = ''
			return this.leave[item.index] = item
		},
		unshift(item){
			if (item.show()) {
				this.body.unshift(item)
				delete this.leave[item.index]
				return true
			}
			return false
		}
	},

	nearby(elem, rot){
		let x = elem.x, y = elem.y;
		if ((x == 0 && rot == 3) ||
			(x == width - 1 && rot == 1) ||
			(y == 0 && rot == 0) ||
			(y == height - 1 && rot == 2)) return null;
		return map[elem.index + rotation[rot]];
	},
	GameOver(){
		clearInterval(this.int);
		delete this.int
		alert('GameOver');
	},
	update(){
		this.lastRot = this.rot;
		let arrs = this.arrs,
			// 为了复原尾巴
			tmp = arrs.body[arrs.body.length - 1].className;
		// head
		var lastHead = this.head;
		var head = this.head = this.nearby(this.head, this.rot)
		if (head == null) return this.GameOver()
		
		// tail
		if (/food/.test(head.className)) {
			head.classList.remove('food')
			this.food = false
		} else this.tail = arrs.pop();
		if (!arrs.unshift(head)) {
			this.tail.className = tmp
			this.arrs.body.push(this.tail)
			return this.GameOver()
		}
		this.tail.className = this.tail.className.replace(/\s\w+$/, '')

		lastHead.classList.remove('head');
		lastHead.classList.add(rotArr[this.rot])
		head.classList.add('head', rotArr[(this.rot + 2) % 4])

		// food
		if (!this.food) {
			let arr = arrs.leave.filter(e => e != null)
			arr[Math.random() * arr.length | 0].classList.add('food')
			this.food = true
		}
		result.innerText = 'mark: ' + (this.arrs.body.length - this.startLen)
	},
	init(rot, start, len){
		this.rot = rot;
		this.startLen = isNaN(len) ? 1 : len < 1 ? 1 : len > 10 ? 10 : len
		this.arrs.clear();
		let head;
		this.arrs.unshift(this.tail = head = map[start]);
		for (let i = this.startLen; i > 0; i--) {
			head.classList.add(rotArr[this.rot])
			head = this.nearby(head, rot)
			this.arrs.unshift(head);
			head.classList.add(rotArr[(this.rot + 2) % 4])
		}
		this.head = head
		this.update()
		this.int = setInterval(() => this.update(), 300)
	}
}

function rotate(rot){
	if (rot != (Game.lastRot + 2) % 4) Game.rot = rot;
}
// PC
window.addEventListener('keydown', e => {
	let code = e.keyCode;
	if (code >= 37 && code <= 40) {
		var rot = code == 37 ? 3 : code - 38;
		rotate(rot)
	}
	if (code == 32 && Game.int == null) setup()
})
// PE
document.body.addEventListener('click', function(e) {
	let w = this.clientWidth / 2,
		h = this.clientHeight / 2;
	var evt = window.event || e;
	var arcX = evt.pageX || evt.clientX,
		arcY = evt.pageY || evt.clientY;
	let arr = [h - arcY, arcX - w, arcY - h, w - arcX]
	let max = 0
	for (let i = 0; i < arr.length; i++) {
		if (arr[i] > arr[max]) max = i;
	}
	rotate(max)
});

let setup = () => Game.init(Math.random() * 4 | 0, (width * height + width) / 2, 2)
setup()