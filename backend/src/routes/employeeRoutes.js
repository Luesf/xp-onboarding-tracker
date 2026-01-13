const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

router.get('/', employeeController.getAllEmployees);
router.get('/with-notes', employeeController.getAllEmployeesWithNotes);
router.get('/filter', employeeController.filterEmployees);
router.patch('/bulk-status', employeeController.bulkUpdateStatus);
router.get('/:id', employeeController.getEmployee);
router.post('/', employeeController.createEmployee);
router.patch('/:id/status', employeeController.updateEmployeeStatus);
router.put('/:id', employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router;