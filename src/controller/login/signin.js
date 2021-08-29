var router = require('express').Router();

// api/products
router.get('/', function(req, res) {
  res.json({ products:'Welcome to the signin' });
});

// api/products/:id
router.get('/:id', function(req, res) {
  res.json({ id: req.params.id });
});

module.exports = router;
