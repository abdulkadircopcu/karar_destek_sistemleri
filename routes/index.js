const router = require('express').Router();
const routes = require('./router'); // router.js dosyasını dahil edin

router.use(routes);

module.exports = router;