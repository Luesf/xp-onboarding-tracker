const statusHistoryModel = require('../models/statusHistoryModel');

const statusHistoryController = {
    getEmployeeHistory: async (req, res) => {
        try {
            const { employeeId } = req.params;
            const history = await statusHistoryModel.getByEmployeeId(employeeId);
            res.json(history);
        } catch (error) {
            console.error('Error fetching history:', error);
            res.status(500).json({ error: 'Failed to fetch history' });
        }
    },
    getAllHistory: async (req, res) => {
        try {
            const history = await statusHistoryModel.getAll();
            res.json(history);
        } catch (error) {
            console.error('Error fetching all history:', error);
            res.status(500).json({ error: 'Failed to fetch history' });
        }
    },
    getStaleEmployees: async (req, res) => {
        try {
            const { status, days = 30 } = req.query;
            if (!status) {
                return res.status(400).json({ error: 'Status query parameter is required' });
            }
            const employees = await statusHistoryModel.getStaleEmployees(status, days);
            res.json(employees);
        } catch (error) {
            console.error('Error fetching stale employees:', error);
            res.status(500).json({ error: 'Failed to fetch stale employees' });
        }
    },
    getAnalytics: async (req, res) => {
        try {
            const [averageTime, distribution] = await Promise.all([
                statusHistoryModel.getAverageTimeByStatus(),
                statusHistoryModel.getStatusDistribution()
            ]);
            res.json({
                averageTimeByStatus: averageTime,
                statusDistribution: distribution
            });
        } catch (error) {
            console.error('Error fetching analytics:', error);
            res.status(500).json({ error: 'Failed to fetch analytics' });
        }
    }
};

module.exports = statusHistoryController;