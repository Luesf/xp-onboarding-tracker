const express = require('express');
const router = express.Router();
const statusHistoryController = require('../controllers/statusHistoryController');

router.get('/', statusHistoryController.getAllHistory);
router.get('/analytics', statusHistoryController.getAnalytics);
router.get('/stale', statusHistoryController.getStaleEmployees);
router.get('/employee/:employeeId', statusHistoryController.getEmployeeHistory);

module.exports = router;