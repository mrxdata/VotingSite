const pool = require('./db');

const createTables = async () => {
    try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS organizers (
          id SERIAL PRIMARY KEY,
          login VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS voters (
          ip_address VARCHAR(45) PRIMARY KEY,
          captcha_token VARCHAR(255) NOT NULL,
          operating_system VARCHAR(255),
          browser VARCHAR(255),
          screen_resolution VARCHAR(50),
          device_type VARCHAR(50),
          time_spent INT,
          browser_language VARCHAR(10)
      );

      CREATE TABLE IF NOT EXISTS events (
          event_id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          start_datetime TIMESTAMP NOT NULL,
          end_datetime TIMESTAMP NOT NULL,
          organizer_id INT NOT NULL,
          options TEXT,
          results JSONB,
          FOREIGN KEY (organizer_id) REFERENCES organizers(id)
      );

      CREATE TABLE IF NOT EXISTS votes (
          vote_id SERIAL PRIMARY KEY,
          selected_element VARCHAR(50) NOT NULL,
          event_id INT NOT NULL,
          voter_ip VARCHAR(45) NOT NULL,
          vote_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (event_id) REFERENCES events(event_id),
          FOREIGN KEY (voter_ip) REFERENCES voters(ip_address)
      );
    `);

        console.log("Таблицы успешно созданы.");
    } catch (err) {
        console.error("Ошибка создания таблиц:", err.message);
    } finally {
        await pool.end();
    }
};

(async () => {
    await createTables();
})();