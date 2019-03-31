var express = require('express');
var router = express.Router();
/* POST posts page. */
router.post('/', function(req, res, next) {
  res.json({
    message: yoloooo
  })
});

module.exports = router;
