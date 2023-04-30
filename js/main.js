function setVisibility(divId, display) {
    const element = document.getElementById(divId);
    element.style.display = display;
}

function setVisibilityByClass(className, display){
    const elements = document.querySelectorAll(className);
    elements.forEach(element => element.style.display = display);
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

function getHealthBarState(game){
    return {
        healthBarSectionGap: 4,
        maxHealth: 3,
        currentHealth: game.lives
      };
}

function destroyGame() {    
    resetSpeed();
    clearInterval(timerIntervalId);
    var gameCanvas = document.getElementById("gameCanvas");
    var gameCanvasContainer = document.getElementById("game-canvas-container");
    gameCanvasContainer.removeChild(gameCanvas);
    document.getElementById("score").innerHTML = '0';
    hideHealthBar();
}

function restartGame(event) {
    game.stop();
    game.popState();
    destroyGame();
    initialiseGame(game);
    renderHealthBar(getHealthBarState(game));
    showHealthBar();
    setVisibility('scoreboard-container', 'none');
    setVisibilityByClass('.status-result', 'none');
    setVisibility('game-controls', 'flex');
    game.start();
    game.moveToState(new IntroState());
    setVisibility('gameCanvas', 'block');
}

var restart = document.querySelector(".start-over");
restart.addEventListener("click", function(event) {restartGame(event)} );

function returnHome() {
    currentPlayer = {username: '', records: []};
    game.stop();
    var state = game.state;
    setVisibility("playing-background", 'none');
    setVisibility('restart-nav-button', 'none');

    if(state == "gameover"){
        game.popState();
        setVisibility('scoreboard-container', 'none');
        setVisibilityByClass('.status-result', 'none');
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
    destroyGame();
    initialiseGame();
    renderHealthBar(getHealthBarState(game));
    game.moveToState(new WelcomeState());

    setVisibility('pizza-background', 'block');
    setVisibility('menu', 'block');
    setVisibility('game-controls', 'none');
    setVisibility('pazza-footer', 'inline-flex');
    initialisePizzaBackground();
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
    game.width = canvas.width;
    game.height = canvas.height;
    game.resizeBounds();
};

function onLoginNav(){
    returnHome();
    onLoginMenuOption();
}

function onSignupNav(){
    returnHome();
    onSignupMenuOption();
}


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

var aboutNavButton = document.getElementById("about-nav-button");
aboutNavButton.addEventListener("click", onAboutOpen);
var homeNavButton = document.getElementById("home-nav-button");
homeNavButton.addEventListener("click", returnHome);
var loginNavButton = document.getElementById("login-nav-button");
loginNavButton.addEventListener("click", onLoginNav);
var signupNavButton = document.getElementById("signup-nav-button");
signupNavButton.addEventListener("click", onSignupNav);
var instructionNavButton = document.getElementById("instruction-nav-button");
instructionNavButton.addEventListener("click", onInstructionOpen);
var restartNavButton = document.getElementById("restart-nav-button");
restartNavButton.addEventListener("click", function(event) {restartGame(event)});
