import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from "./AuthForm.module.css";

const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Состояние авторизации
    const navigate = useNavigate(); // Хук для навигации

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = isLogin
                ? 'http://localhost:5000/api/auth/login'
                : 'http://localhost:5000/api/auth/register';

            const response = await axios.post(url, { login, password });

            if (response.status === 201 || response.status === 200) {
                alert(isLogin ? 'Авторизация успешна!' : 'Регистрация успешна!');
                localStorage.setItem('authToken', response.data.token);
                setIsAuthenticated(true);
                navigate('/dashboard'); // Перенаправляем на страницу /dashboard
            }
        } catch (error) {
            // Обрабатываем ошибки и показываем alert
            alert(error.response?.data?.message || 'Произошла ошибка при запросе.');
        }
    };

    return (
        <div className={ styles.container }>
            {isAuthenticated ? (
                <h2>Добро пожаловать на страницу Dashboard</h2>
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
                        <button className={styles.authButton} type="submit">{isLogin ? 'Войти' : 'Зарегистрироваться'}</button>
                    </form>
                    <button className={styles.switch} onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
                    </button>
                </>
            )}
        </div>
    );
};

export default AuthForm;
