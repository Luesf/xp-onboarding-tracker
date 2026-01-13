const pool = require('../config/database');

const noteModel = {
    getByEmployeeId: async (employeeId) => {
        const query = `
            SELECT * FROM notes
            WHERE employee_id = $1
            ORDER BY created_at DESC
        `;
        const result = await pool.query(query, [employeeId]);
        return result.rows;
    },
    getLatestForAllEMployees: async () => {
        const query = `
            SELECT DISTINCT ON (employee_id)
                id, employee_id, content, created_at, updated_at
            FROM notes
            ORDER BY employee_id, created_at DESC
        `;
        const result = await pool.query(query);
        return result.rows;
    },
    create : async (employeeId, content) => {
        const query = `
            INSERT INTO notes (employee_id, content)
            VALUES ($1, $2)
            RETURNING *
        `;
        const result = await pool.query(query, [employeeId, content]);
        return result.rows[0];
    },
    update: async (id, content) => {
        const query = `
            UPDATE notes
            SET content = $1, updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING *
        `;
        const result = await pool.query(query, [content, id]);
        return result.rows[0];
    },
    delete: async (id) => {
        const query = `DELETE FROM notes WHERE id = $1 RETURNING *`;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },
    getById: async (id) => {
        const query = `SELECT * FROM notes WHERE id = $1`;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
};

module.exports = noteModel;