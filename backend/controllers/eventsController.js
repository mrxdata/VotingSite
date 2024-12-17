const pool = require('../db/db');
const cron = require('node-cron');

const closeExpiredEvents = async () => {
    try {
        const currentDate = new Date();

        const events = await pool.query('SELECT * FROM events WHERE end_datetime < $1 AND results IS NULL', [currentDate]);

        for (let event of events.rows) {
            const results = await countVotes(event.event_id);

            // Обновляем данные о результатах в базе
            await pool.query('UPDATE events SET results = $1 WHERE event_id = $2', [JSON.stringify(results), event.event_id]);
        }
    } catch (err) {
        console.error('Ошибка при закрытии голосований:', err.message);
    }
};

// Подсчёт голосов
const countVotes = async (eventId) => {
    try {
        // Получаем все голоса для данного мероприятия
        const votes = await pool.query('SELECT * FROM votes WHERE event_id = $1', [eventId]);
        const totalVotes = votes.rows.length;

        const options = await pool.query('SELECT options FROM events WHERE event_id = $1', [eventId]);

        const results = options.rows.map(option => {
            const count = votes.rows.filter(vote => vote.option_id === option.option_id).length;
            return {
                option: option.option_name,
                count: count,
                percentage: totalVotes ? (count / totalVotes) * 100 : 0
            };
        });

        return results;
    } catch (err) {
        console.error('Ошибка при подсчете голосов:', err.message);
        return [];
    }
};

cron.schedule('*/1 * * * *', closeExpiredEvents);

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
        const eventLink = `${process.env.HOST}/events/${event.event_id}`;

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

// Новый эндпоинт для получения результатов голосования
exports.getVotingResults = async (req, res) => {
    const { event_id } = req.params;

    try {
        const event = await pool.query('SELECT * FROM events WHERE event_id = $1', [event_id]);
        if (event.rows.length === 0) {
            return res.status(404).json({ message: 'Мероприятие не найдено' });
        }

        // Проверяем, были ли уже подсчитаны результаты
        if (!event.rows[0].results) {
            return res.status(400).json({ message: 'Голосование еще не завершено или результаты не подсчитаны' });
        }

        // Отправляем результаты
        res.status(200).json({ results: event.rows[0].results });
    } catch (err) {
        res.status(500).json({ message: 'Ошибка при получении результатов голосования', error: err.message });
    }
};

// Получить мероприятие по ID
exports.getEventById = async (req, res) => {
    const { event_id } = req.params;
    try {
        const event = await pool.query('SELECT * FROM events WHERE event_id = $1', [event_id]);
        if (event.rows.length === 0) {
            return res.status(404).json({ message: 'Мероприятие не найдено' });
        }
        res.status(200).json(event.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Ошибка получения мероприятия', error: err.message });
    }
};
