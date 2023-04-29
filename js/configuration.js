var overlay = document.getElementById("overlay");
var finishConfigurationButton = document.getElementById("finish-configuration");
var timeChoice = document.getElementById("time-choice");
var keyChoiceElements = document.querySelectorAll("key-choice");

function onConfigurationOpen() {
    game.state = "configuration";
    setVisibility('configuration', 'flex');
    setVisibility('overlay', 'block');
};

function getSpaceKeyInputValue(which, code) {
    var aAscii = 65;
    var zAscii = 90;

    return (which >= aAscii && which <= zAscii) ? code : "Space";
}

function onKeyChoiceKeyDown(event) {
    document.getElementById("spaceKey").value = getSpaceKeyInputValue(event.which, event.code);
    // game.config.keyChoices[event.target.id] = event.which;
    game.config.keyChoices.spaceKey = event.which;
}

function onTimeChoiceBlur() {
    var time = parseInt(timeChoice.value)
    //todo: shift back to 120
    time = isNaN(time) ? 30 : time;
    game.config.timeLimit = time;
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
document.getElementById("spaceKey").addEventListener("keydown", function(event) {onKeyChoiceKeyDown(event)})
// keyChoiceElements.forEach(function(element) {
//     element.setAttribute('value', '');
//     element.setAttribute('maxlength', '0');
//     element.addEventListener("keydown", function(event) {onKeyChoiceKeyDown(event)});
// });