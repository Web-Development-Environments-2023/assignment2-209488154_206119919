function setVisibility(divId, display) {
    const element = document.getElementById(divId);
    element.style.display = display;
}

var pizzaBackground;
var canvas;
var game;
var players = {"p": "testuser"};
var currentPlayer = {username: '', records: []};;

function startMenuMusic() {
	menuAudioPlayer.play();
    gameAudioPlayer.pause();
	gameAudioPlayer.currentTime = 0;
    gameAudioPlayer.playbackRate = 1;
}

function startGameMusic() {
    gameAudioPlayer.play();
    menuAudioPlayer.pause();
	menuAudioPlayer.currentTime = 0;
}

function showHealthBar(){
    setVisibility('healthBarText',  'inline-block');
    setVisibility('healthBarInner',  'inline-block');
    setVisibility('health-bar',  'inline-block');
}

function hideHealthBar(){
    setVisibility('healthBarText',  'none');
    setVisibility('healthBarInner',  'none');
    setVisibility('health-bar',  'none');
}

function initialiseCanvas() {
    canvas = document.getElementById("gameCanvas");

    if(!canvas) {
        var gameCanvasContainer = document.getElementById("game-canvas-container");
        canvas = document.createElement('canvas');
        canvas.setAttribute("id", "gameCanvas");
        gameCanvasContainer.appendChild(canvas);
    }
    canvas.width = 0.7 * window.innerWidth;
    canvas.height = 0.85 * window.innerHeight;
    
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function initialiseGame(currentGame = null) {
    if (!currentGame) game = new Game();
    initialiseCanvas();
    game.initialise(canvas);
}

function destroyGame() {    
    var gameCanvas = document.getElementById("gameCanvas");
    var gameCanvasContainer = document.getElementById("game-canvas-container");
    gameCanvasContainer.removeChild(gameCanvas);
    var score = document.getElementById("score");
    score.innerHTML = '0';
    hideHealthBar()
}

function restartGame(event) {
    game.popState();
    setVisibility('scoreboard-container', 'none');
    destroyGame();
    initialiseGame(game);
    game.start();
    game.moveToState(new IntroState());
    setVisibility('return', 'none');
    setVisibility('gameCanvas', 'block');
}

var restart = document.querySelector(".start-over");
restart.addEventListener("click", function(event) {restartGame(event)} );

function returnHome() {
    setVisibility('pause-restart-container',  'none');
    currentPlayer = {username: '', records: []};
    game.stop();
    var state = game.state;
    setVisibility("playing-background", 'none');
    if(state == "gameover"){
        game.popState();
        setVisibility('scoreboard-container', 'none');
    }

    if(state == "pause"){
        game.popState();
        game.popState();
    }

    if(state == 'signup' || state == 'login' || state == 'character-menu')
    {
        setVisibility('character-menu', 'none');
        setVisibility(state, 'none');
        loginClearForm();
        signupClearForm();
    }

    if(state == 'configuration') {
        setVisibility('configuration', 'none');
    }

    startMenuMusic();
    game.moveToState(new WelcomeState());
    destroyGame();
    game = null;

    setVisibility('pizza-background', 'block');
    setVisibility('menu', 'block');
    setVisibility('header', "block");
    setVisibility('return', 'none');
    setVisibility('game-controls', 'none');
    setVisibility('pazza-footer', 'inline-flex');
    initialisePizzaBackground();
    initialiseGame();
}

function initialisePizzaBackground() {
    var container = document.getElementById('pizza-background');
    pizzaBackground = new PizzaBackground();
    pizzaBackground.initialise(container);
    pizzaBackground.start();
}
initialisePizzaBackground();
initialiseGame();


function resizeGameCanvas(canvas) {
    canvas.width = 0.7 * window.innerWidth;
    canvas.height = 0.85 * window.innerHeight;
};


window.addEventListener('resize', () => pizzaBackground?.resizePizzaBackground());
window.addEventListener('resize', () => resizeGameCanvas(document.getElementById("gameCanvas")));

window.addEventListener("keydown", function keydown(e) {
    var keycode = e.which || window.event.keycode;
    if(keycode == 37 || keycode == 39 || keycode == 32) {
        e.preventDefault();
    }
    game?.keyDown(keycode);
});
window.addEventListener("keyup", function keydown(e) {
    var keycode = e.which || window.event.keycode;
    game?.keyUp(keycode);
});
window.addEventListener("touchstart", function (e) {
    game?.touchstart(e);
}, false);
window.addEventListener('touchend', function(e){
    game?.touchend(e);
}, false);
window.addEventListener('touchmove', function(e){
    game?.touchmove(e);
}, false);

var MainMenuOption = document.getElementById("return");
MainMenuOption.addEventListener("click", returnHome);
