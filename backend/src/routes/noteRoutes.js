const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');

router.get('/employee/:employeeId', noteController.getEmployeeNotes);
router.post('/employee/:employeeId', noteController.createNote);
router.put('/:noteId', noteController.updateNote);
router.delete('/:noteId', noteController.deleteNote);

module.exports = router;