GO_DOWN = true;
var speedUpIntervalId;

function PlayState(config, level) {
    this.config = config;
    this.level = level;
    this.currentInvaderBullet = null;

    this.invaderInitialVelocity = this.config.invaderInitialVelocity;
    this.invaderCurrentDropDistance =  0;
    this.invadersAreDropping =  false;
    this.lastPlayerBulletTime = null;

    this.player = null;
    this.extraLife = null;
    this.giveLife = false;
    this.invaders = [];
    this.playerBullets = [];
    this.invaderBullets = [];
    this.canShoot = true;
    this.shootDelay = 0;
}

function speedUp(){
    if(game.config.limitSpeedUp < 4){
        document.getElementById("game-audio-player").playbackRate *= 1.05;
        game.config.invaderBulletVelocity *= 1.2;
        game.config.invadersSpeed += 3;
        game.config.limitSpeedUp += 1;
    }

}

PlayState.prototype.enter = function(game) {

    var playerImage = new Image();
    playerImage.src = game.selectedCharacterImage;
    this.player = new Player(game.width / 2, game.playerBounds.bottom - 50, game.characterWidth, game.characterHeight, playerImage);

    // var levelMultiplier = this.level * this.config.levelDifficultyMultiplier;
    // var limitLevel = (this.level < this.config.limitLevelIncrease ? this.level : this.config.limitLevelIncrease);
    this.playerSpeed = this.config.playerSpeed;
    // this.invaderBulletRate = this.config.invaderBulletRate + (levelMultiplier * this.config.invaderBulletRate);
    // this.invaderBulletMinVelocity = this.config.invaderBulletMinVelocity + (levelMultiplier * this.config.invaderBulletMinVelocity);
    // this.invaderBulletMaxVelocity = this.config.invaderBulletMaxVelocity + (levelMultiplier * this.config.invaderBulletMaxVelocity);
    // this.playerBulletMaxFireRate = this.config.playerBulletMaxFireRate + 0.4 * limitLevel;

    var invaders = [];
    var invaderPhotos = ['images/clients/character_1.png', 'images/clients/character_2.png', 'images/clients/character_3.png', 'images/clients/character_5.png'];
    var invaderWidth = game.width * 0.08;
    var invaderHeight = game.height * 0.11;

    for (var row = 0; row < 4; row++){
        for (var col = 0; col < 5; col++){
            var photo = new Image();
            photo.src = invaderPhotos[row];
            invaders.push(new Invader((0.25 * game.width) + (col * 0.1 * game.width), (0.1 * game.height * row), row, invaderWidth, invaderHeight, 'Invader', photo));
        }
    }
    this.invaders = invaders;
    this.invaderVelocity = {x: -this.config.invaderInitialVelocity, y:0};
    this.invaderNextVelocity = null;

    speedUpIntervalId = window.setInterval(speedUp, 5000);
};



PlayState.prototype.update = async function(game, dt) {

    if(game.pressedKeys[KEY_LEFT]) {
        this.player.x -= this.playerSpeed * dt;
    }
    if(game.pressedKeys[KEY_RIGHT]) {
        this.player.x += this.playerSpeed * dt;
    }
    if(game.pressedKeys[KEY_UP]) {
        this.player.y -= this.playerSpeed * dt;
    }
    if(game.pressedKeys[KEY_DOWN]) {
        this.player.y += this.playerSpeed * dt;
    }

    if (game.pressedKeys[KEY_SPACE] && this.canShoot) {
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

    if (this.extraLife) {
        if (this.extraLife.x >= (this.player.x - this.player.width/2) && this.extraLife.x <= (this.player.x + this.player.width/2) && 
        this.extraLife.y >= (this.player.y - this.player.height/2) && this.extraLife.y <= (this.player.y + this.player.height/2)) {
            this.extraLife = null;
            if (healthBarState.currentHealth < healthBarState.maxHealth) {
                healthBarState.currentHealth++;
                renderHealthBar();
            }
        }

        if(this.extraLife.y > game.gameBounds.bottom) {
            this.extraLife = null;
        }
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

    if (this.extraLife) {
        var extraLife = this.extraLife;
        extraLife.y -= dt * extraLife.velocity;

        if(extraLife.y < 0) {
            this.extraLife = null;
        }
    var hitLeft = false, hitRight = false, hitBottom = false, hitTop = false;
    if (GO_DOWN) {
        for (i=0; i<this.invaders.length; i++) 
        {
            var invader = this.invaders[i];
            var newx = invader.x + (this.invaderVelocity.x * dt * this.config.invadersSpeed);
            var newy = invader.y + (this.invaderVelocity.y * dt * this.config.invadersSpeed);
            if (hitLeft == false && newx < game.invaderBounds.left) {
                hitLeft = true;
            }
            else if (hitRight == false && newx > game.invaderBounds.right) {
                hitRight = true;
            }
            else if (hitBottom == false && newy > game.invaderBounds.bottom) {
                hitBottom = true;
            }

            if (!hitLeft && !hitRight && !hitBottom) {
                invader.x = newx;
                if (newy <= game.invaderBounds.bottom - 0.1 * game.height * (3-invader.row)) {
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
            this.invaderVelocity = {x: 0, y:this.invaderInitialVelocity};
            this.invadersAreDropping = true;
            this.invaderNextVelocity = {x: this.invaderInitialVelocity , y:0};
        }
        if (hitRight) {
            this.invaderVelocity = {x: 0, y:this.invaderInitialVelocity};
            this.invadersAreDropping = true;
            this.invaderNextVelocity = {x: -this.invaderInitialVelocity , y:0};
        }
        if (hitBottom) {
            GO_DOWN = false;
            this.invadersAreDropping = false;
            this.invaderVelocity = this.invaderNextVelocity;
            this.invaderCurrentDropDistance = 0;
        }
    }
    
    else {
        for (i=0; i<this.invaders.length; i++) 
        {
            var invader = this.invaders[i];
            var newx = invader.x + (this.invaderVelocity.x * dt * this.config.invadersSpeed);
            var newy = invader.y + (this.invaderVelocity.y * dt * this.config.invadersSpeed);
            if (hitLeft == false && newx < game.invaderBounds.left) {
                hitLeft = true;
            }
            else if (hitRight == false && newx > game.invaderBounds.right) {
                hitRight = true;
            }
            else if (hitTop == false && newy < game.invaderBounds.top) {
                hitTop = true;
            }
    
            if (!hitLeft && !hitRight && !hitTop) {
                invader.x = newx;
                invader.y = newy;
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
            this.invaderVelocity = {x: 0, y:-this.invaderInitialVelocity};
            this.invadersAreDropping = true;
            this.invaderNextVelocity = {x: this.invaderInitialVelocity , y:0};
        }
        if (hitRight) {
            this.invaderVelocity = {x: 0, y:-this.invaderInitialVelocity};
            this.invadersAreDropping = true;
            this.invaderNextVelocity = {x: -this.invaderInitialVelocity , y:0};
        }
        if (hitTop) {
            GO_DOWN = true;
            this.invadersAreDropping = false;
            this.invaderVelocity = this.invaderNextVelocity;
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
            this.giveLife = !!this.extraLife;
        }
    }

    // var frontRankInvaders = {};
    // for (var i=0; i<this.invaders.length; i++) {
    //     var invader = this.invaders[i];

    //     if (!frontRankInvaders[invader.file] || frontRankInvaders[invader.file].rank < invader.rank) {
    //         frontRankInvaders[invader.file] = invader;
    //     }
    // }

    // for (var i=0; i<this.config.invaderFiles; i++) {
    //     var invader = frontRankInvaders[i];
    //     if (!invader) continue;
    //     var chance = this.invaderBulletRate * dt;
    //     if (chance > Math.random()) {
    //         if (!this.currentInvaderBullet || this.currentInvaderBullet.y >= game.height * 0.75) {
    //             this.currentInvaderBullet = new InvaderBullet(invader.x, invader.y + invader.height / 2, game.config.invaderBulletVelocity);
    //             this.invaderBullets.push(this.currentInvaderBullet);
    //         }
    //     }
    // }

    // for (var i=0; i<this.invaders.length; i++) {
    //     var invader = this.invaders[i];
    //     var chance = this.config.invaderBulletRate * dt;
    //     if (chance > Math.random()) {
    //         if (!this.currentInvaderBullet || this.currentInvaderBullet.y >= game.height * 0.75) {
    //             this.currentInvaderBullet = new InvaderBullet(invader.x, invader.y + invader.height / 2, game.config.invaderBulletVelocity);
    //             this.invaderBullets.push(this.currentInvaderBullet);
    //         }
    //     }
    // }

    var shootingInvader = this.invaders[Math.floor(Math.random() * this.invaders.length)];
    if (!this.currentInvaderBullet || this.currentInvaderBullet.y >= game.height * 0.75) {
        this.currentInvaderBullet = new InvaderBullet(shootingInvader.x, shootingInvader.y + shootingInvader.height / 2, game.config.invaderBulletVelocity);
        this.invaderBullets.push(this.currentInvaderBullet);
    }

    for(var i=0; i<this.invaderBullets.length; i++) {
        var invaderBullet = this.invaderBullets[i];
        if(invaderBullet.x >= (this.player.x - this.player.width/2) && invaderBullet.x <= (this.player.x + this.player.width/2) &&
                invaderBullet.y >= (this.player.y - this.player.height/2) && invaderBullet.y <= (this.player.y + this.player.height/2)) {
            this.invaderBullets.splice(i--, 1);
            game.lives--;
            if (game.lives > 0) {
                game.sounds.playSound('explosion', 0.5);
            }
            var playerImage = new Image();
            playerImage.src = game.selectedCharacterImage;

            this.player = new Player(game.width / 2, game.playerBounds.bottom - 50, game.characterWidth, game.characterHeight, playerImage);

            //todo: check if
            if (invaderBullet = this.currentInvaderBullet && this.currentInvaderBullet.y <= game.height * 0.75) {
                this.currentInvaderBullet = null;
            }
            healthBarState.currentHealth--;
            renderHealthBar();
        }
                
    }

    // for(var i=0; i<this.invaders.length; i++) {
    //     var invader = this.invaders[i];
    //     if((invader.x + invader.width/2) > (this.player.x - this.player.width/2) && 
    //         (invader.x - invader.width/2) < (this.player.x + this.player.width/2) &&
    //         (invader.y + invader.height/2) > (this.player.y - this.player.height/2) &&
    //         (invader.y - invader.height/2) < (this.player.y + this.player.height/2)) {
    //         game.lives = 0;
    //     }
    // }

    if(game.lives <= 0)
        loseGame(game);
    
    if(this.invaders.length === 0)
        winGame();
};

function loseGame(game) {
    game.sounds.playSound('lose', 1.5);
    game.didLose = true;
    game.didWin = false;
    finishGame(game);
}

function winGame() {
    game.didWin = true;
    game.didLose = false;
    finishGame(game);
}

function finishGame(game) {
    saveRecord(game);
    clearInterval(game.intervalId)
    setVisibility('gameCanvas', 'none');
    showScoreboard(game);
}

PlayState.prototype.draw = function(game, dt, ctx) {

    ctx.clearRect(0, 0, game.width, game.height);
    
    ctx.fillStyle = '#ff5555';
    if (this.giveLife) {
        var photo = new Image();
        photo.src = 'images/bullets/coin.png';
        var extraLife = this.extraLife;
        ctx.drawImage(photo, extraLife.x - 2, extraLife.y - 2, 20, 20);
    }
    
    ctx.fillStyle = '#006600';
    ctx.drawImage(this.player.photo, this.player.x, this.player.y, this.player.height, this.player.width);
    console.log("draw " + this.player.photo.src);
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
    var playerBulletPhotos = ['images/bullets/bullet_1.png', 'images/bullets/bullet_2.png'];
    for(var i=0; i<this.playerBullets.length; i++) {
        var photo = new Image();
        photo.src = playerBulletPhotos[i % 2];
        var playerBullet = this.playerBullets[i];
        ctx.drawImage(photo, playerBullet.x - 2, playerBullet.y - 2, 20, 20);
    }
};

PlayState.prototype.keyDown = function(game, keyCode) {

    if(keyCode == KEY_SPACE) {
        this.firePlayerBullet();
    }
    if(keyCode == KEY_P) {
        game.state = "pause";
        var gameAudioPlayer = document.getElementById('game-audio-player');
        gameAudioPlayer.pause();
        game.sounds.playSound('pause', 2.3);
        game.pushState(new PauseState());
    }
};

PlayState.prototype.keyUp = function(game, keyCode) {

};

// PlayState.prototype.firePlayerBullet = function() {

//     console.log("PIU");
//     if(this.lastPlayerBulletTime === null || ((new Date()).valueOf() - this.lastPlayerBulletTime) > (1000 / this.playerBulletMaxFireRate))
//     {   
//         this.playerBullets.push(new PlayerBullet(this.player.x, this.player.y - 12, this.config.playerBulletVelocity));
//         this.lastPlayerBulletTime = (new Date()).valueOf();

//         game.sounds.playSound('shoot', 0.5);
//     }
// };

PlayState.prototype.firePlayerBullet = function() {
    const now = new Date().getTime();
    if (now - this.lastPlayerBulletTime < this.shootDelay) {
        // If the delay time has not passed since the last bullet was fired, return early
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