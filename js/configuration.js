var overlay = document.getElementById("overlay");
var finishConfigurationButton = document.getElementById("finish-configuration");
var timeChoice = document.getElementById("time-choice");
var keyChoiceElements = document.querySelectorAll("key-choice");

function onConfigurationOpen() {
    game.state = "configuration";
    setVisibility('configuration', 'flex');
    setVisibility('overlay', 'block');
};

function onKeyChoiceKeyDown(event) {
    game.config.keyChoices[event.target.id] = event.target.value;
}

function onTimeChoiceBlur() {
    var time = parseInt(timeChoice.value)
    time = isNaN(time) ? 2 : time;
    game.config.playingTime = time * 60 * 1000;
}
  
function onConfigurationFinish() {
    goToCharacterSelect();
}

function goToCharacterSelect() {
    game.state = "character-menu";
    setVisibility('configuration', 'none');
    setVisibility('overlay', 'none');
    setVisibility('character-menu', 'flex');
}

finishConfigurationButton.addEventListener("click", onConfigurationFinish);
timeChoice.addEventListener("blur", onTimeChoiceBlur);
keyChoiceElements.forEach(function(element) {
    element.setAttribute('value', '');
    element.setAttribute('maxlength', '0');
    element.addEventListener("keydown", function(event) {onKeyChoiceKeyDown(event)});
});