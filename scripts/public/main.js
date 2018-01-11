//String für den Header im Game-DIV
var ttt = "TicTacToe";
var tokenArr = ['X', 'O'];
var playerNumber; //0 = X, 1 = O
var setToken = true;
var gameWon = false;
var gameLost = false;
/*Variablen für Zelle 1 bis 9 werden erstellt und den Zellen der Seite zugewiesen.
    Danach werden noch EventListener erstellt um beim klicken ein X zu setzen.*/
var cellArr = [
    document.getElementById("cell1"),
    document.getElementById("cell2"),
    document.getElementById("cell3"),
    document.getElementById("cell4"),
    document.getElementById("cell5"),
    document.getElementById("cell6"),
    document.getElementById("cell7"),
    document.getElementById("cell8"),
    document.getElementById("cell9")
];
//Sobald die Seite fertig geladen wurde, wird die Funktion aufgerufen
$(document).ready(function () {
    //Das Game-DIV wird zuerst nicht angezeigt
    $("#game").hide();
    $("#lostwon").hide();
    $("#playBtn").click(function () {
        /*Sobald der User auf den Play-Button drückt, wird der Username festgelegt
        und der Login wird nicht mehr angezeigt.Das Game-DIV wird eingeblendet
        und ein Socket zum Server wird geöffnet. Der Username wird über den Socket
        zum Server gesendet und der Header bekommt den Usernamen.*/
        var socket = io();
        socket.on('connection check', function (check) {
            if (check == true) {
                var username = $("#input").val();
                $("#ttt").text(ttt + "-" + username);
                $("#login").hide();
                $("#game").fadeIn(1000);
                socket.emit('name', username);
                socket.emit('get highscores');
                socket.on('reset', function () {
                    resetField();
                });
                socket.on('want to reset', function (number) {
                    $("#numberOfResets").text(number + "/2");
                });
                socket.on('player', function (player) {
                    playerNumber = player - 1;
                    if (playerNumber == 0) {
                        $("#circle").css("background-color", "green");
                    }
                });
                socket.on('user joined', function (nameOfOtherUser) {
                    alert(nameOfOtherUser + " joined the game");
                });
                socket.on('cellArr', function (index) {
                    switch (playerNumber) {
                        case 0:
                            cellArr[index].textContent = tokenArr[1];
                            break;
                        case 1:
                            cellArr[index].textContent = tokenArr[0];
                            break;
                    }
                });
                socket.on('start stop', function (bool) {
                    setToken = bool;
                    if (setToken) {
                        $("#circle").css("background-color", "green");
                    }
                    else {
                        $("#circle").css("background-color", "red");
                    }
                });
                socket.on('game over', function () {
                    if (gameWon) {
                        $("#lostwon").text("You've won the game, you're now the master of ttt!");
                        $("#lostwon").fadeIn(1000);
                    }
                    else {
                        gameLost = true;
                        $("#lostwon").text("You've lost the game, try better next time!");
                        $("#lostwon").fadeIn(1000);
                    }
                });
                var _loop_1 = function (i) {
                    cellArr[i].addEventListener('click', function () {
                        if (!gameWon && !gameLost) {
                            if (setToken == true && !ifTokenSet(i)) {
                                cellArr[i].textContent = tokenArr[playerNumber];
                                socket.emit('token set', i);
                            }
                            if (ifGameWon(tokenArr[playerNumber])) {
                                gameWon = true;
                                socket.emit('game over');
                                //appendHighscore();
                            }
                        }
                    });
                };
                for (var i = 0; i < 9; i++) {
                    _loop_1(i);
                }
                $("#reset").click(function () {
                    socket.emit('want to reset', playerNumber);
                });
            }
            else {
                alert("There are already two players!");
            }
        });
    });
});
function resetField() {
    for (var i = 0; i < 9; i++) {
        cellArr[i].textContent = null;
    }
    gameWon = false;
    gameLost = false;
    $("#lostwon").fadeOut();
}
function appendHighscore() {
    var $username = $('<span class="username"/>').text("jungfrau");
    var $wins = $('<span class="messageBody">').text(10);
    var $highscore = $('<li class="highscore"/>').append($username, $wins);
    $("#highlist").append($highscore);
}
function ifTokenSet(index) {
    if (cellArr[index].textContent == "X" || cellArr[index].textContent == "O") {
        return true;
    }
}
function ifGameWon(tok) {
    var row1 = checkRow(0, 2, tok);
    var row2 = checkRow(3, 5, tok);
    var row3 = checkRow(6, 8, tok);
    var col1 = checkCol(0, 6, tok);
    var col2 = checkCol(1, 7, tok);
    var col3 = checkCol(2, 8, tok);
    var diag1 = checkDiag(0, 8, tok, 4);
    var diag2 = checkDiag(2, 6, tok, 2);
    if (col1 || col2 || col3 || row1 || row2 || row3 || diag1 || diag2) {
        return true;
    }
    else {
        return false;
    }
}
function checkDiag(i, j, tok, interval) {
    var count = 0;
    for (; i <= j; i = i + interval) {
        if (cellArr[i].textContent == tok) {
            count++;
        }
    }
    if (count == 3) {
        return true;
    }
    else {
        return false;
    }
}
function checkCol(i, j, tok) {
    var count = 0;
    for (; i <= j; i = i + 3) {
        if (cellArr[i].textContent == tok) {
            count++;
        }
    }
    if (count == 3) {
        return true;
    }
    else {
        return false;
    }
}
function checkRow(i, j, tok) {
    var count = 0;
    for (; i <= j; i++) {
        if (cellArr[i].textContent == tok) {
            count++;
        }
    }
    if (count == 3) {
        return true;
    }
    else {
        return false;
    }
}
function filledField() {
    var count = 0;
    for (var i = 0; i < 9; i++) {
        if (cellArr[i].textContent == "X" || cellArr[i].textContent == "O") {
            count++;
        }
    }
    console.log("count of set token= " + count);
    if (count == 9) {
        return true;
    }
}
