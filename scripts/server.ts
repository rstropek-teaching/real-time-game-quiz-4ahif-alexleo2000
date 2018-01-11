import * as express from 'express';
import * as http from 'http';
import * as sio from 'socket.io';
import * as parse from 'csv-parse';
import fs = require('fs');
let usernumber: number = 0;
let checkReset: boolean[] = [false, false];
let url:string = 'C:/!Documents/score.csv';

class highscore {
    name: string;
    score: number;

    setName(n: string) {
        this.name = n;
    }

    setScore(s: number) {
        this.score = s;
    }
}

class highscoreList {
    list: highscore[] = [];


    get() {
        return this.list;
    }

    length(){
        return this.list.length;
    }
    
    set(player: highscore){
        this.list.push(player);
    }
}

const app = express();
app.use(express.static('public'));/*
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});*/

const server = http.createServer(app);
const io = sio(server);
io.on('connection', function (socket) {
    if (usernumber < 2) {
        if (usernumber == 0) {
            socket.emit('start stop', true);
        }
        socket.emit('connection check', true);

        usernumber++;
        socket.emit('player', usernumber);
        console.log('a user connected, number of users: ' + usernumber);
    } else {
        socket.emit('connection check', false);
    }
    let hl: highscoreList = new highscoreList;
    let scores: highscore [] = [];
    

    scores = loadHighscores(scores, url);
    console.log("herausn:"+scores+"test");
    
    
    socket.emit('set highscore', hl)
    //saveHighscores(hl, url);
    socket.on('token set', function (index) {
        socket.broadcast.emit('cellArr', index);
        socket.broadcast.emit('start stop', true);   //an den anderen User wird mitgeteilt das er an der Reihe ist
        socket.emit('start stop', false);              //dem User der gerade platziert hat wird mitgeteilt das er warten muss
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
        } else {
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

function loadHighscores(scores:highscore[], link:string) {
    let url: string = link;
    let hl: highscoreList = new highscoreList;
    let arr: highscore[] = hl.get();
    let player: highscore = new highscore;
    let test: highscoreList = new highscoreList;
    var parser;
    
    parser = parse({ delimiter: ';' }, function (err, data) {
        for (let i: number = 0; i < 3; i++) {
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

function saveHighscores(hl: highscoreList, link:string){
    console.log("Save Highscores:");
    let url: string = link;

    let scores: highscore [] = hl.list;
    console.log(hl.length);
    for(let i: number = 0; i < scores.length; i++){
        if(i = 0){
            scores[i].name="jungfrau";
            console.log("test");
        }
        fs.writeFile(url, scores[i].name+";"+scores[i].score+"\n",  function(err) {
            if (err) {
                return console.error(err);
            }
            
        });
        console.log(scores[i].name+";"+scores[i].score+"\n");
    }
    
}