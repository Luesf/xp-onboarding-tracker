const pool = require('../config/database');

const statusHistoryModel = {
    getByEmployeeId: async (employeeId) => {
        const query = `
            SELECT * FROM status_history
            WHERE employee_id = $1
            ORDER BY changed_at DESC
        `;
        const result = await pool.query(query, [employeeId]);
        return result.rows;
    },
    getAll: async () => {
        const query = `
            SELECT sh.*, e.name, e.email
            FROM status_history sh
            JOIN employees e ON sh.employee_id = e.id
            ORDER BY sh.changed_at DESC
        `;
        const result = await pool.query(query);
        return result.rows;
    },
    create: async (employeeId, status, notes = null) => {
        const query = `
            INSERT INTO status_history (employee_id, status, notes)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        const result = await pool.query(query, [employeeId, status, notes]);
        return result.rows[0];
    },
    getStaleEmployees: async (status, days) => {
        const query = `
            SELECT e.*,
                EXTRACT(DAY FROM (CURRENT_TIMESTAMP - e.status_updated_at)) as days_in_status
            FROM employees e
            WHERE e.current_status = $1
            AND EXTRACT(DAY FROM (CURRENT_TIMESTAMP - e.status_updated_at)) >= $2
            ORDER BY e.status_updated_at ASC
        `;
        const result = await pool.query(query, [status, days]);
        return result.rows;
    },
    getAverageTimeByStatus: async () => {
        const query = `
            WITH status_durations AS (
                SELECT
                    sh1.status,
                    sh1.employee_id,
                    sh1.changed_at as start_time,
                    COALESCE(
                        LEAD(sh1.changed_at) OVER(PARTITION BY sh1.employee_id ORDER BY sh1.changed_at),
                        CURRENT_TIMESTAMP
                    ) as end_time
                FROM status_history sh1
            )
            SELECT
                status,
                count(*) as count,
                AVG(EXTRACT(EPOCH FROM (end_time - start_time)) / 86400) as avg_days
            FROM status_durations
            GROUP BY status
            ORDER BY status;
        `;
        const result = await pool.query(query);
        return result.rows;
    },
    getStatusDistribution: async () => {
        const query = `
            SELECT current_status as status, COUNT(*) as count
            FROM employees
            GROUP BY current_status
            ORDER BY count DESC;
        `;
        const result = await pool.query(query);
        return result.rows;
    }
};

module.exports = statusHistoryModel;