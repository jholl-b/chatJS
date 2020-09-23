import express, {json} from 'express';
import {Server} from 'http';
import socketIo, {Socket} from 'socket.io';

interface User {
  id: string;
  name: string;
  socket: Socket;
}

const app = express();
const http = new Server(app);
const io = socketIo(http);

const usuarios: User[] = [];

app.use(json());
app.use(express.static('wwwroot'));

app.get('/hello', (req, res) => {
  res.json({message: 'Hello World!'});
});

io.on('connection', socket => {
  socket.on('entrar', (apelido, callback) => {
    if (!usuarios.some(x => x.name === apelido)) {
      usuarios.map(x => {
        if (x.id !== socket.id) {
          x.socket.emit('message', `${apelido} entrou na conversa.`);
        }
      });
      usuarios.push({id: socket.id, name: apelido, socket});

      callback(true);
    } else {
      callback(false);
    }
  });

  socket.on('message', ({msg, usu}) => {
    const dt = new Date();
    const dtExt = `${dt.getDay()}/${dt.getMonth()}/${dt.getFullYear()} ${dt.getHours()}:${dt.getMinutes()}:${dt.getSeconds()} `;

    usuarios.map(x => {
      x.socket.emit('message', `[${dtExt} - ${usu}] ${msg}`);
      //x.socket.disconnect();
    });

    //io.sockets.emit('message', `[${dtExt} - ${usu}] ${msg}`);
  });
});

//app.listen(3000);
http.listen(3000);
