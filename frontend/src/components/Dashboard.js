import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Modal from './Modal';
import { jwtDecode } from 'jwt-decode';
import styles from "./Dashboard.module.css";

const Dashboard = () => {
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const getOrganizerId = () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            return null;
        }

        const decodedToken = jwtDecode(token);
        return decodedToken.id;
    };

    const fetchEvents = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/events/events', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            });

            const organizer_id = getOrganizerId();
            const filteredEvents = response.data.filter(event => event.organizer_id === organizer_id);

            setEvents(filteredEvents);
        } catch (error) {
            console.error('Ошибка при получении мероприятий:', error);
        }
    };

    useEffect(() => {
        (async () => {
            await fetchEvents();
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
                navigate('/');
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
                <h1 style={{ textAlign: "center" }}>Список мероприятий</h1>
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
