var restartPauseButton = document.getElementById('pause-restart-container');
restartPauseButton.addEventListener("click", function() {onPauseRestart(game)});

function PauseState() {

}

PauseState.prototype.keyDown = function(game, keyCode) {

    if(keyCode == KEY_P) {
        game.popState();
        var gameAudioPlayer = document.getElementById('game-audio-player');
        gameAudioPlayer.play();
        setVisibility('pause-restart-container',  'none');
    }
};

PauseState.prototype.draw = function(game, dt, ctx) {

    ctx.clearRect(0, 0, game.width, game.height);

    var photo = new Image();
    photo.src = 'images/puase.png';
    ctx.drawImage(photo, game.width / 5, game.height / 25, 500, 500);
    setVisibility('return', 'block');

    return;
};

function onPauseRestart(game){
    game.initialise(game.gameCanvas);
}