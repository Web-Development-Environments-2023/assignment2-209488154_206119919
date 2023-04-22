function Game() {

    this.config = {
        invaderBulletRate: 0.5,
        invaderBulletMinVelocity: 50,
        invaderBulletMaxVelocity: 50,
        invaderInitialVelocity: 25,
        invaderAcceleration: 0,
        invaderDropDistance: 20,
        playerBulletVelocity: 120,
        playerBulletMaxFireRate: 2,
        fps: 50,
        invaderRanks: 2,
        invaderFiles: 10,
        playerSpeed: 120,
        levelDifficultyMultiplier: 0.2,
        pointsPerInvader: 5,
        limitLevelIncrease: 25
    };

    this.lives = 3;
    this.width = 0;
    this.height = 0;
    this.gameBounds = {left: 0, top: 0, right: 0, bottom: 0};
    this.intervalId = 0;
    this.score = 0;
    this.level = 1;
    this.characters = {
        'rosetta': {
            characterWidth: 76,
            characterHeight: 60,
            image: 'images/characters/rosetta.png'
        },
        'alfredo': {
            characterWidth: 67,
            characterHeight: 71,
            image: 'images/characters/alfredo.png'
        },
        'gina': {
            characterWidth: 67,
            characterHeight: 71,
            image: 'images/characters/gina.png'
        },
        'billie': {
            characterWidth: 76,
            characterHeight: 50,
            image: 'images/characters/billie.png'
        },
        'luna': {
            characterWidth: 78,
            characterHeight: 74,
            image: 'images/characters/luna.png'
        },
    }
    
    this.players = {"p": "testuser"};

    this.stateStack = [];

    this.pressedKeys = {};
    this.gameCanvas =  null;

    this.sounds = null;

    this.previousX = 0;
}

Game.prototype.initialise = function(gameCanvas) {

    this.gameCanvas = gameCanvas;

    this.width = gameCanvas.width;
    this.height = gameCanvas.height;

    this.gameBounds = {
        left: 0,
        right: 0.85 * this.width,
        top: 0,
        bottom: 0.925* this.height
    };
    
    this.level = 1;
    this.score = 0;
    this.lives = 3;
};

Game.prototype.moveToState = function(state) {
 
   if(this.currentState() && this.currentState().leave) {
     this.currentState().leave(game);
     this.stateStack.pop();
   }
   
   if(state.enter) {
     state.enter(game);
   }
 
   this.stateStack.pop();
   this.stateStack.push(state);
 };

Game.prototype.start = function() {

    this.moveToState(new WelcomeState());

    this.lives = 3;

    var game = this;
    this.intervalId = setInterval(function () { GameLoop(game);}, 1000 / this.config.fps);

};

Game.prototype.currentState = function() {
    return this.stateStack.length > 0 ? this.stateStack[this.stateStack.length - 1] : null;
};

Game.prototype.mute = function(mute) {

    if(mute === true) {
        this.sounds.mute = true;
    } else if (mute === false) {
        this.sounds.mute = false;
    } else {
        this.sounds.mute = this.sounds.mute ? false : true;
    }
};

function GameLoop(game) {
    var currentState = game.currentState();
    if(currentState) {

        var dt = 1 / game.config.fps;

        var ctx = this.gameCanvas.getContext("2d");
        
        if(currentState.update) {
            currentState.update(game, dt);
        }
        if(currentState.draw) {
            currentState.draw(game, dt, ctx);
        }
    }
}

Game.prototype.pushState = function(state) {

    if(state.enter) {
        state.enter(game);
    }
    this.stateStack.push(state);
};

Game.prototype.popState = function() {

    if(this.currentState()) {
        if(this.currentState().leave) {
            this.currentState().leave(game);
        }

        this.stateStack.pop();
    }
};

Game.prototype.stop = function Stop() {
    clearInterval(this.intervalId);
};

Game.prototype.keyDown = function(keyCode) {
    this.pressedKeys[keyCode] = true;
    if(this.currentState() && this.currentState().keyDown) {
        this.currentState().keyDown(this, keyCode);
    }
};

Game.prototype.touchstart = function(s) {
    if(this.currentState() && this.currentState().keyDown) {
        this.currentState().keyDown(this, KEY_SPACE);
    }    
};

Game.prototype.touchend = function(s) {
    delete this.pressedKeys[KEY_RIGHT];
    delete this.pressedKeys[KEY_LEFT];
};

Game.prototype.touchmove = function(e) {
	var currentX = e.changedTouches[0].pageX;
    if (this.previousX > 0) {
        if (currentX > this.previousX) {
            delete this.pressedKeys[KEY_LEFT];
            this.pressedKeys[KEY_RIGHT] = true;
        } else {
            delete this.pressedKeys[KEY_RIGHT];
            this.pressedKeys[KEY_LEFT] = true;
        }
    }
    this.previousX = currentX;
};

Game.prototype.keyUp = function(keyCode) {
    delete this.pressedKeys[keyCode];
    if(this.currentState() && this.currentState().keyUp) {
        this.currentState().keyUp(this, keyCode);
    }
};