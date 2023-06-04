# Web_REPORT

Change the URL to https://alfonsogilbert-chickenpowder-8080.codio-box.uk/html/home.html in the URL Box and the web can be accessed.

## 1.Project Overview：

This project is a personal web page based on HTML,CSS and JAVASCRIPT. The first HOME is an overview of all the pages and a link to jump to each page. The second page, INTRO, contains some information about me. The third page has three sections detailing my professional interests and hobbies. The fourth page is an online chat room, showing the number of people chatting online, the user name and the time the message was sent. The fifth page shows my contact information and jump links to some other platforms. There is a navigation system at the top of each page to help users navigate between pages. Footnotes at the bottom of the page provide additional information.


## 2.Difficulties encountered and solutions:

(1)It is difficult to set up Chat room. I don't know how to display user input when user is editing information. Then I found websocket after looking up the relevant information and source code. Listening for input events, sending ws listens, and displaying callbacks solves this problem.

(2) When transferring my code from VSCODE to CODIO, I found that the page could not be displayed. Add a static server, set the port, connect to the server at box url, and start with npm start.


## 3.Design ideas and implementation process:

### WHOLE:

Web design consists of three major parts, namely HTML Hypertext Markup Language, CSS Cascading Style Sheets, and JavaScript Scripting Language. Among them, HTML mainly does the basic architecture of the entire web page, CSS is used to add various styles to the elements in the web page document and add color to the web page, while JavaScript is mainly to add dynamic effects and functions to the page of the web page, so as to achieve various effects of the web page.Page design reference:https://github.com/hANZR-16255/web_finalexam.

First of all, use HTML to write the basic framework of the web page, which roughly needs to use the section tag, navigation tag, <section><nav>, and footer tag of <footer>HTML5's new document structure tag , these tags will mainly construct the general frame structure of the web page, and also use some basic tags to improve the content design of the framework. For example, add paragraph tags, hyperlink tags, container tags, as well as image tags and list tags. For example:

```html
    <nav>
        <div class="navtitle"><strong>XINRAN HUANG</strong></div>
        <a href="home.html">HOME</a>
        <a href="about.html">INTRO</a>
        <a href="blog.html">ABOUT</a>
        <a href="album.html">TALK</a>
        <a href="join.html">CONTACT</a>
        <div class="navanim about"></div>
        <div class="none"></div>
    </nav>
    <footer class="foot">
			<p>@2023-2024 | BY:XINRAN HUANG</p>
			<p>The copyright of the web page belongs to the individual.</p>
			<p>WELCOME TO MY WORLD</p>
		</footer>
```

Next, use CSS styles to decorate the above tags, in which you need to use fit and element selectors to better control the styling of the element. At design time, the background is replaced with a picture, and the size property is set to cover the entire web page, and other parts of the web page also set some colors, but in order to be able to display their colors and the effect of the background image, so when setting the color, you need to set the color effect with the rgba() style that can set transparent. For example:

```html
.headimg{
    top: 0px;
    height: 250px;
    width: 100%;
    background-image: url("../image/head3.png");
    background-size: 1700px;
    background-repeat: no-repeat;
    background-position-y: -220px;
    background-position-x: -150px;
    overflow: hidden;
    border-bottom: 5px solid rgb(17, 18, 18);
    animation: headload 0.9s linear;
}
```

After the basic design of the style, then it is necessary to design some dynamic effects of the website, and at the same time, the chat program backend also needs to be written. This is where you need to use a JavaScript scripting language. See the CHAT section below for details.

### CHAT:

#### 1 express create a static resource web server

```javascript
//Import express
const express = require('express');
//Creating a web server
const app = express();
//Here call express.static() method，and quickly provide static resources externally.
app.use(express.static('public'));
```

```javascript
//Port number
var port = 8080;
app.listen(port, (req, res) => {
  console.log('express Server started successfully 127.0.0.1:' + port);
});
```

- The purpose of this code is to use the Express.static () middleware function to set up the static file directory in the express application created to quickly serve static resources from the server.

- Specifically, the express.static() method takes a parameter that represents the static file directory to set. The parameter here is "public", so all static resources (such as images, JavaScript files, CSS files, etc.) stored in the "public" directory under the application root can be accessed directly.

- Apply the express.static() middleware function to the entire application using the app.use() function. Later, when a client requests a static resource in the application, Express automatically finds that resource and sends it back to the client for response.

- The advantage of doing this is that you can quickly and easily provide static resources in your Web application without having to set up code such as routing and controllers specifically for these resources.

#### 2 Create a websocket service

```javascript
const ws = require('nodejs-websocket'); //Import ws library
```

##### 2.1 Encapsulate the required items

```javascript
//Encapsulates a function to send messages (send messages to each linked user)
const boardcast = (str) => {
  console.log(str);
  server.connections.forEach((connect) => {
    connect.sendText(str);
  });
};
//Encapsulates gets the nickname of all chatters
const getAllChatter = () => {
  let chartterArr = [];
  server.connections.forEach((connect) => {
    chartterArr.push({ name: connect.nickname });
  });
  return chartterArr;
};
```

##### 2.2 Listen for websocket events

- Listens for the "connection" event, which is triggered when the client connects to the server. In the "connection" event callback function, you can save the client connection object, send a welcome message to the client, and so on.
- Listens for the "message" event, which is fired when the client sends a message to the server. In the "message" event callback function, the message sent by the client can be processed and data returned to the client.
- Listen for the "close" event, which is triggered when the client connection is closed. In the "close" event callback function, you can clean up the resources or state associated with the client connection.

```javascript
const server = ws
  .createServer((connect) => {
    //When users connect it...
    connect.on('text', (str) => {
      let data = JSON.parse(str);
      if (data.type !== 'sending') {
        console.log(data);
      }
      switch (data.type) {
        case 'setName':
          connect.nickname = data.nickname;
          boardcast(
            JSON.stringify({
              type: 'serverInformation',
              message: data.nickname + 'enter the chat room',
            })
          );

          boardcast(
            JSON.stringify({
              type: 'chatterList',
              list: getAllChatter(),
            })
          );
          break;
        case 'chat':
          boardcast(
            JSON.stringify({
              type: 'chat',
              name: connect.nickname,
              message: data.message,
            })
          );
          break;
        case 'sending':
          boardcast(
            JSON.stringify({
              type: 'sending',
              name: connect.nickname,
            })
          );
          break;
        default:
          break;
      }
    });

    //When users close connection...
    connect.on('close', () => {
      //Leave the room
      boardcast(
        JSON.stringify({
          type: 'serverInformation',
          message: connect.nickname + 'Leave the chat room',
        })
      );

      //Remove from the number of people chatting online
      boardcast(
        JSON.stringify({
          type: 'chatterList',
          list: getAllChatter(),
        })
      );
    });

    //Error handling
    connect.on('error', (err) => {
      console.log(err);
    });
  })
  .listen(3000, () => {
    console.log('running');
  });
//Error handling
```

#### 3 Front-end websocket client

- Set the time of the chat box

```javascript
//Set the time of the chat box
Date.prototype.Format = function (fmt) {
  //author: xjj
  var o = {
    'M+': this.getMonth() + 1, //Month
    'd+': this.getDate(), //Day
    'h+': this.getHours(), //Hour
    'm+': this.getMinutes(), //Minute
    's+': this.getSeconds(), //Second
    'q+': Math.floor((this.getMonth() + 3) / 3), //Quarter
    S: this.getMilliseconds(), //Millisecond
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + '').substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      );
  return fmt;
};
```

- Create chatters, chat divs, and informant lists

```javascript
//Encapsulates the function that creates the Div and sends the message
const createChatDiv = (data) => {
  let div = document.createElement('div');
  let p_time = document.createElement('p');
  let p_content = document.createElement('p');
  switch (data.type) {
    case 'serverInformation':
      p_time.innerHTML = new Date().Format('yyyy-MM-dd hh:mm:ss');
      p_content.innerHTML = data.message;
      break;
    case 'chat':
      p_time.innerHTML = new Date().Format('yyyy-MM-dd hh:mm:ss');
      p_content.innerHTML = data.name + ':' + data.message;
      break;
    default:
      break;
  }

  p_time.setAttribute('class', 'time');
  p_content.setAttribute('class', 'content');

  div.appendChild(p_time);
  div.appendChild(p_content);

  return div;
};
```

- Encapsulate a function that sends the message

```javascript
//Encapsulate the function that sends the message
const send = () => {
  let message = document.getElementById('message');

  //Disable the ability to send empty messages
  if (!message.value) {
    return;
  }
  let data = {
    type: 'chat',
    message: message.value,
  };
  ws.send(JSON.stringify(data));
  message.value = '';
};
```

- Set the click event, and when the chat nickname is set to start connecting to the ws service, you can send a message

```javascript
setName.onclick = () => {
  let userName = document.getElementById('userName');
  let nickName = 'I have no name';
  if (userName.value) {
    nickName = userName.value;
  }

  //Establish a connection and send a connection into the room (and the connection is kept for polling by the server)
  // ws = new WebSocket('wss://alfonsogilbert-chickenpowder-3000.codio-box.uk');
  ws = new WebSocket('ws://127.0.0.1:3000');

  //When users connect it...
  ws.onopen = () => {
    let data = {
      type: 'setName',
      nickname: nickName,
    };
    ws.send(JSON.stringify(data));
  };

  //When users send messages...
  document.getElementById('sendMessage').onclick = () => {
    send();
  };

  //When accepting a request from a server...
  ws.onmessage = (e) => {
    let data = JSON.parse(e.data);
    if (data.type !== 'sending') {
      console.log(data);
    }

    //When the received message is the number of people connected...
    if (data.type === 'chatterList') {
      let list = data.list;
      let length = list.length;
      document.querySelector('#userList').innerHTML = '';
      let userList = document.getElementById('userList');
      document.getElementById('onLine').innerText = `The number of people online:${length}`;

      //Traverse the user that will be online, and display them on the page
      for (let i = 0; i < list.length; i++) {
        let p_user = document.createElement('p');
        p_user.setAttribute('class', 'userList-item');
        p_user.innerText = list[i].name;
        userList.appendChild(p_user);
      }
    } else {
      let oldContent = document.getElementById('content');
      oldContent.appendChild(createChatDiv(data));

      //The user clicks "Send" and cancels the state being typed
      for (
        var i = 0;
        i < document.querySelectorAll('#userList > p').length;
        i++
      ) {
        let x = document.querySelectorAll('#userList > p')[i].innerText;
        x = x.replace(' TYPING...', '');
        if (x === data.name) {
          document.querySelectorAll('#userList > p')[i].innerText = x;
        }
      }
    }

    //Set the name can not be changed, and can not change the name
    setName.setAttribute('disabled', true);
    let userName = document.getElementById('userName');
    userName.setAttribute('disabled', true);
    setName.style.display = 'none';

    //The listener clicks the input box and sends a status sending to the server
    var input = document.querySelector('#message');
    input.addEventListener('click', function (e) {
      var t = this.value;
      // console.log(t)AQs
      let data = {
        type: 'sending',
        nickname: userName.value,
      };
      ws.send(JSON.stringify(data));
    });

    //Determine which user is typing the chat message, and then set the current user to be typing in the user list
    if (data.type === 'sending') {
      // console.log(data)
      for (
        var i = 0;
        i < document.querySelectorAll('#userList > p').length;
        i++
      ) {
        if (
          document.querySelectorAll('#userList > p')[i].innerText === data.name
        ) {
          document.querySelectorAll('#userList > p')[i].innerText =
            document.querySelectorAll('#userList > p')[i].innerText +
            ' TYPING...';
        }
      }
    }
  };
};
```
## 4.Something that can be optimized

The chat room interface has too few elements. It could be richer. At the same time, the layout is not tight enough, the page color collocation can also be more harmonious.

## 5.Source of material
Images sources:https://blush.design/zh-CN/illustration/s/5GiRmTxGj
Icon sources:https://www.aigei.com/icon/class/commercial_including/
(All materials are either commercially available for free or have been licensed by the artist. This website is not used for profit.)
