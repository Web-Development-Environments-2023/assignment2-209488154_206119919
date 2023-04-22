function PauseState() {

}

PauseState.prototype.keyDown = function(game, keyCode) {

    if(keyCode == KEY_P) {
        game.popState();
        var gameAudioPlayer = document.getElementById('game-audio-player');
        gameAudioPlayer.play();
    }
};

PauseState.prototype.draw = function(game, dt, ctx) {

    ctx.clearRect(0, 0, game.width, game.height);

    var photo = new Image();
    photo.src = 'images/puase.png';
    ctx.drawImage(photo, game.width / 5, game.height / 7, 500, 500);

    return;
};