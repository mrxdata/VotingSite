import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/events', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setEvents(response.data);
            } catch (err) {
                console.error('Ошибка при получении мероприятий', err);
            }
        };

        fetchEvents();
    }, []);

    return (
        <div>
            <h1>Панель управления</h1>
            <h2>Мероприятия</h2>
            <ul>
                {events.map((event) => (
                    <li key={event.event_id}>{event.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
