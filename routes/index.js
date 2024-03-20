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

module.exports = router;
