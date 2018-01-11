declare const io: SocketIOStatic;
//String für den Header im Game-DIV

const ttt: string = "TicTacToe";
const tokenArr: string[] = ['X', 'O'];
let playerNumber: number; //0 = X, 1 = O
let setToken: boolean = true;
let gameWon: boolean = false;
let gameLost: boolean = false;

/*Variablen für Zelle 1 bis 9 werden erstellt und den Zellen der Seite zugewiesen. 
    Danach werden noch EventListener erstellt um beim klicken ein X zu setzen.*/
let cellArr: HTMLElement[] = [
    <HTMLElement>document.getElementById("cell1"),
    <HTMLElement>document.getElementById("cell2"),
    <HTMLElement>document.getElementById("cell3"),
    <HTMLElement>document.getElementById("cell4"),
    <HTMLElement>document.getElementById("cell5"),
    <HTMLElement>document.getElementById("cell6"),
    <HTMLElement>document.getElementById("cell7"),
    <HTMLElement>document.getElementById("cell8"),
    <HTMLElement>document.getElementById("cell9")];


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
        const socket = io();
        socket.on('connection check', function (check: boolean) {
            if (check == true) {
                const username = $("#input").val();
                $("#ttt").text(ttt + "-" + username);
                $("#login").hide();
                $("#game").fadeIn(1000);

                socket.emit('name', username);

                socket.emit('get highscores');

                socket.on('reset', function () {
                    resetField();
                });

                socket.on('want to reset', function (number: number) {
                    $("#numberOfResets").text(number + "/2");
                });

                socket.on('player', function (player: number) {
                    playerNumber = player - 1;
                    if(playerNumber == 0){
                        $("#circle").css("background-color", "green");
                    }
                });

                socket.on('user joined', function (nameOfOtherUser: string) {
                    alert(nameOfOtherUser + " joined the game");
                });

                socket.on('cellArr', function (index: number) {
                    switch (playerNumber) {
                        case 0: cellArr[index].textContent = tokenArr[1]; break;
                        case 1: cellArr[index].textContent = tokenArr[0]; break;
                    }
                });

                socket.on('start stop', function (bool: boolean) {
                    setToken = bool;
                    if (setToken) {
                        $("#circle").css("background-color", "green");
                    } else {
                        $("#circle").css("background-color", "red");
                    }
                });

                socket.on('game over', function () {
                    if (gameWon) {
                        $("#lostwon").text("You've won the game, you're now the master of ttt!");                        
                        $("#lostwon").fadeIn(1000);
                    } else {
                        gameLost = true;
                        $("#lostwon").text("You've lost the game, try better next time!");                        
                        $("#lostwon").fadeIn(1000);
                    }
                });

                for (let i: number = 0; i < 9; i++) {
                    cellArr[i].addEventListener('click', function () {
                        if (!gameWon && !gameLost) {
                            if (setToken == true && !ifTokenSet(i)) {
                                cellArr[i].textContent = tokenArr[playerNumber];
                                socket.emit('token set', i);
                            }
                            if (ifGameWon(tokenArr[playerNumber])) {
                                gameWon = true;
                                socket.emit('game over');
                                appendHighscore();
                            }
                        }
                    });
                }

                $("#reset").click(function () {
                    socket.emit('want to reset', playerNumber);
                });
            } else {
                alert("There are already two players!");
            }
        });
    });
});

function resetField() {
    for (let i: number = 0; i < 9; i++) {
        cellArr[i].textContent = null;
    }
    gameWon = false;
    gameLost = false;
    $("#lostwon").fadeOut();
}

function appendHighscore(){
    
    var $username = $('<span class="username"/>').text("jungfrau");
    var $wins = $('<span class="messageBody">').text(10);

    var $highscore =  $('<li class="highscore"/>').append($username, $wins);

    $("#highlist").append($highscore);
}

function ifTokenSet(index: number) {
    if (cellArr[index].textContent == "X" || cellArr[index].textContent == "O") {
        return true;
    }
}

function ifGameWon(tok: string) {
    let row1: boolean = checkRow(0, 2, tok);
    let row2: boolean = checkRow(3, 5, tok);
    let row3: boolean = checkRow(6, 8, tok);

    let col1: boolean = checkCol(0, 6, tok);
    let col2: boolean = checkCol(1, 7, tok);
    let col3: boolean = checkCol(2, 8, tok);

    let diag1: boolean = checkDiag(0, 8, tok, 4);
    let diag2: boolean = checkDiag(2, 6, tok, 2);

    if (col1 || col2 || col3 || row1 || row2 || row3 || diag1 || diag2) {
        return true;
    } else {
        return false;
    }
}

function checkDiag(i: number, j: number, tok: string, interval: number) {
    let count: number = 0;

    for (; i <= j; i = i + interval) {
        if (cellArr[i].textContent == tok) {
            count++;
        }
    }
    if (count == 3) {
        return true;
    } else {
        return false;
    }
}

function checkCol(i: number, j: number, tok: string) {
    let count: number = 0;
    for (; i <= j; i = i + 3) {
        if (cellArr[i].textContent == tok) {
            count++;
        }
    }

    if (count == 3) {
        return true;
    } else {
        return false;
    }
}

function checkRow(i: number, j: number, tok: string) { //i = Reihenanfang, j = Reihenende, tok = X || O
    let count: number = 0;
    for (; i <= j; i++) {
        if (cellArr[i].textContent == tok) {
            count++;
        }

    }
    if (count == 3) {
        return true;
    } else {
        return false;
    }
}

function filledField() {
    let count: number = 0;
    for (let i: number = 0; i < 9; i++) {
        if (cellArr[i].textContent == "X" || cellArr[i].textContent == "O") {
            count++;
        }
    }
    console.log("count of set token= " + count);

    if (count == 9) {
        return true;
    }
}