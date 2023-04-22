function PizzaBackground() {
	this.fps = 30;
	this.canvas = null;
	this.width = 0;
	this.height = 0;
	this.minVelocity = 15;
	this.maxVelocity = 30;
	this.pizzaAmount = 100;
	this.pizzas = [];
	this.intervalId = 0;
}

PizzaBackground.prototype.initialise = function(div) {
	var self = this;

	this.containerDiv = div;
	self.width = window.innerWidth;
	self.height = window.innerHeight;

	var canvas = document.createElement('canvas');
	div.appendChild(canvas);
	this.canvas = canvas;
	this.canvas.width = this.width;
	this.canvas.height = this.height;
};

PizzaBackground.prototype.start = function() {

	var pizzas = [];
	for(var i=0; i<this.pizzaAmount; i++) {
		pizzas[i] = new Pizza(Math.random()*this.width, Math.random()*this.height,
		 Math.random()*(0.04*this.width)+1, (Math.random()*(this.maxVelocity - this.minVelocity))+this.minVelocity);
	}
	this.pizzas = pizzas;

	var self = this;
	this.intervalId = setInterval(function() {
		self.update();
		self.draw();	
	}, 1000 / this.fps);
};

PizzaBackground.prototype.stop = function() {
	clearInterval(this.intervalId);
};

PizzaBackground.prototype.update = function() {
	var dt = 1 / this.fps;

	for(var i=0; i<this.pizzas.length; i++) {
		var pizza = this.pizzas[i];
		pizza.y += dt * pizza.velocity;
		if(pizza.y > this.height) {
			this.pizzas[i] = new Pizza(Math.random()*this.width, 0, Math.random()*50+1, 
		 	(Math.random()*(this.maxVelocity - this.minVelocity))+this.minVelocity);
		}
	}
};

PizzaBackground.prototype.draw = function() {

	var ctx = this.canvas.getContext("2d");

 	ctx.fillStyle = '#000000';
	ctx.fillRect(0, 0, this.width, this.height);

	var photos = ['images/pizzas/half_pizza.png', 'images/pizzas/pizza_slice.png', 'images/pizzas/pizza_slice_2.png', 'images/pizzas/pizza_slice_3.png'];
	for(var i=0; i<this.pizzas.length;i++) {
		var photo = new Image();
		photo.src = photos[i % 4];
		var pizza = this.pizzas[i];
		ctx.drawImage(photo, pizza.x, pizza.y, pizza.size, pizza.size);
	}
};

PizzaBackground.prototype.drawPlayingBackground = function() {
	var ctx = this.canvas.getContext("2d");
}

PizzaBackground.prototype.clear = function() {
	var ctx = this.canvas.getContext("2d");
	ctx.clearRect(0, 0, this.width, this.height);
}

PizzaBackground.prototype.onCharacterSelect = function() {
	this.stop();
	this.clear();
	this.drawPlayingBackground();
	switchMusic();
}

var switchMusic = function() {
	var menuAudioPlayer = document.getElementById('menu-audio-player');
	menuAudioPlayer.pause();
	var gameAudioPlayer = document.getElementById('game-audio-player');
	gameAudioPlayer.play();
}

function Pizza(x, y, size, velocity) {
	this.x = x;
	this.y = y; 
	this.size = size;
	this.velocity = velocity;
}

PizzaBackground.prototype.resizePizzaBackground = function() {
	this.width = window.innerWidth;
	this.height = window.innerHeight;

	this.canvas.width = this.width;
	this.canvas.height = this.height;

	clearCanvas();
	this.start();
};

function clearCanvas() {
	var ctx = this.canvas.getContext("2d");
	ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
	console.log('cleared');
	clearInterval(this.intervalId);
}