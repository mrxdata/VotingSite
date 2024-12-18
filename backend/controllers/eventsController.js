const pool = require('../db/db');
const cron = require('node-cron');

const countVotes = async (eventId) => {
    try {
        const votes = await pool.query('SELECT selected_element FROM votes WHERE event_id = $1', [eventId]);
        const totalVotes = votes.rows.length;

        if (totalVotes === 0) {
            return [];
        }

        const voteCount = {};
        votes.rows.forEach(vote => {
            const selectedElement = vote.selected_element;
            if (voteCount[selectedElement]) {
                voteCount[selectedElement]++;
            } else {
                voteCount[selectedElement] = 1;
            }
        });

        const results = Object.keys(voteCount).map(option => {
            const count = voteCount[option];
            const percentage = totalVotes > 0 ? (count / totalVotes) * 100 : 0;
            return {
                option: option,
                count: count,
                percentage: percentage.toFixed(2) // округляем до 2 знаков
            };
        });

        return results;
    } catch (err) {
        console.error('Ошибка при подсчете голосов:', err.message);
        return [];
    }
};

const closeExpiredEvents = async () => {
    try {
        const currentDate = new Date();

        const events = await pool.query('SELECT * FROM events WHERE end_datetime < $1 AND results IS NULL', [currentDate]);

        for (let event of events.rows) {
            const results = await countVotes(event.event_id);

            await pool.query('UPDATE events SET results = $1 WHERE event_id = $2', [JSON.stringify(results), event.event_id]);
        }
    } catch (err) {
        console.error('Ошибка при закрытии голосований:', err.message);
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

exports.getVotingResults = async (req, res) => {
    const { event_id } = req.params;

    try {
        const event = await pool.query('SELECT * FROM events WHERE event_id = $1', [event_id]);
        if (event.rows.length === 0) {
            return res.status(404).json({ message: 'Мероприятие не найдено' });
        }

        if (!event.rows[0].results) {
            return res.status(400).json({ message: 'Голосование еще не завершено или результаты не подсчитаны' });
        }

        res.status(200).json({ results: event.rows[0].results });
    } catch (err) {
        res.status(500).json({ message: 'Ошибка при получении результатов голосования', error: err.message });
    }
};

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
