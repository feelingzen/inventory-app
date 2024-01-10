const express = require('express');
const router = express.Router();

router.use(express.urlencoded({ extended: false }));
router.use(express.json());

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/inventory');
});



module.exports = router;
