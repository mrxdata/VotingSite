const pool = require('./db');

const createTables = async () => {
    try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS Organizers (
          ID SERIAL PRIMARY KEY,
          Login VARCHAR(255) NOT NULL,
          Password VARCHAR(255) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS Voters (
          IP_Address VARCHAR(45) PRIMARY KEY,
          Captcha_Token VARCHAR(255) NOT NULL,
          Operating_System VARCHAR(255),
          Browser VARCHAR(255),
          Screen_Resolution VARCHAR(50),
          Device_Type VARCHAR(50),
          Time_Spent INT,
          Browser_Language VARCHAR(10)
      );

      CREATE TABLE IF NOT EXISTS Events (
          Event_ID SERIAL PRIMARY KEY,
          Name VARCHAR(255) NOT NULL,
          Start_DateTime TIMESTAMP NOT NULL,
          End_DateTime TIMESTAMP NOT NULL,
          Organizer_ID INT NOT NULL,
          Options TEXT,
          FOREIGN KEY (Organizer_ID) REFERENCES Organizers(ID)
      );

      CREATE TABLE IF NOT EXISTS Votes (
          Vote_ID SERIAL PRIMARY KEY,
          Selected_Element INT NOT NULL,
          Event_ID INT NOT NULL,
          Voter_IP VARCHAR(45) NOT NULL,
          Vote_Timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (Event_ID) REFERENCES Events(Event_ID),
          FOREIGN KEY (Voter_IP) REFERENCES Voters(IP_Address)
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