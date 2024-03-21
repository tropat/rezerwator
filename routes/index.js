var express = require('express');
const controller = require("../controllers/controller");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  controller.getAllItems((err, przedmioty) => {
    if (err) {
      console.error('Błąd pobierania przedmiotów:', err);
      return next(err);
    }
    res.render('index', { title: 'Rezerwator', przedmioty: przedmioty });
  });
});

router.get('/rezerwacje', (req, res) => {
  controller.db.all('SELECT * FROM rezerwacje', (err, rows) => {
    if (err) {
      console.error('Błąd pobierania rezerwacji:', err);
      return res.status(500).json({ error: 'Wystąpił błąd podczas pobierania rezerwacji' });
    }
    res.json(rows); // Zwróć wszystkie rekordy z tabeli rezerwacje
  });
});

module.exports = router;
