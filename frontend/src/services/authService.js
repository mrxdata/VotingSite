import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

const register = async (login, password) => {
    try {
        const response = await axios.post(`${API_URL}/register`, { login, password });
        return response.data;
    } catch (error) {
        throw new Error('Ошибка при регистрации: ' + error.response.data.message);
    }
};

const login = async (login, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { login, password });
        return response.data; // Возвращаем токен, который нужно будет использовать для дальнейших запросов
    } catch (error) {
        throw new Error('Ошибка при авторизации: ' + error.response.data.message);
    }
};

export const authService = {
    register,
    login
};

