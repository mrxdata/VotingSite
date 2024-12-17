const pool = require('./db');

const clearAllVoters = async () => {
    const query = 'DELETE FROM voters'; // Удаляем все записи из таблицы voters
    try {
        await pool.query(query);
        console.log('Все записи из таблицы voters удалены');
    } catch (error) {
        console.error('Ошибка при удалении записей из таблицы voters:', error);
    }
};

// Функция для удаления всех голосов из таблицы votes
const clearAllVotes = async () => {
    const query = 'DELETE FROM votes'; // Удаляем все записи из таблицы votes
    try {
        await pool.query(query);
        console.log('Все записи из таблицы votes удалены');
    } catch (error) {
        console.error('Ошибка при удалении записей из таблицы votes:', error);
    }
};

// Вызов функций очистки
const cleanDatabase = async () => {
    await clearAllVotes();
    await clearAllVoters();
};

// Запуск очистки
cleanDatabase().catch((error) => {
    console.error('Ошибка при очистке базы данных:', error);
});
