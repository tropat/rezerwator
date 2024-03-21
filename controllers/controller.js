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
        start         DATE,
        stop          DATE
      )
    `);

        db.get('SELECT COUNT(*) AS count FROM przedmioty', (err, row) => {
            if (err) {
                console.error('Błąd sprawdzania liczby rekordów:', err);
            } else if (row.count === 0) {
                db.run('INSERT INTO rezerwacje (imie, nazwisko, przedmiot_id, start, stop) VALUES (?, ?, ?, ?, ?)',
                    ['Jan', 'Kowalski', 1517, '2024-03-01', '2024-03-02']);
                db.run('INSERT INTO rezerwacje (imie, nazwisko, przedmiot_id, start, stop) VALUES (?, ?, ?, ?, ?)',
                    ['Jan', 'Kowalski', 1517, '2024-01-01', '2024-01-31']);


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
            } else {
                db.run('DELETE FROM rezerwacje', (err) => {
                    if (err) {
                        console.error('Błąd usuwania danych:', err);
                    } else {
                        console.log('Usunięto istniejące dane z tabeli rezerwacje');
                    }});
                db.run('INSERT INTO rezerwacje (imie, nazwisko, przedmiot_id, start, stop) VALUES (?, ?, ?, ?, ?)',
                    ['Jan', 'Kowalski', 1517, '2024-03-01', '2024-03-02']);
                db.run('INSERT INTO rezerwacje (imie, nazwisko, przedmiot_id, start, stop) VALUES (?, ?, ?, ?, ?)',
                    ['Jan', 'Kowalski', 1517, '2024-01-01', '2024-01-31']);
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
        return callback(null, row);
    });
};

const getRezerwacje = (przedmiotId, callback) => {
    const sql = 'SELECT * FROM rezerwacje WHERE przedmiot_id = ?';
    db.all(sql, [przedmiotId], (err, rows) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, rows);
    });
};

const checkRezerwacja = (przedmiotId, date, callback) => {
    const sql = 'SELECT * FROM rezerwacje WHERE przedmiot_id = ? AND DATE(start) <= DATE(?) AND DATE(stop) >= DATE(?)';
    db.all(sql, [przedmiotId, date, date], (err, rows) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, rows.length > 0);
    });
};

const addRezerwacja = (imie, nazwisko, przedmiotId, start, stop, callback) => {
    const sql = 'INSERT INTO rezerwacje (imie, nazwisko, przedmiot_id, start, stop) VALUES (?, ?, ?, ?, ?)';
    db.run(sql, [imie, nazwisko, przedmiotId, start, stop], function (err) {
        if (err) {
            return callback(err, null);
        }
        callback(null, this.lastID);
    });
};

module.exports = { db, getAllItems, getPrzedmiot, getRezerwacje, checkRezerwacja, addRezerwacja };
