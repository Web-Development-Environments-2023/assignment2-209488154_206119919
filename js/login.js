var loginButton = document.getElementById("login-btn");

loginButton.addEventListener("click", onLogin);


function onLogin() {
    if (validate()) {
        alert("Wrong username or password.");
        return;
    }
    setVisibility('login', 'none');
    game.state = "character-menu";
    setVisibility('character-menu', 'flex');
};

function validate() {
    var un = document.getElementById("username").value;
    var lp = document.getElementById("lpassword").value;

    if (un in game.players && game.players[un] === lp) {
        return true;
    }
    return false;
}