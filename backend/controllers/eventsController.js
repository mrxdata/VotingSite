const pool = require('../db/db');

exports.createEvent = async (req, res) => {
    const { name, startDate, endDate, options } = req.body;
    const organizerId = req.user?.id;

    if (!name || !startDate || !endDate || !options) {
        return res.status(400).json({ message: 'Все поля должны быть заполнены' });
    }

    try {
        const newEvent = await pool.query(
            'INSERT INTO events (name, start_datetime, end_datetime, organizer_id, options) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, startDate, endDate, organizerId, options]
        );

        const event = newEvent.rows[0];
        const eventLink = `/events/${event.event_id}`;

        res.status(201).json({ message: 'Мероприятие создано', event: event, eventLink });
    } catch (err) {
        res.status(500).json({ message: 'Ошибка создания мероприятия', error: err.message });
    }
};

exports.getAllEvents = async (req, res) => {
    try {
        const events = await pool.query('SELECT * FROM events');
        res.status(200).json(events.rows);
    } catch (err) {
        res.status(500).json({ message: 'Ошибка получения мероприятий', error: err.message });
    }
};

exports.getEventById = async (req, res) => {
    const { eventId } = req.params;

    try {
        const event = await pool.query('SELECT * FROM events WHERE event_id = $1', [eventId]);

        if (event.rows.length === 0) {
            return res.status(404).json({ message: 'Мероприятие не найдено' });
        }

        res.status(200).json(event.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Ошибка получения мероприятия', error: err.message });
    }
};
