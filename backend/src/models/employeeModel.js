const pool = require('../config/database');

const employeeModel = {
    getAll: async () => {
        const query = 'SELECT * FROM employees ORDER BY created_at DESC';
        const result = await pool.query(query);
        return result.rows;
    },
    getById: async (id) => {
        const query = 'SELECT * FROM employees WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },
    create: async (employeeData) => {
        const { name, email, hire_date, current_status } = employeeData;
        const query = `
            INSERT INTO employees (name, email, hire_date, current_status)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const result = await pool.query(query, [name, email, hire_date, current_status]);
        return result.rows[0];
    },
    updateStatus: async (id, status) => {
        const query = `
            UPDATE employees
            SET current_status = $1,
                status_updated_at = CURRENT_TIMESTAMP,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING *
        `;
        const result = await pool.query(query, [status, id]);
        return result.rows[0];
    },
    update: async (id, employeeData) => {
        const { name, email, hire_date } = employeeData;
        const query = `
            UPDATE employees
            SET name = $1, email = $2, hire_date = $3, updated_at = CURRENT_TIMESTAMP
            WHERE id = $4
            RETURNING *
        `;
        const result = await pool.query(query, [name, email, hire_date, id]);
        return result.rows[0];
    },
    delete: async (id) => {
        const query = 'DELETE FROM employees WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },
    filterByStatus : async (statuses) => {
        const query = 'SELECT * FROM employees WHERE current_status = ANY($1) ORDER BY created_at DESC';
        const result = await pool.query(query, [`%${statuses}%`]);
        return result.rows;
    },
    searchByName: async (searchTerm) => {
        const query = 'SELECT * FROM employees WHERE name ILIKE $1 ORDER BY name';
        const result = await pool.query(query, [`%${searchTerm}%`]);
        return result.rows;
    }
};

module.exports = employeeModel;