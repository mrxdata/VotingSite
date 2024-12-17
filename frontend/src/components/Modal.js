import React, { useState, useEffect } from 'react';
import styles from './Modal.module.css';

const Modal = ({ onClose, onCreate }) => {
    const [name, setName] = useState('');
    const [endDate, setEndDate] = useState('');
    const [endTime, setEndTime] = useState('');
    const [options, setOptions] = useState(['']);

    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().split('T')[0]; // yyyy-mm-dd

    // Формируем дату начала как текущую дату с временем (например, сейчас)
    const startDate = currentDate.toISOString(); // Форматируем как ISO строку для отправки

    // Обработчик изменения элемента голосования
    const handleOptionChange = (index, value) => {
        const updatedOptions = [...options];
        updatedOptions[index] = value;
        setOptions(updatedOptions);
    };

    // Обработчик добавления нового элемента голосования
    const handleAddOption = () => {
        setOptions([...options, '']);
    };

    // Обработчик удаления элемента голосования
    const handleRemoveOption = (index) => {
        const updatedOptions = options.filter((_, i) => i !== index);
        setOptions(updatedOptions);
    };

    // Обработчик отправки формы
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Проверка на пустые или дублирующиеся элементы голосования
        const uniqueOptions = [...new Set(options.filter(option => option.trim() !== ''))];

        // Собираем дату и время в один объект для startDate и endDate
        const endDateTime = new Date(`${endDate}T${endTime}`);
        const currentDateTime = new Date();

        if (endDateTime <= currentDateTime) {
            alert('Дата и время окончания должны быть в будущем.');
            return;
        }

        // Формируем данные для отправки в нужном формате
        const eventData = {
            name,
            startDate, // Используем автоматически созданную дату начала
            endDate: endDateTime.toISOString(), // Формируем правильную дату окончания
            options: uniqueOptions.join(';'), // Собираем строку с разделителем ;
            organizerId: 2, // Пример ID организатора
        };

        try {
            // Отправляем данные на сервер
            await onCreate(eventData);

            // Показать успешное сообщение
            alert('Мероприятие успешно создано!');
            onClose(); // Закрыть модальное окно
        } catch (error) {
            console.error('Ошибка при создании мероприятия:', error);
            alert('Ошибка при создании мероприятия.');
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>
                    ×
                </button>
                <h2 style={{ marginTop: "0" }}>Создать мероприятие</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Название:</label>
                        <input
                            className={styles.optionRowInput}
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Дата окончания:</label>
                        <input
                            className={styles.optionRowInput}
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Время окончания:</label>
                        <input
                            className={styles.optionRowInput}
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Элементы мероприятия:</label>
                        {options.map((option, index) => (
                            <div key={index} className={styles.optionRow}>
                                <input
                                    className={styles.optionRowInput}
                                    type="text"
                                    placeholder={`Элемент ${index + 1}`}
                                    value={option}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveOption(index)}
                                    className={styles.removeOptionButton}
                                >
                                    -
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={handleAddOption} className={styles.modalButton}>
                            Добавить элемент
                        </button>
                    </div>
                    <div>
                        <button type="submit" className={styles.modalButton}>Создать мероприятие</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Modal;
