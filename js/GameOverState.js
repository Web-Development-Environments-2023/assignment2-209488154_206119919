function GameOverState() {
    
}

GameOverState.prototype.update = function(game, dt) {

};

GameOverState.prototype.draw = function(game, dt, ctx) {

};

GameOverState.prototype.keyDown = function(game, keyCode) {
    if(keyCode == game.config.keyChoices.spaceKey) {
        game.lives = 3;
        game.score = 0;
        game.moveToState(new IntroState());
    }
};