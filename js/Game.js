function Game() {
    this.config = {
        invaderInitialVelocity: 20,
        invaderDropDistance:1,
        playerBulletVelocity: 120,
        invaderBulletVelocity: 120,
        fps: 50,
        playerSpeed: 120,
        invadersSpeed: 10,
        limitSpeedUp: 0,
        keyChoices: {
            keyChoice: 32,
            leftKey: 37,
            upKey: 38,
            rightKey: 39,
            downKey: 40,
            pKey: 27
        },
        //todo: change back
        // timeLimit: 120
        timeLimit: 30
    };
    this.pauseStartTime = null;
    this.paused = false;
    this.pausedTimeElapesed = 0;
    this.lives = 3;
    this.width = 0;
    this.height = 0;
    this.playerBounds = {left: 0, top: 0, right: 0, bottom: 0};
    this.invaderBounds = {left: 0, top: 0, right: 0, bottom: 0};
    this.intervalId = 0;
    this.score = 0;
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

    this.invaderBounds = {
        left: 0,
        right: 0.85 * this.width,
        top: 0,
        bottom: 0.5 * this.height
    };

    this.playerBounds = {
        left: 0,
        right: 0.85 * this.width,
        top: 0.6 * this.height,
        bottom: 0.925 * this.height
    };
    
    this.score = 0;
    this.lives = 3;
    this.didWin = false;
    this.didLose = false;
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
    game.startTime = new Date();
    this.intervalId = setInterval(function () {
         GameLoop(game);
        }, 1000 / this.config.fps);

};

Game.prototype.currentState = function() {
    return this.stateStack.length > 0 ? this.stateStack[this.stateStack.length - 1] : null;
};

Game.prototype.resizeBounds = function() {
    this.invaderBounds = {
        left: 0,
        right: 0.85 * this.width,
        top: 0,
        bottom: 0.5 * this.height
    };

    this.playerBounds = {
        left: 0,
        right: 0.85 * this.width,
        top: 0.6 * this.height,
        bottom: 0.925 * this.height
    };
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
    if (game.paused) {
        var currentTime = new Date();
        game.pausedTimeElapesed = (currentTime - game.pauseStartTime) / 1000;
    }
    else {
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

        var currentTime = new Date();
        var timeElapsed = (currentTime - game.startTime) / 1000 - game.pausedTimeElapesed;
        document.getElementById("timer").value = (game.config.timeLimit - timeElapsed).toPrecision(3);
        checkIsTimeUp();
    }
    console.log(game.paused);
}

function checkIsTimeUp() {
    var currentTime = new Date();
    var timeElapsed = (currentTime - game.startTime) / 1000 - game.pausedTimeElapesed;

    if(timeElapsed >= game.config.timeLimit){
        finishGame(game);
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

Game.prototype.stop = function() {
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
        this.currentState().keyDown(this, this.config.keyChoices.keyChoice);
    }    
};

Game.prototype.touchend = function(s) {
    delete this.pressedKeys[game.config.keyChoices.rightKey];
    delete this.pressedKeys[game.config.keyChoices.leftKey];
};

Game.prototype.touchmove = function(e) {
	var currentX = e.changedTouches[0].pageX;
    if (this.previousX > 0) {
        if (currentX > this.previousX) {
            delete this.pressedKeys[game.config.keyChoices.leftKey];
            this.pressedKeys[game.config.keyChoices.rightKey] = true;
        } else {
            delete this.pressedKeys[game.config.keyChoices.rightKey];
            this.pressedKeys[game.config.keyChoices.leftKey] = true;
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