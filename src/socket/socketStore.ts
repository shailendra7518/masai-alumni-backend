import { Server, Socket } from "socket.io";

let io = null;
let userSocket = null;

const setSocketServerInstance = (ioInstance: Server): void => {
  io = ioInstance;
};
const getSocketServerInstance = (): { io: Server | null, socket: Socket | null } => {
  return { io, socket: userSocket };
};

const setUserSocket = (socket: Socket): void => {
  userSocket = socket
};


export {
  setSocketServerInstance,
  getSocketServerInstance,
  setUserSocket
}
