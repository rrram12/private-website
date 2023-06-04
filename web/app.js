const WebSocket = require('ws')
var ws = new WebSocket('ws://127.0.0.1:3000');
// get connection status
console.log('ws connection status：' + ws.readyState);
//listen for connection success
ws.onopen = function () {
    console.log('ws connection status：' + ws.readyState);
    //A data is generated if the connection is successful
    ws.send('test1');
}
// Receive information from the server and process the presentation
ws.onmessage = function (data) {
    console.log('receive information from the server and process：');
    console.log(data);
    //Close the WebSocket after the communication is complete
    ws.close();
}
// listen for connection closure events
ws.onclose = function () {
    // listen for the websocket status throughout the process
    console.log('ws connection status：' + ws.readyState);
}
// lisetn for and handle error events
ws.onerror = function (error) {
    console.log(error);
}
