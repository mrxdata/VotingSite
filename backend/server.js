const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const eventsRoutes = require('./routes/events');
const authRoutes = require('./routes/auth');
const voteRoutes = require('./routes/votes');
const path = require('path');
const eventsController = require('./controllers/eventsController');

dotenv.config();

app.use(cors());
app.use(bodyParser.json());


app.use('/api/events', eventsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', voteRoutes);

app.get('/events/:eventId', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Сервер работает на порту ${PORT}`);
});
