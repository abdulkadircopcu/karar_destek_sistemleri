const router = require('express').Router();
const path = require('path');
const controller = require('../controller/controller'); // controller.js dosyasını dahil edin

// API endpoint'lerini controller.js dosyasına yönlendirin
router.get('/api/stats', controller.getStats);
router.post('/api/login', controller.login);
router.get('/api/user', controller.getUser);

module.exports = router;
