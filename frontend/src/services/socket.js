import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

class SocketService {
    constructor() {
        this.socket = null;
    }

    connect() {
        this.socket = io(SOCKET_URL);
        this.socket.on('connect', () => {
            console.log('Connected to socket server:', this.socket.id);
        });
        this.socket.on('disconnect', () => {
            console.log('Disconnected from socket server');
        });
        return this.socket;
    }
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            console.log('Disconnected from socket server');
        }
    }
    on(event, callback) {
        if (this.socket) {
            this.socket.on(event, callback);
        }
    }
    off(event, callback) {
        if (this.socket) {
            this.socket.off(event, callback);
        }
    }
}

export default new SocketService();