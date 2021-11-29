let username = "Player";

function onChangeUsername() {
    username = document.getElementById("username-input").value;

    if (!username || username === "") {
        username = "Player";
    }

    window.localStorage["game.username"] = username;
}

function redirectToGame() {
    window.location.href = "/game";
}