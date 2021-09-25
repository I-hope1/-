let width = 40, height = 40;

let content = document.getElementById('content');
content.style.setProperty('--width', width)
content.style.setProperty('--height', height)

for (let y = 0; y < height; y++) {
	for (let x = 0; x < width; x++) {
		let div = document.createElement('div')
		div.id = x + ',' + y
		div.index = width * y + x
		div.classList.add('hide');
		div.nearby = function(rot) {
			if ((x == 0 && rot == 0) ||
				(x == width - 1 && rot == 1) ||
				(y == 0 && rot == 2) ||
				(y == height - 1 && rot == 3)) return null;
			return map[this.index + rotation[rot]];
		}
		div.show = function(){
			return this.classList.replace('hide', 'show')
		}
		div.hide = function(){
			var f = /show/.test(this.className);
			this.className = 'hide';
			return f;
		}
		content.appendChild(div)
	}
}

let result = document.getElementById('result');

let map = [...content.children]
let rotation = [-1, 1, width, -width];

function setup(){
	let arrs = {
		pop(){
			let item = this.body.pop();
			item.hide();
			this.leave[item.index] = item;
		},
		unshift(item){
			if (item.show()) {
				this.body.unshift(item);
				delete this.leave[item.index];
				return true;
			}
				return false;
		},
		body: [],
		leave: map.concat()
	}
	
	let rot = Math.random() * 4 | 0;
	document.body.addEventListener('keydown', e => {
		var code = e.keyCode, lastRot = rot;
		if (e.keyCode >= 37 && e.keyCode <= 40) {
			rot = code == 37 ? 0 : code == 39 ? 1 : code == 40 ? 2 : 3;
			if (rotation[rot] + rotation[lastRot] == 0) rot = lastRot;
		}
	})

	let head, star = false;
	arrs.unshift(head = map[(width * height + width) / 2]);
	arrs.unshift(head = head.nearby(rot));
	function update(){
		var lastHead = head;
		head = head.nearby(rot)
		if (head == null) {
			clearInterval(int)
			result.innerText = 'GameOver';
			return;
		}
		lastHead.classList.remove('head')
		head.classList.add('head')
		head.style.setProperty('--rot', [0, 2, 3, 1][rot]);

		if (/star/.test(head.className)) {
			head.classList.remove('star')
			star = false
		} else arrs.pop();
		if (!arrs.unshift(head)) {
			result.innerText = 'GameOver';
			return;
		}


		if (!star) {
			let arr = arrs.leave.filter(e => e != null)
			arr[Math.random() * arr.length | 0].classList.add('star')
			star = true
		}
	}
	const int = setInterval(update, 300);
}
setup()