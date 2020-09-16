const router = require('express').Router();
// LOCAL IMPORTS
const { test } = require('./controllers');
// ENDPOINTS
//
// check email is available
router.get('/test', test.test);

module.exports = router;
