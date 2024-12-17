import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Для создания ссылки на мероприятие
import Modal from './Modal'; // Импортируем компонент модального окна
import styles from "./Dashboard.module.css";

const Dashboard = () => {
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для управления видимостью модального окна

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/events/events', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Отправляем токен
                    },
                });
                setEvents(response.data);
            } catch (error) {
                console.error('Ошибка при получении мероприятий:', error);
            }
        };

        fetchEvents();
    }, []);

    // Закрытие модального окна
    const closeModal = () => setIsModalOpen(false);

    // Функция для обработки создания мероприятия
    const handleCreateEvent = async (eventData) => {
        try {
            // Отправляем данные на сервер через axios
            const response = await axios.post('http://localhost:5000/api/events/create-event', eventData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json',
                },
            });

            // После успешного создания мероприятия обновляем список мероприятий
            setEvents([...events, response.data]);
            closeModal(); // Закрываем модалку
        } catch (error) {
            console.error('Ошибка при создании мероприятия:', error);
        }
    };

    const openModal = () => setIsModalOpen(true);

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.header}>
                <h1>Активные мероприятия</h1>
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
                    <tr key={event.id}>
                        <td>{event.id}</td>
                        <td>
                            <Link to={`/events/${event.id}`}>{event.title}</Link>
                        </td>
                        <td>{event.endDate}</td>
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
