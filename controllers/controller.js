const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('rezerwator.db', err => {
    if (err) {
        console.error('Błąd połączenia z bazą danych:', err.message);
    } else {
        db.run(`
      CREATE TABLE IF NOT EXISTS przedmioty (
        przedmiot_id INTEGER PRIMARY KEY ASC AUTOINCREMENT,
        nazwa        TEXT,
        opis         TEXT,
        miejsce      TEXT
      )
    `);

        db.run(`
      CREATE TABLE IF NOT EXISTS rezerwacje (
        rezerwacja_id INTEGER PRIMARY KEY ASC AUTOINCREMENT,
        imie          TEXT,
        nazwisko      TEXT,
        przedmiot_id  INTEGER REFERENCES przedmioty (przedmiot_id),
        start         TEXT,
        stop          TEXT
      )
    `);

        db.get('SELECT COUNT(*) AS count FROM przedmioty', (err, row) => {
            if (err) {
                console.error('Błąd sprawdzania liczby rekordów:', err);
            } else if (row.count === 0) {
                db.run('INSERT INTO przedmioty (nazwa, opis, miejsce) VALUES (?, ?, ?)',
                    ['Rzutnik', 'Rzutnik do prezentacji', 'A-0-07']);
                db.run('INSERT INTO przedmioty (nazwa, opis, miejsce) VALUES (?, ?, ?)',
                    ['Stół do pingponga', 'Stół dla studentów i nie tylko', 'Korytarz sektor G-1']);
            } else {
                db.run('DELETE FROM przedmioty', (err) => {
                    if (err) {
                        console.error('Błąd usuwania danych:', err);
                    } else {
                        console.log('Usunięto istniejące dane z tabeli przedmioty');

                        // Dodanie nowych danych
                        db.run('INSERT INTO przedmioty (nazwa, opis, miejsce) VALUES (?, ?, ?)',
                            ['Stół do pingponga', 'Stół dla studentów i nie tylko', 'Korytarz sektor G-0']);
                        db.run('INSERT INTO przedmioty (nazwa, opis, miejsce) VALUES (?, ?, ?)',
                            ['Stół do pingponga', 'Stół dla studentów i nie tylko', 'Korytarz sektor F-0']);

                        db.run('INSERT INTO przedmioty (nazwa, opis, miejsce) VALUES (?, ?, ?)',
                            ['Stół do pingponga', 'Stół dla studentów i nie tylko', 'Korytarz sektor G-1']);
                        db.run('INSERT INTO przedmioty (nazwa, opis, miejsce) VALUES (?, ?, ?)',
                            ['Stół do pingponga', 'Stół dla studentów i nie tylko', 'Korytarz sektor F-1']);

                        db.run('INSERT INTO przedmioty (nazwa, opis, miejsce) VALUES (?, ?, ?)',
                            ['Stół do pingponga', 'Stół dla studentów i nie tylko', 'Korytarz sektor G-2']);
                        db.run('INSERT INTO przedmioty (nazwa, opis, miejsce) VALUES (?, ?, ?)',
                            ['Stół do pingponga', 'Stół dla studentów i nie tylko', 'Korytarz sektor F-2']);

                        db.run('INSERT INTO przedmioty (nazwa, opis, miejsce) VALUES (?, ?, ?)',
                            ['Rzutnik', 'Rzutnik do prezentacji', 'A-0-05']);
                        db.run('INSERT INTO przedmioty (nazwa, opis, miejsce) VALUES (?, ?, ?)',
                            ['Rzutnik', 'Rzutnik do prezentacji', 'A-0-10']);
                        db.run('INSERT INTO przedmioty (nazwa, opis, miejsce) VALUES (?, ?, ?)',
                            ['Rzutnik', 'Rzutnik do prezentacji', 'A-0-06']);
                        db.run('INSERT INTO przedmioty (nazwa, opis, miejsce) VALUES (?, ?, ?)',
                            ['Rzutnik', 'Rzutnik do prezentacji', 'A-0-07']);

                        db.run('INSERT INTO przedmioty (nazwa, opis, miejsce) VALUES (?, ?, ?)',
                            ['Rzutnik', 'Rzutnik do prezentacji', 'A-1-05']);
                        db.run('INSERT INTO przedmioty (nazwa, opis, miejsce) VALUES (?, ?, ?)',
                            ['Rzutnik', 'Rzutnik do prezentacji', 'A-1-10']);
                        db.run('INSERT INTO przedmioty (nazwa, opis, miejsce) VALUES (?, ?, ?)',
                            ['Rzutnik', 'Rzutnik do prezentacji', 'A-1-06']);
                        db.run('INSERT INTO przedmioty (nazwa, opis, miejsce) VALUES (?, ?, ?)',
                            ['Rzutnik', 'Rzutnik do prezentacji', 'A-1-07']);

                        db.run('INSERT INTO przedmioty (nazwa, opis, miejsce) VALUES (?, ?, ?)',
                            ['Rzutnik', 'Rzutnik do prezentacji', 'A-2-05']);
                        db.run('INSERT INTO przedmioty (nazwa, opis, miejsce) VALUES (?, ?, ?)',
                            ['Rzutnik', 'Rzutnik do prezentacji', 'A-2-10']);
                        db.run('INSERT INTO przedmioty (nazwa, opis, miejsce) VALUES (?, ?, ?)',
                            ['Rzutnik', 'Rzutnik do prezentacji', 'A-2-06']);
                        db.run('INSERT INTO przedmioty (nazwa, opis, miejsce) VALUES (?, ?, ?)',
                            ['Rzutnik', 'Rzutnik do prezentacji', 'A-2-07']);

                    }
                });
            }
        });
    }
});

const getAllItems = callback => {
    db.all('SELECT * FROM przedmioty ORDER BY nazwa, miejsce', (err, rows) => {
        if (err) {
            console.error('Błąd pobierania przedmiotów:', err);
            return callback(err, null);
        }
        callback(null, rows);
    });
};

const getPrzedmiot = (przedmiotId, callback) => {
    const sql = 'SELECT * FROM przedmioty WHERE przedmiot_id = ?';
    db.get(sql, [przedmiotId], (err, row) => {
        if (err) {
            return callback(err, null);
        }
        if (!row) {
            return callback(new Error('Przedmiot nie został znaleziony'), null);
        }
        callback(null, row);
    });
};

module.exports = { db, getAllItems, getPrzedmiot };
