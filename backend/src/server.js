const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const employeeRoutes = require('./routes/employeeRoutes');
const statusHistoryRoutes = require('./routes/statusHistoryRoutes');
const noteRoutes = require('./routes/noteRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE']
    }
});

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use('/api/employees', employeeRoutes);
app.use('/api/history', statusHistoryRoutes);
app.use('/api/notes', noteRoutes);

app.get('/api/employees', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running'});
});

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});