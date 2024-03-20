var express = require('express');
const controller = require("../controllers/controller");
var router = express.Router();

router.get('/:przedmiot_id', function(req, res, next) {
  const przedmiotId = req.params.przedmiot_id;
  controller.getPrzedmiot(przedmiotId, (err, przedmiot) => {
    if (err) {
      console.error('Błąd pobierania opisu przedmiotu:', err);
      return next(err);
    }
    res.render('przedmiot', { title: 'Rezerwator', nazwa: przedmiot.nazwa, opis: przedmiot.opis, miejsce: przedmiot.miejsce });
  });
});

module.exports = router;
