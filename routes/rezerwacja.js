var express = require('express');
const controller = require("../controllers/controller");
var router = express.Router();

router.get('/', (req, res) => {
    res.render('rezerwacja', { title: 'Rezerwator' });
});

router.get('/:rezerwacjaId', (req, res, next) => {
    const rezerwacjaId = parseInt(req.params.rezerwacjaId);

    controller.getRezerwacja(rezerwacjaId, (err, rezerwacja) => {
        if (err) {
            console.error('Błąd pobierania danych rezerwacji:', err.message);
            return next(err);
        }

        if (!rezerwacja) {
            return res.status(404).json({ error: 'Rezerwacja o podanym identyfikatorze nie została znaleziona' });
        }

        controller.getPrzedmiot(rezerwacja.przedmiot_id, (err, przedmiot) => {
            if (err) {
                console.error('Błąd pobierania danych przedmiotu:', err.message);
                return next(err);
            }

            if (!przedmiot) {
                return res.status(404).json({ error: 'Przedmiot nie został znaleziony' });
            }

            const responseData = {
                imie: rezerwacja.imie,
                nazwisko: rezerwacja.nazwisko,
                nazwa: przedmiot.nazwa,
                miejsce: przedmiot.miejsce,
                start: rezerwacja.start,
                stop: rezerwacja.stop
            };

            res.json(responseData);
        });
    });
});

router.delete('/:rezerwacjaId/anuluj', (req, res) => {
    const rezerwacjaId = parseInt(req.params.rezerwacjaId);

    controller.deleteRezerwacja(rezerwacjaId, (err, result) => {
        if (err) {
            console.error('Błąd podczas usuwania rezerwacji:', err.message);
            return res.status(500).json({ error: 'Wystąpił błąd podczas usuwania rezerwacji' });
        }

        res.json({ message: 'Rezerwacja została pomyślnie usunięta' });
    });
});

module.exports = router;
