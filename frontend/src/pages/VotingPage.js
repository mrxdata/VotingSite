import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";
import VotingOptions from "../components/VotingOptions";
import styles from './VotingPage.module.css'; // Импорт CSS модуля

const VotingPage = () => {
    const [eventData, setEventData] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [voteSubmitted, setVoteSubmitted] = useState(false);

    const { eventId } = useParams();

    const getCaptchaToken = () => {
        return Math.random().toString(36).substring(2, 15);
    };

    const getTimeSpent = () => {
        return Math.floor(Math.random() * (300 - 100 + 1)) + 100;
    };

    useEffect(() => {
        const savedVoteStatus = localStorage.getItem(`voteSubmitted-${eventId}`);
        if (savedVoteStatus === 'true') {
            setVoteSubmitted(true);

        }

        const fetchEventData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/events/${eventId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    },
                });
                setEventData(response.data);
            } catch (error) {
                console.error('Ошибка при загрузке данных мероприятия:', error);
            }
        };

        fetchEventData();
    }, [eventId]);

    const handleVote = async () => {
        if (selectedOption) {
            const captcha_token = getCaptchaToken();
            const operating_system = "Windows 11";
            const browser = "Chrome";
            const screen_resolution = "1920x1080";
            const device_type = "Desktop";
            const time_spent = getTimeSpent();
            const browser_language = "ru";

            try {
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/votes`, {
                    event_id: eventData.event_id,
                    selectedOption: selectedOption,
                    captcha_token: captcha_token,
                    operating_system: operating_system,
                    browser: browser,
                    screen_resolution: screen_resolution,
                    device_type: device_type,
                    time_spent: time_spent,
                    browser_language: browser_language,
                });

                console.log(response.data.message);
                setVoteSubmitted(true);

                // Сохраняем состояние голосования в localStorage, чтобы при перезагрузке не дать проголосовать снова
                localStorage.setItem(`voteSubmitted-${eventId}`, 'true');
            } catch (error) {
                console.error('Ошибка при голосовании:', error.response ? error.response.data.error : error);
            }
        }
    };

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

    if (!eventData) {
        return <div className={styles.loading}>Загружается...</div>;
    }

    const options = Array.isArray(eventData.options)
        ? eventData.options
        : (typeof eventData.options === 'string' ? eventData.options.split(';') : []);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{eventData.name}</h1>
            <p className={styles.date}>Дата начала: {formatDate(eventData.start_datetime)}</p>
            <p className={styles.date}>Дата окончания: {formatDate(eventData.end_datetime)}</p>

            <div className={styles.optionsContainer}>
                <h2>Варианты голосования:</h2>
                <VotingOptions
                    options={options}
                    selectedOption={selectedOption}
                    setSelectedOption={setSelectedOption}
                />
            </div>

            <button
                className={styles.voteButton}
                onClick={handleVote}
                disabled={voteSubmitted || !selectedOption}
            >
                {voteSubmitted ? "Голос отправлен" : "Проголосовать"}
            </button>
        </div>
    );
};

export default VotingPage;
