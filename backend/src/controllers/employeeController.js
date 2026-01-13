const employeeModel = require('../models/employeeModel');

const employeeController = {
    getAllEmployees: async (req, res) => {
        try {
            const employees = await employeeModel.getAll();
            res.json(employees);
        } catch (error) {
            console.error('Error fetching employees:', error);
            res.status(500).json({ error: 'Failed to fetch employees' });
        }
    },
    getEmployee: async (req, res) => {
        try {
            const { id } = req.params;
            const employee = await employeeModel.getById(id);

            if (!employee) {
                return res.status(404).json({ error: 'Employee not found' });
            }

            res.json(employee);
        } catch (error) {
            console.error('Error fetching employee:', error);
            res.status(500).json({ error: 'Failed to fetch employee' });
        }
    },
    createEmployee: async (req, res) => {
        try {
            const { name, email, hire_date, current_status } = req.body;

            if (!name || !email || !hire_date || !current_status) {
                return res.status(400).json({ error: 'All fields are required' });
            }

            const newEmployee = await employeeModel.create(req.body);

            req.io.emit('employeeCreated', newEmployee);

            res.status(201).json(newEmployee);
        } catch (error) {
            console.error('Error creating employee:', error);
            if (error.code === '23505') {
                return res.status(400).json({ error: 'Email already exists' });
            }
            res.status(500).json({ error: 'Failed to create employee' });
        }
    },
    updateEmployeeStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!status) {
                return res.status(400).json({ error: 'Status is required' });
            }

            const updatedEmployee = await employeeModel.updateStatus(id, status);

            if (!updatedEmployee) {
                return res.status(404).json({ error: 'Employee not found' });
            }

            req.io.emit('employeeStatusUpdated', updatedEmployee);

            res.json(updatedEmployee);
        } catch (error) {
            console.error('Error updating status:', error);
            res.status(500).json({ error: 'Failed to update status' });
        }
    },
    updateEmployee: async (req, res) => {
        try {
            const { id } = req.params;
            const updatedEmployee = await employeeModel.update(id, req.body);

            if (!updatedEmployee) {
                return res.status(404).json({ error: 'Employee not found' });
            }

            req.io.emit('employeeUpdated', updatedEmployee);

            res.json(updatedEmployee);
        } catch (error) {
            console.error('Error updating employee:', error);
            res.status(500).json({ error: 'Failed to update employee' });
        }
    },
    deleteEmployee: async (req, res) => {
        try {
            const { id } = req.params;
            const deletedEmployee = await employeeModel.delete(id);

            if (!deletedEmployee) {
                return res.status(404).json({ error: 'Employee not found' });
            }

            req.io.emit('employeeDeleted', { id: parseInt(id)});

            res.json({ message: 'Employee deleted successfully' });
        } catch (error) {
            console.error('Error deleting employee:', error);
            res.status(500).json({ error: 'Failed to delete employee' });
        }
    },
    filterEmployees: async (req, res) => {
        try {
            const { statuses, search } = req.query;

            if (search) {
                const employees = await employeeModel.searchByName(search);
                return res.json(employees);
            }

            if (statuses) {
                const statusArray = statuses.split(',');
                const employees = await employeeModel.filterByStatus(statusArray);
                return res.json(employees);
            }

            res.status(400).json({ error: 'Please provide statuses or search parameter' });
        } catch (error) {
            console.error('Error filtering employees:', error);
            res.status(500).json({ error: 'Failed to filter employees' });
        }
    },
    bulkUpdateStatus: async (req, res) => {
        try {
            const { employeeIds, status } = req.body;
            if (!employeeIds || !Array.isArray(employeeIds) || employeeIds.length === 0) {
                return res.status(400).json({ error: 'Employee IDs array is required' });
            }
            if (!status) {
                return res.status(400).json({ error: 'Status is required' });
            }
            const updatedEmployees = await employeeModel.bulkUpdateStatus(employeeIds, status);
            req.io.emit('bulkStatusUpdate', updatedEmployees);
            res.json({ message: `Successfully updated ${updatedEmployees.length}`, employees: updatedEmployees });
        } catch (error) {
            console.error('Error bulk updating status:', error);
            res.status(500).json({ error: 'Failed to bulk update status' });
        }
    },
    getAllEmployeesWithNotes: async (req, res) => {
        try {
            const employees = await employeeModel.getAllWithNotes();
            res.json(employees);
        } catch (error) {
            console.error('Error fetching employees with notes:', error);
            res.status(500).json({ error: 'Failed to fetch employees' });
        }
    }
};

module.exports = employeeController;