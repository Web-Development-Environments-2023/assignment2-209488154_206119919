
function setVisibility(divId, display) {
    const element = document.getElementById(divId);
    element.style.display = display;
    var what = element.style.display;
    console.log( divId,".display -> ", what);
    // console.log("pizzaBackground.canvas -> ", pizzaBackground.canvas);
}

var pizzaBackground;
var canvas;
var game;


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

function initialiseCanvas() {
    canvas = document.getElementById("gameCanvas");
    canvas.width = 0.7 * window.innerWidth;
    canvas.height = 0.85 * window.innerHeight;
    
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function initialiseGame(currentGame = null) {
    if (!currentGame) game = new Game();
    initialiseCanvas();
    game.initialise(canvas);
    game.start();
}

function destroyGame() {
    //todo: destroyGameCanvas
    var gameCanvas = document.getElementById("gameCanvas");
    var content = document.getElementById("content");
    content.removeChild(gameCanvas);
}


function restartGame(event) {
    event.preventDefault();
    game.popState();
    initialiseGame(game);
}   
// function returnHome(){
//     console.log(game.stateStack);
//     var state = game.state;
//     setVisibility("playing-background", 'none');
//     if(state == "pause"){
//         console.log("pause");
//         var container = document.getElementById("pizza-background-canvas");
//         if(container){
//             container.parentNode.removeChild(container);
//         }
//         game.popState();
//         game.popState();
//         var canvas = document.getElementById("gameCanvas");
//         var ctx = canvas.getContext("2d");
//         ctx.clearRect(0, 0, game.width, game.height);
        
//     }
//     else{
//         setVisibility(state, "none");
//     }
//     initialisePizzaBackground();
        
//     // if(state == "pause"){
//     //     document.body.appendChild(pizzaBackground.canvas);
//     // }

//     setVisibility('menu', 'flex');
//     setVisibility('header', "block");
//     setVisibility('return', 'none');
// }

function returnHome() {
    console.log("game state stack before pop: ", game.stateStack);
    var state = game.state;
    setVisibility("playing-background", 'none');
    if(state == "pause" || state == "gameover"){
        if(state == "gameover"){
            game.popState();
            setVisibility('scoreboard-container', 'none');
        }
        else{
            game.popState();
            game.popState();
        }
        startMenuMusic();
        
        game.moveToState(new WelcomeState());
        console.log("game state stack after pop and move to welcome: ", game.stateStack);
        var canvas = document.getElementById("gameCanvas");
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, game.width, game.height);
    }
    else{
        setVisibility(state, "none");
    }
    initialisePizzaBackground();
    setVisibility('pizza-background', 'block');
    setVisibility('gameCanvas', 'none');
    setVisibility('menu', 'block');
    setVisibility('header', "block");
    setVisibility('return', 'none');
    setVisibility('game-score-container', 'none');
}

function initialisePizzaBackground() {
    var container = document.getElementById('pizza-background');
    pizzaBackground = new PizzaBackground();
    console.log("hello from  initialisePizzaBackground");
    pizzaBackground.initialise(container);
    pizzaBackground.start();
    
}

initialisePizzaBackground();
// initialiseCanvas();
initialiseGame();
console.log(this.canvas);


window.addEventListener('resize', () => pizzaBackground?.resizePizzaBackground());

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