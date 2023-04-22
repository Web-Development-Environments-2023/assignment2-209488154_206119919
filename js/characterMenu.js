var characters = document.querySelectorAll('.character-option')

characters.forEach(function (element) {
    element.addEventListener("mouseenter", function () {onCharacterMouseEnter(element);});
    element.addEventListener("click", function (event) {onCharacterClick(event);});
});

var onCharacterMouseEnter = function(element) {
    var currentHighlight = document.querySelector(".highlight");
    currentHighlight.classList.toggle("highlight");
    element.classList.toggle("highlight");
};

var onCharacterClick = function(event) {
    var character = game.characters[event.currentTarget.id];
    game.characterWidth = character.characterWidth;
    game.characterHeight = character.characterHeight;
    game.selectedCharacterImage = character.image;

    game.moveToState(new LevelIntroState(game.level));
    pizzaBackground.onCharacterSelect();
    setVisibility('character-menu', 'none');
    setVisibility('pizza-background', 'none');
    setVisibility('playing-background', 'inline-block');
    setVisibility('gameCanvas', 'block');
};