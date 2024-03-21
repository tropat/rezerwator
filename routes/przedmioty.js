var express = require('express');
const controller = require("../controllers/controller");
var router = express.Router();

router.get('/:id/month/:miesiac', (req, res) => {
  const { id, miesiac } = req.params;
  const przedmiotId = parseInt(id);
  const month = parseInt(miesiac);

  const sql = `SELECT * FROM rezerwacje WHERE przedmiot_id = ? AND strftime('%m', start) = ?`;
  controller.db.all(sql, [przedmiotId, month.toString().padStart(2, '0')], (err, rows) => {
    if (err) {
      console.error('Błąd pobierania danych:', err.message);
      return res.status(500).json({ error: 'Wystąpił błąd podczas pobierania danych' });
    }
    const reservationsForMonth = {};
    rows.forEach(row => {
      reservationsForMonth[row.start] = true;
    });
    res.json(reservationsForMonth);
  });
});

router.get('/:przedmiotId/:selectedDate', function(req, res, next) {
  const przedmiotId = req.params.przedmiotId;
  const selectedDate = req.params.selectedDate;
  controller.checkRezerwacja(przedmiotId, selectedDate, (err, isReserved) => {
    if (err) {
      console.error('Błąd sprawdzania rezerwacji:', err);
      return res.status(500).json({ error: 'Błąd sprawdzania rezerwacji' });
    }
    res.json({ isReserved });
  });
});
router.get('/:przedmiot_id', function(req, res, next) {
  const przedmiotId = req.params.przedmiot_id;
  controller.getPrzedmiot(przedmiotId, (err, przedmiot) => {
    if (err) {
      console.error('Błąd pobierania opisu przedmiotu:', err);
      return next(err);
    }
    res.render('przedmiot', { title: 'Rezerwator', pi: req.params.przedmiot_id, nazwa: przedmiot.nazwa, opis: przedmiot.opis, miejsce: przedmiot.miejsce });
  });
});

module.exports = router;
