const WebSocket = require('ws');

// Custom models
var Player = require('./models/Player.js');
var Vector3 = require('./models/Vector3.js');

// Variables
var players= [];
var sockets = [];

// Server stuff
const wss = new WebSocket.Server({port: 8080}, () => {
    console.log('server started');
});

wss.on('connection', (ws,req) => {

    const userIp = req.socket.remoteAddress;
    console.log("User: ", userIp , " connected");

    var player = new Player();
    var thisPlayerID = player.id;

    players[thisPlayerID] = player;
    sockets[thisPlayerID] = ws;

    console.log(player.toJson());

    ws.on('message', (data) => {
        console.log('Action recieved from user:',userIp, ",  " , data);

        // Send back data to client for debugging
        //ws.send(data);
        const d = JSON.parse(data);
        if(d.action === "jump")
        {
            console.log("Player:" , thisPlayerID , " jumped");
        }
        else if (d.action === "updatePosition")
        {
            player.position.x = d.position.x;
            player.position.y = d.position.y;
            player.position.z = d.position.z;
            var update_position_data =
                {
                    action:"updatePosition",
                    data:player.toJavaScriptObject()
                };
            broadcastAll(wss,ws,player.toJson());
        }



        // Broadcast to all other players
        // wss.clients.forEach(function each(client) {
        //     if(client !== ws && client.readyState === WebSocket.OPEN)
        //     {
        //         client.send(data);
        //     }
        // })
    });

    var spawn_data =
        {
            action:"spawn",
            data:player.toJavaScriptObject()
        };
    var register_data =
        {
            action:"register",
            data:player.toJavaScriptObject()
        };

    ws.send(JSON.stringify(spawn_data));
     ws.send(JSON.stringify(register_data));

    // Tell all other players that you are spawned
    broadcast(wss,ws,thisPlayerID);
    // wss.clients.forEach(function each(client) {
    //     if(client !== ws && client.readyState === WebSocket.OPEN)
    //     {
    //         client.send(thisPlayerID);
    //     }
    // });



    // Notify player that this is his id
    // ws.send('register', {id: thisPlayerID});
    // // Tell client to spawn player
    // ws.send('spawn', player);

    ws.on('close', function close() {
        console.log('disconnected');
        delete players[thisPlayerID];
        delete sockets[thisPlayerID];

        var disconnectData =
            {
            action:"disconnect",
            data:{id: thisPlayerID}
        };

        wss.clients.forEach(function each(client) {
            if(client !== ws && client.readyState === WebSocket.OPEN)
            {
                client.send(disconnectData);
            }
        });
    });
});

wss.on('close', function close() {
    console.log('disconnected');
});




wss.on('listening', () => {
    console.log("Server is listening on 8080");
});

function broadcast(wss,ws, data) {
    wss.clients.forEach(function each(client) {
        if(client !== ws && client.readyState === WebSocket.OPEN)
        {
            client.send(data);
        }
    })
}
function broadcastAll(wss,ws, data) {
    wss.clients.forEach(function each(client) {
        if(client.readyState === WebSocket.OPEN)
        {
            client.send(data);
        }
    })
}