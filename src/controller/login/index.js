var router = require('express').Router();

// split up route handling
router.use('/',require('./middleware'))

router.use('/signin/', require('./signin'));
router.use('/signup/', require('./signup'));
// etc.

module.exports = router;