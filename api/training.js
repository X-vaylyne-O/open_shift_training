const router = require('express').Router();
// LOCAL IMPORTS
const { test } = require('./controllers');
// ENDPOINTS
//
// check email is available
router.post('/test', test.test);

module.exports = router;
