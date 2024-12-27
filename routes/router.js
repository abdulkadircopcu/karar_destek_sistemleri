const router = require('express').Router();
const path = require('path');
const controller = require('../controller/controller'); // controller.js dosyasını dahil edin

// API endpoint'lerini controller.js dosyasına yönlendirin
router.get('/api/sales', controller.getSales);
router.get('/api/income', controller.getIncome);
router.get('/api/stats', controller.getStats);
router.post('/api/login', controller.login);
router.get('/api/user', controller.getUser);
router.get('/api/team-sales', controller.getTeamSales);
router.get('/api/size-sales', controller.getSizeSales);
router.get('/api/pie-chart-data', controller.getPieChartData);
router.get('/api/new-pie-chart-data', controller.getNewPieChartData);

module.exports = router;
