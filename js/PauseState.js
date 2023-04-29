var restartPauseButton = document.getElementById('pause-restart-container');
restartPauseButton.addEventListener("click", function() {onPauseRestart(game)});

var exitPauseButton = document.getElementById("pause-x-button");
exitPauseButton.addEventListener("click", function() {onPauseExit(game)});

function PauseState() {

}

PauseState.prototype.keyDown = function(game, keyCode) {

    if(keyCode == game.config.keyChoices.pKey) {
        onPauseExit(game);
    }
};

PauseState.prototype.draw = function(game, dt, ctx) {
    
    ctx.clearRect(0, 0, game.width, game.height);
    
    var photo = new Image();
    photo.src = 'images/puase.png';
    ctx.drawImage(photo, game.width / 5, game.height / 25, 500, 500);
    setVisibility('return', 'block');
    setVisibility('pause-x-button', 'block');
    // setVisibility('pause-restart-container',  'block');
    
    return;
};

function onPauseExit(game) {
    game.popState();
    var gameAudioPlayer = document.getElementById('game-audio-player');
    gameAudioPlayer.play();
    setVisibility('pause-restart-container',  'none');
    setVisibility('return', 'none');
    setVisibility('pause-x-button', 'none');
    showHealthBar();
}

function onPauseRestart(game){
    restartGame()
}