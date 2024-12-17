const pool = require('../db/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { login, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Хешируем пароль

    try {
        const newUser = await pool.query(
            'INSERT INTO Organizers (Login, Password) VALUES ($1, $2) RETURNING *',
            [login, hashedPassword]
        );
        res.status(201).json({ message: 'Организатор зарегистрирован', user: newUser.rows[0] });
    } catch (err) {
        res.status(500).json({ message: 'Ошибка регистрации', error: err.message });
    }
};

exports.login = async (req, res) => {
    const { login, password } = req.body;

    try {
        const user = await pool.query('SELECT * FROM Organizers WHERE Login = $1', [login]);

        if (user.rows.length === 0) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        const isMatch = await bcrypt.compare(password, user.rows[0].password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Неверный пароль' });
        }

        const token = jwt.sign({ id: user.rows[0].id, login: user.rows[0].login }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Авторизация успешна', token });
    } catch (err) {
        res.status(500).json({ message: 'Ошибка авторизации', error: err.message });
    }
};
