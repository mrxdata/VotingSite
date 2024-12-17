const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const eventsRoutes = require('./routes/events');
const authRoutes = require('./routes/auth');

dotenv.config();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/events', eventsRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Сервер работает на порту ${PORT}`);
});
