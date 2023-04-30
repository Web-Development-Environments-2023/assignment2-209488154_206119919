GO_DOWN = true;
var speedUpIntervalId;
var timerIntervalId;

function PlayState(config) {
    this.config = config;
    this.currentInvaderBullet = null;

    this.invaderCurrentDropDistance =  0;
    this.invadersAreDropping =  false;
    this.lastPlayerBulletTime = 0;

    this.player = null;
    this.invaders = [];
    this.playerBullets = [];
    this.invaderBullets = [];
    this.canShoot = true;
    this.shootDelay = 800;
    GO_DOWN = true;
}

function speedUp(){
    if(game.config.limitSpeedUp < 4){
        document.getElementById("game-audio-player").playbackRate *= 1.05;
        game.config.invaderBulletVelocity *= 1.3;
        game.config.invadersSpeed += 3;
        game.config.limitSpeedUp += 1;
    }
}

function resetSpeed() {
    clearInterval(speedUpIntervalId);
    document.getElementById("game-audio-player").playbackRate = 1;
    game.config.invaderBulletVelocity = 50;
    game.config.invadersSpeed = 10;
    game.config.limitSpeedUp = 0;
}

function countDown(){
    if (!game.paused) {
        game.timeElapsed++;
        var currentTime = game.config.timeLimit - game.timeElapsed;
        if (currentTime < 0) {
            currentTime = 0;
        }
        document.getElementById("timer").value = currentTime;
    }
}

PlayState.prototype.enter = function(game) {
    timerIntervalId = setInterval(countDown, 1000);
    go(0, 0);
    var playerImage = new Image();
    playerImage.src = game.selectedCharacterImage;
    this.player = new Player(game.width / 2, game.playerBounds.bottom - 50, game.characterWidth, game.characterHeight, playerImage);

    this.playerSpeed = this.config.playerSpeed;

    var invaders = [];
    var invaderPhotos = ['images/clients/character_1.png', 'images/clients/character_2.png', 'images/clients/character_3.png', 'images/clients/character_5.png'];
    var invaderWidth = game.width * 0.08;
    var invaderHeight = game.height * 0.11;

    for (var row = 0; row < 4; row++){
        for (var col = 0; col < 5; col++){
            var photo = new Image();
            photo.src = invaderPhotos[row];
            invaders.push(new Invader((0.25 * game.width) + (col * 0.1 * game.width), (0.1 * game.height * row), row, col, invaderWidth, invaderHeight, 'Invader', photo));
        }
    }
    this.invaders = invaders;
    this.invaderVelocity = {x: -this.config.invaderInitialVelocity, y:0};
    this.invaderNextVelocity = null;

    speedUpIntervalId = window.setInterval(speedUp, 5000);
};

PlayState.prototype.update = async function(game, dt) {

    if(game.pressedKeys[game.config.keyChoices.leftKey]) {
        this.player.x -= this.playerSpeed * dt;
    }
    if(game.pressedKeys[game.config.keyChoices.rightKey]) {
        this.player.x += this.playerSpeed * dt;
    }
    if(game.pressedKeys[game.config.keyChoices.upKey]) {
        this.player.y -= this.playerSpeed * dt;
    }
    if(game.pressedKeys[game.config.keyChoices.downKey]) {
        this.player.y += this.playerSpeed * dt;
    }

    if (game.pressedKeys[game.config.keyChoices.keyChoice] && this.canShoot) {
        this.firePlayerBullet();
        this.canShoot = false;
        setTimeout(function() {
            this.canShoot = true;
        }, this.shootDelay);
    }
    if(this.player.x < game.playerBounds.left + 20) {
        this.player.x = game.playerBounds.left + 20;
    }
    if(this.player.x > game.playerBounds.right) {
        this.player.x = game.playerBounds.right;
    }

    if(this.player.y > game.playerBounds.bottom - 50) {
        this.player.y = game.playerBounds.bottom - 50;
    }

    if(this.player.y < game.height * 0.6) {
        this.player.y = game.height * 0.6;
    }

    for(var i=0; i<this.invaderBullets.length; i++) {
        var invaderBullet = this.invaderBullets[i];
        invaderBullet.y += dt * invaderBullet.velocity;

        if(invaderBullet.y > game.playerBounds.bottom) {
            this.invaderBullets.splice(i--, 1);
        }
    }

    for(i=0; i<this.playerBullets.length; i++) {
        var playerBullet = this.playerBullets[i];
        playerBullet.y -= dt * playerBullet.velocity;

        if(playerBullet.y < game.invaderBounds.top) {
            this.playerBullets.splice(i--, 1);
        }
    }


    var hitLeft = false, hitRight = false, hitBottom = false, hitTop = false;
    if (GO_DOWN) {
        for (i=0; i<this.invaders.length; i++) 
        {
            var invader = this.invaders[i];
            if (!this.invaderVelocity) {
            }
            var newx = invader.x + (this.invaderVelocity.x * dt * this.config.invadersSpeed);
            var newy = invader.y + (this.invaderVelocity.y * dt * this.config.invadersSpeed);
            if (hitLeft == false && newx <= game.invaderBounds.left + 0.1 * game.width * invader.col) {
                hitLeft = true;
            }
            else if (hitRight == false && newx >= game.invaderBounds.right - 0.1 * game.width * (4 - invader.col)) {
                hitRight = true;
            }
            else if (hitBottom == false && newy >= game.invaderBounds.bottom - 0.1 * game.height * (3 - invader.row)) {
                hitBottom = true;
            }

            if (!hitLeft && !hitRight && !hitBottom) {
                if (newx <= game.width - 0.1 * game.width * (4 - invader.col) && 
                    newx >= 0.1 * game.width * invader.col) {
                   invader.x = newx;
                }
                if (newy >= 0.1 * game.height * invader.row && 
                    newy <= game.height - 0.1 * game.height * (3 - invader.row)) {
                    invader.y = newy;
                }
            }
        }

        if (this.invadersAreDropping) {
            this.invaderCurrentDropDistance += this.invaderVelocity.y * dt;
            if (this.invaderCurrentDropDistance >= this.config.invaderDropDistance) {
                this.invadersAreDropping = false;
                this.invaderVelocity = this.invaderNextVelocity;
                this.invaderCurrentDropDistance = 0;
            }
        }

        if (hitLeft) {
            this.invaderVelocity = {x: 0, y:this.config.invaderInitialVelocity};
            this.invadersAreDropping = true;
            this.invaderNextVelocity = {x: this.config.invaderInitialVelocity, y:0};
        }
        if (hitRight) {
            this.invaderVelocity = {x: 0, y:this.config.invaderInitialVelocity};
            this.invadersAreDropping = true;
            this.invaderNextVelocity = {x: -this.config.invaderInitialVelocity, y:0};
        }
        if (hitBottom) {
            GO_DOWN = false;
            this.invadersAreDropping = false;
            if (this.invaderNextVelocity) {
                this.invaderVelocity = this.invaderNextVelocity;
            }
            this.invaderCurrentDropDistance = 0;
        }
    }
    
    else {
        for (i=0; i<this.invaders.length; i++) 
        {
            var invader = this.invaders[i];
            if (!this.invaderVelocity) {
            }
            var newx = invader.x + (this.invaderVelocity.x * dt * this.config.invadersSpeed);
            var newy = invader.y + (this.invaderVelocity.y * dt * this.config.invadersSpeed);
            if (hitLeft == false && newx <= game.invaderBounds.left + 0.1 * game.width * invader.col) {
                hitLeft = true;
            }
            else if (hitRight == false && newx >= game.invaderBounds.right - 0.1 * game.width * (4 - invader.col)) {
                hitRight = true;
            }
            else if (hitTop == false && newy <= game.invaderBounds.top + 0.1 * game.height * invader.row) {
                hitTop = true;
            }
    
            if (!hitLeft && !hitRight && !hitTop) {
                if (newx <= game.width - 0.1 * game.width * (4 - invader.col) &&
                    newx >= 0.1 * game.width * invader.col) {
                    invader.x = newx;
                }
                if (newy >= 0.1 * game.height * invader.row &&
                    newy <= game.height - 0.1 * game.height * (3 - invader.row)) {
                    invader.y = newy;
                }
            }
        }
    
        if (this.invadersAreDropping) {
            this.invaderCurrentDropDistance += this.invaderVelocity.y * dt;
            if (this.invaderCurrentDropDistance >= this.config.invaderDropDistance) {
                this.invadersAreDropping = false;
                this.invaderVelocity = this.invaderNextVelocity;
                this.invaderCurrentDropDistance = 0;
            }
        }
        if (hitLeft) {
            this.invaderVelocity = {x: 0, y:-this.config.invaderInitialVelocity};
            this.invadersAreDropping = true;
            this.invaderNextVelocity = {x: this.config.invaderInitialVelocity, y:0};
        }
        if (hitRight) {
            this.invaderVelocity = {x: 0, y:-this.config.invaderInitialVelocity};
            this.invadersAreDropping = true;
            this.invaderNextVelocity = {x: -this.config.invaderInitialVelocity, y:0};
        }
        if (hitTop) {
            GO_DOWN = true;
            this.invadersAreDropping = false;
            if (this.invaderNextVelocity) {
                this.invaderVelocity = this.invaderNextVelocity;
            }
            this.invaderCurrentDropDistance = 0;
        }
    }


    for (i=0; i<this.invaders.length; i++) {
        var invader = this.invaders[i];
        var bang = false;

        for (var j=0; j<this.playerBullets.length; j++){
            var playerBullet = this.playerBullets[j];

            if (playerBullet.x >= (invader.x - invader.width/2) && playerBullet.x <= (invader.x + invader.width/2) &&
                playerBullet.y >= (invader.y - invader.height/2) && playerBullet.y <= (invader.y + invader.height/2)) {

                this.playerBullets.splice(j--, 1);
                bang = true;
                game.score = go(invader.rank, game.score);
                
                break;
            }
        }
        if (bang) {
            this.invaders.splice(i--, 1);
            game.sounds.playSound('bang', 0.5);
        }
    }

    var shootingInvader = this.invaders[Math.floor(Math.random() * this.invaders.length)];
    if (!this.currentInvaderBullet || this.currentInvaderBullet.y >= game.height * 0.75) {
        this.currentInvaderBullet = new InvaderBullet(shootingInvader.x, shootingInvader.y + shootingInvader.height / 2, game.config.invaderBulletVelocity);
        this.invaderBullets.push(this.currentInvaderBullet);
    }

    for (var i=0; i<this.invaderBullets.length; i++) {
        var invaderBullet = this.invaderBullets[i];
        if (invaderBullet.x >= (this.player.x - this.player.width / 2) && invaderBullet.x <= (this.player.x + this.player.width / 2) &&
                invaderBullet.y >= (this.player.y - this.player.height / 2) && invaderBullet.y <= (this.player.y + this.player.height / 2)) {
            this.invaderBullets.splice(i--, 1);
            game.lives--;
            if (game.lives > 0) {
                game.sounds.playSound('explosion', 0.5);
            }
            var playerImage = new Image();
            playerImage.src = game.selectedCharacterImage;

            this.player = new Player(game.width / 2, game.playerBounds.bottom - 50, game.characterWidth, game.characterHeight, playerImage);

            if (invaderBullet == this.currentInvaderBullet && this.currentInvaderBullet.y <= game.height * 0.75) {
                this.currentInvaderBullet = null;
            }

            var healthBarState = getHealthBarState(game);
            renderHealthBar(healthBarState);
        }
    }
    if (game.lives <= 0) {
        loseGame(game);
    }
    if (this.invaders.length === 0) {
        winGame(game);
    }
};

function loseGame(game) {
    game.sounds.playSound('lose', 1.5);
    game.didLose = true;
    game.didWin = false;
    finishGame(game);
}

function winGame(game) {
    game.didWin = true;
    game.didLose = false;
    finishGame(game);
}

function finishGame(game) {
    game.stop();
    clearInterval(speedUpIntervalId);
    saveRecord(game);
    setVisibility('gameCanvas', 'none');
    showScoreboard(game);
}

PlayState.prototype.draw = function(game, dt, ctx) {

    ctx.clearRect(0, 0, game.width, game.height);
    
    ctx.fillStyle = '#006600';
    ctx.drawImage(this.player.photo, this.player.x, this.player.y, this.player.height, this.player.width);
    ctx.fillStyle = '#006600';
    for(var i=0; i<this.invaders.length; i++) {
        var invader = this.invaders[i];
        ctx.drawImage(invader.photo, invader.x, invader.y, invader.width, invader.height);
    }

    ctx.fillStyle = '#ff5555';
    for(var i=0; i<this.invaderBullets.length; i++) {
        var photo = new Image();
		photo.src = 'images/bullets/boss_bullet.png';
        var invaderBullet = this.invaderBullets[i];
        ctx.drawImage(photo, invaderBullet.x - 2, invaderBullet.y - 2, 20, 20);
    }

    ctx.fillStyle = '#ff5555';
    for(var i=0; i<this.playerBullets.length; i++) {
        var photo = new Image();
        photo.src = 'images/bullets/bullet_1.png';
        var playerBullet = this.playerBullets[i];
        ctx.drawImage(photo, playerBullet.x - 2, playerBullet.y - 2, 20, 20);
    }
};

PlayState.prototype.keyDown = function(game, keyCode) {

    if(keyCode == game.config.keyChoices.keyChoice) {
        this.firePlayerBullet();
    }
    if(keyCode == game.config.keyChoices.pKey) {
        game.paused = true;
        game.state = "pause";
        var gameAudioPlayer = document.getElementById('game-audio-player');
        gameAudioPlayer.pause();
        game.sounds.playSound('pause', 2.3);
        game.pushState(new PauseState());
    }
};

PlayState.prototype.keyUp = function(game, keyCode) {

};

PlayState.prototype.firePlayerBullet = function() {
    const now = new Date().getTime();
    if (now - this.lastPlayerBulletTime < this.shootDelay) {
        return;
    }

    this.playerBullets.push(new PlayerBullet(this.player.x, this.player.y - 12, this.config.playerBulletVelocity));
    this.lastPlayerBulletTime = now;

    game.sounds.playSound('shoot', 0.5);
};

function saveRecord(game) {
    var record = {
        username: currentPlayer.username,
        points: game.score,
    }
    currentPlayer.records.push(record);
}