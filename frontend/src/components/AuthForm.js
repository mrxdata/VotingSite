import React, { useState } from 'react';
import axios from 'axios';
import Dashboard from './Dashboard'; // Импортируем панель управления

const AuthForm = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Состояние авторизации

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = isLogin
                ? 'http://localhost:5000/api/auth/login'
                : 'http://localhost:5000/api/auth/register';

            const response = await axios.post(url, { login, password });

            if (response.data.token) {
                onLogin(response.data.token);
                setIsAuthenticated(true);
                alert('Авторизация успешна!'); // Показываем alert при успехе
            } else {
                alert('Произошла ошибка при авторизации.');
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Произошла ошибка'); // Alert с текстом ошибки
        }
    };

    return (
        <div className="container">
            {isAuthenticated ? (
                <Dashboard /> // Показываем панель управления после авторизации
            ) : (
                <>
                    <h2>{isLogin ? 'Вход' : 'Регистрация'}</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Логин"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit">{isLogin ? 'Войти' : 'Зарегистрироваться'}</button>
                    </form>
                    <div className="message">{message}</div>
                    <button className="switch" onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
                    </button>
                </>
            )}
        </div>
    );
};

export default AuthForm;
