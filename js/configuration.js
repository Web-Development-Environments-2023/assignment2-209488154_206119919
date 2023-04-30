var overlay = document.getElementById("overlay");
var finishConfigurationButton = document.getElementById("finish-configuration");
var timeChoice = document.getElementById("time-choice");
var keyChoiceElements = document.querySelectorAll("key-choice");

function onConfigurationOpen() {
    game.state = "configuration";
    setVisibility('configuration', 'flex');
};

function getKeyChoiceInputValue(which, code) {
    var aAscii = 65;
    var zAscii = 90;

    return (which >= aAscii && which <= zAscii) ? code : "Space";
}

function onKeyChoiceKeyDown(event) {
    document.getElementById("key-choice").value = getKeyChoiceInputValue(event.which, event.code);
    game.config.keyChoices.keyChoice = event.which;
}

function onTimeChoiceBlur() {
    var time = parseInt(timeChoice.value)
    time = isNaN(time) ? 120 : time;
    game.config.timeLimit = time;
}
  
function onConfigurationFinish() {
    if (game.config.timeLimit < 120) {
        alert("Minimum game duration is 120 seconds.");
    }
    else {
        goToCharacterSelect();
    }
}

function goToCharacterSelect() {
    game.state = "character-menu";
    setVisibility('configuration', 'none');
    setVisibility('character-menu', 'flex');
}

finishConfigurationButton.addEventListener("click", onConfigurationFinish);
timeChoice.addEventListener("blur", onTimeChoiceBlur);
document.getElementById("key-choice").addEventListener("keydown", function(event) {onKeyChoiceKeyDown(event)})