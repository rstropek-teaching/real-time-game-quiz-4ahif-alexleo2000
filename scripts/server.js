"use strict";
exports.__esModule = true;
var express = require("express");
var http = require("http");
var sio = require("socket.io");
var parse = require("csv-parse");
var fs = require("fs");
var checkReset = [false, false];
var highscore = /** @class */ (function () {
    function highscore() {
    }
    highscore.prototype.setName = function (n) {
        this.name = n;
    };
    highscore.prototype.setScore = function (s) {
        this.score = s;
    };
    return highscore;
}());
var highscoreList = /** @class */ (function () {
    function highscoreList() {
        this.list = [];
    }
    highscoreList.prototype.get = function () {
        return this.list;
    };
    highscoreList.prototype.length = function () {
        return this.list.length;
    };
    highscoreList.prototype.set = function (player) {
        this.list.push(player);
    };
    return highscoreList;
}());
var app = express();
app.use(express.static('public')); /*
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});*/
var server = http.createServer(app);
var io = sio(server);
io.on('connection', function (socket) {
    var usernumber = 0;
    if (usernumber < 2) {
        if (usernumber == 0) {
            socket.emit('start stop', true);
        }
        socket.emit('connection check', true);
        usernumber++;
        socket.emit('player', usernumber);
        console.log('a user connected, number of users: ' + usernumber);
    }
    else {
        socket.emit('connection check', false);
    }
    var hl = new highscoreList;
    var scores = [];
    var url = 'C:/!Documents/score.csv';
    /*scores = loadHighscores(scores, url);
    console.log("herausn:"+scores+"test");*/
    socket.emit('set highscore', hl);
    //saveHighscores(hl, url);
    socket.on('token set', function (index) {
        socket.broadcast.emit('cellArr', index);
        socket.broadcast.emit('start stop', true); //an den anderen User wird mitgeteilt das er an der Reihe ist
        socket.emit('start stop', false); //dem User der gerade platziert hat wird mitgeteilt das er warten muss
    });
    socket.on('game over', function () {
        io.sockets.emit('game over');
    });
    socket.on('want to reset', function (playerNumber) {
        checkReset[playerNumber] = true;
        if (checkReset[0] == true && checkReset[1] == true) {
            io.sockets.emit('want to reset', 2);
            io.sockets.emit('reset');
            checkReset[0] = false;
            checkReset[1] = false;
            io.sockets.emit('want to reset', 0);
        }
        else {
            io.sockets.emit('want to reset', 1);
        }
    });
    /*Der Name wird gesendet und es wird ein Broadcast an alle
      anderen gesendet um mitzuteilen welcher User beigetreten ist.*/
    socket.on('name', function (username) {
        console.log(username + ' connected');
        socket.broadcast.emit('user joined', username);
    });
    //A user disconnects, usernumber gets reduced
    socket.on('disconnect', function () {
        usernumber--;
        socket.emit('player', usernumber);
        console.log('a user disconnected, number of users: ' + usernumber);
    });
});
server.listen(3000, function () {
    console.log('listening on *:3000');
});
function loadHighscores(scores, link) {
    var url = link;
    var hl = new highscoreList;
    var arr = hl.get();
    var player = new highscore;
    var test = new highscoreList;
    var parser;
    parser = parse({ delimiter: ';' }, function (err, data) {
        for (var i = 0; i < 3; i++) {
            player = new highscore;
            player.setName(data[i][0]);
            player.setScore(data[i][1]);
            hl.set(player);
            scores.push(player);
            test = hl;
        }
        console.log(scores);
    });
    test = fs.createReadStream(url).pipe(parser);
    console.log(scores);
    return scores;
}
function saveHighscores(hl, link) {
    console.log("Save Highscores:");
    var url = link;
    var scores = hl.list;
    console.log(hl.length);
    for (var i = 0; i < scores.length; i++) {
        if (i = 0) {
            scores[i].name = "jungfrau";
            console.log("test");
        }
        fs.writeFile(url, scores[i].name + ";" + scores[i].score + "\n", function (err) {
            if (err) {
                return console.error(err);
            }
        });
        console.log(scores[i].name + ";" + scores[i].score + "\n");
    }
}
