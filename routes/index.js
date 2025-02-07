const router = require('express').Router();
const routes = require('./router'); // router.js dosyasını dahil edildi

router.use(routes);

module.exports = router;