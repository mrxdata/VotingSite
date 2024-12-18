const pool = require('./db');

const clearAllVoters = async () => {
    const query = 'DELETE FROM voters';
    try {
        await pool.query(query);
        console.log('Все записи из таблицы voters удалены');
    } catch (error) {
        console.error('Ошибка при удалении записей из таблицы voters:', error);
    }
};

const clearAllVotes = async () => {
    const query = 'DELETE FROM votes';
    try {
        await pool.query(query);
        console.log('Все записи из таблицы votes удалены');
    } catch (error) {
        console.error('Ошибка при удалении записей из таблицы votes:', error);
    }
};

const cleanDatabase = async () => {
    await clearAllVotes();
    await clearAllVoters();
};

cleanDatabase().catch((error) => {
    console.error('Ошибка при очистке базы данных:', error);
});
