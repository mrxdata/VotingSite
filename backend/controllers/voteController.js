const { Pool } = require('pg');
const pool = require('../db/db');

const submitVote = async (req, res) => {
    const { event_id, selectedOption, captcha_token, operating_system, browser, screen_resolution, device_type, time_spent, browser_language } = req.body;
    const voter_ip = req.ip;
    const voteTimestamp = new Date().toISOString();

    const timeSpentInt = parseInt(time_spent, 10) || 0;

    try {
        const checkVoteQuery = 'SELECT * FROM votes WHERE event_id = $1 AND voter_ip = $2';
        const checkVoteResult = await pool.query(checkVoteQuery, [event_id, voter_ip]);

        if (checkVoteResult.rows.length > 0) {
            return res.status(400).json({ error: 'Вы уже проголосовали для этого события' });
        }

        const checkVoterQuery = 'SELECT * FROM voters WHERE ip_address = $1';
        const checkVoterResult = await pool.query(checkVoterQuery, [voter_ip]);

        if (checkVoterResult.rows.length === 0) {
            const insertVoterQuery = `
                INSERT INTO voters (ip_address, captcha_token, operating_system, browser, screen_resolution, device_type, time_spent, browser_language)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            `;
            await pool.query(insertVoterQuery, [
                voter_ip,
                captcha_token || '',
                operating_system || '',
                browser || '',
                screen_resolution || '',
                device_type || '',
                timeSpentInt,
                browser_language || ''
            ]);
        }

        const insertVoteQuery = `
            INSERT INTO votes (selected_element, event_id, voter_ip, vote_timestamp)
            VALUES ($1, $2, $3, $4)
            RETURNING vote_id
        `;
        const result = await pool.query(insertVoteQuery, [selectedOption, event_id, voter_ip, voteTimestamp]);

        return res.status(201).json({ message: 'Ваш голос принят', voteId: result.rows[0].vote_id });
    } catch (error) {
        console.error('Ошибка при голосовании:', error);
        return res.status(500).json({ error: 'Произошла ошибка при голосовании' });
    }
};


module.exports = { submitVote };
