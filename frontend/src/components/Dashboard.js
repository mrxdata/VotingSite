import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Импортируем useNavigate
import Modal from './Modal';
import { jwtDecode } from 'jwt-decode'; // Используем jwt_decode, а не jwtDecode
import styles from "./Dashboard.module.css";

const Dashboard = () => {
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate(); // Хук для навигации

    // Функция для получения ID организатора
    const getOrganizerId = () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            return null;
        }

        const decodedToken = jwtDecode(token); // Используем jwt_decode
        return decodedToken.id;
    };

    // Функция для получения мероприятий
    const fetchEvents = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/events/events', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Отправляем токен
                },
            });

            const organizer_id = getOrganizerId(); // Получаем текущего организатора
            const filteredEvents = response.data.filter(event => event.organizer_id === organizer_id); // Фильтруем события

            setEvents(filteredEvents); // Сохраняем отфильтрованные мероприятия
        } catch (error) {
            console.error('Ошибка при получении мероприятий:', error);
        }
    };

    useEffect(() => {
        // Загружаем мероприятия при монтировании компонента
        (async () => {
            await fetchEvents(); // Загружаем мероприятия
        })();
    }, []);

    const closeModal = () => setIsModalOpen(false);

    const handleCreateEvent = async (eventData) => {
        try {
            const response = await axios.post('http://localhost:5000/api/events/create-event', eventData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json',
                },
            });

            await fetchEvents();
            closeModal();
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert('Ваша сессия истекла. Пожалуйста, войдите снова.');
                localStorage.removeItem('authToken');
                navigate('/'); // Перенаправляем на страницу авторизации
            } else {
                console.error('Ошибка при создании мероприятия:', error.response ? error.response.data : error.message);
            }
        }
    };

    const openModal = () => setIsModalOpen(true);

    const formatDate = (dateString) => {
        if (!dateString) return 'Дата не указана';

        const date = new Date(dateString);

        if (isNaN(date.getTime())) {
            return 'Дата не указана';
        }

        return date.toLocaleString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.header}>
                <h1 style={{ textAlign: "center" }}>Активные мероприятия</h1>
                <button className={styles.createEventButton} onClick={openModal}>
                    Создать мероприятие
                </button>
            </div>

            <table className={styles.eventsTable}>
                <thead>
                <tr>
                    <th>ID мероприятия</th>
                    <th>Название</th>
                    <th>Дата окончания</th>
                </tr>
                </thead>
                <tbody>
                {events.map((event) => (
                    <tr key={event.event_id}>
                        <td>{event.event_id}</td>
                        <td>
                            <Link to={`/events/${event.event_id}`}>{event.name}</Link>
                        </td>
                        <td>{formatDate(event.end_datetime)}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            {isModalOpen && (
                <Modal onClose={closeModal} onCreate={handleCreateEvent} />
            )}
        </div>
    );
};

export default Dashboard;
