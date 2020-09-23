import express, {json} from 'express';
import {Server} from 'http';
import socketIo from 'socket.io';

const app = express();
const http = new Server(app);
const io = socketIo(http);

app.use(json());
app.use(express.static('wwwroot'));

app.get('/hello', (req, res) => {
  res.json({message: 'Hello World!'});
});

io.on('connection', socket => {
  console.log(`Usuario entrou: ${socket.id}`);

  const dt = new Date();
  const dtExt = `[${dt.getDay()}/${dt.getMonth()}/${dt.getFullYear()} ${dt.getHours()}:${dt.getMinutes()}:${dt.getSeconds()}]: `;

  socket.on('message', message => {
    console.log(message);

    socket.emit('message', dtExt + message);
  });
});

//app.listen(3000);
http.listen(3000);
