var loginButton = document.getElementById("login-btn");

loginButton.addEventListener("click", onLogin);


function onLogin() {
    if (validate()) {
        alert("Wrong username or password.");
        return;
    }
    //TODO: remove this
    currentPlayer.username = document.getElementById("username").value;
    setVisibility('login', 'none');
    game.state = "configuration";
    onConfigurationOpen();
    loginClearForm();
};

function validate() {
    var un = document.getElementById("username").value;
    var lp = document.getElementById("lpassword").value;

    if (un in players && players[un] === lp) {
        currentPlayer.username = un;
        return true;
    }
    return false;
}

function loginClearForm() {
    var loginForm = document.getElementById('login-form');
    loginForm.reset();
}