import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { employeeAPI, historyAPI, noteAPI } from '../services/api';
import socketService from '../services/socket';
import { all } from 'axios';

const EmployeeContext = createContext();

export const useEmployees = () => {
    const context = useContext(EmployeeContext);
    if (!context) {
        throw new Error('useEmployees must be used within EmployeeProvider');
    }
    return context;
}

export const EmployeeProvider = ({ children }) => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        statuses: [],
        search: ''
    });
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [analytics, setAnalytics] = useState({});

    const fetchEmployees = useCallback(async () => {
        try {
            setLoading(true);
            const response = await employeeAPI.getAllEmployeesWithNotes();
            setEmployees(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch employees');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchAnalytics = useCallback(async () => {
        try {
            const response = await historyAPI.getAnalytics();
            setAnalytics(response.data);
        } catch (err) {
            console.error('Error fetching analytics', err);
        }
    }, []);

    const createEmployee = async (employeeData) => {
        try {
            const response = await employeeAPI.createEmployee(employeeData);
            return response.data;
        } catch (err) {
            console.error('Error creating employee', err);
            throw err;
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await employeeAPI.updateEmployeeStatus(id, status);
        } catch (err) {
            console.error('Error updating status', err);
            throw err;
        }
    };

    const bulkUpdateStatus = async (status) => {
        try {
            if (selectedEmployees.length === 0) {
                throw new Error('No employees selected');
            }
            await employeeAPI.bulkUpdateStatus(selectedEmployees, status);
            setSelectedEmployees([]);
        } catch (err) {
            console.error('Error bulk updating status', err);
            throw err;
        }
    };

    const updateEmployee = async (id, employeeData) => {
        try {
            await employeeAPI.updateEmployee(id, employeeData);
        } catch (err) {
            console.error('Error updating employee', err);
            throw err;
        }
    };

    const deleteEmployee = async (id) => {
        try {
            await employeeAPI.deleteEmployee(id);
        } catch (err) {
            console.error('Error deleting employee', err);
            throw err;
        }
    };

    const toggleEmployeeSelection = (employeeId) => {
        setSelectedEmployees(prev => prev.includes(employeeId) ? prev.filter(id => id !== employeeId) : [...prev, employeeId]);
    };

    const selectAllFiltered = (filteredEmployeeIds) => {
        setSelectedEmployees(filteredEmployeeIds);
    };

    const clearSelection = () => {
        setSelectedEmployees([]);
    };

    const applyFilters = (employees) => {
        let filtered = [...employees];

        if (filters.statuses.length > 0) {
            filtered = filtered.filter(emp => filters.statuses.includes(emp.current_status));
        }

        if (filters.search.trim()) {
            filtered = filtered.filter(emp => emp.name.toLowerCase().includes(filters.search.toLowerCase()));
        }

        return filtered;
    };

    useEffect(() => {
        fetchEmployees();
        fetchAnalytics();

        const socket = socketService.connect();

        socket.on('employeeCreated', (newEmployee) => {
            setEmployees(prev => [newEmployee, ...prev]);
            fetchAnalytics();
        });

        socket.on('employeeStatusUpdated', (updatedEmployee) => {
            setEmployees(prev => prev.map(emp => emp.id === updatedEmployee.id ? { ...updatedEmployee, latest_note: emp.latest_note } : emp));
            fetchAnalytics();
        });

        socket.on('bulkStatusUpdate', (updatedEmployees) => {
            setEmployees(prev => {
                const updatedIds = updatedEmployees.map(e => e.id);
                return prev.map(emp => {
                    if (updatedIds.includes(emp.id)) {
                        const updatedEmp = updatedEmployees.find(ue => ue.id === emp.id);
                        // Preserve the latest_note from the previous state
                        return {
                            ...updatedEmp,
                            latest_note: emp.latest_note
                        };
                    }
                    return emp;
                });
            })
            fetchAnalytics();
        });

        socket.on('employeeUpdated', (updatedEmployee) => {
            setEmployees(prev => prev.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp));
        });

        socket.on('employeeDeleted', ({ id }) => {
            setEmployees(prev => prev.filter(emp => emp.id !== id));
            fetchAnalytics();
        });

        socket.on('noteCreated', ({ employeeId, note }) => {
            setEmployees(prev => prev.map(emp => emp.id === employeeId ? { ...emp, latest_note: note } : emp));
        });

        socket.on('noteUpdated', (note) => {
            setEmployees(prev => prev.map(emp => emp.latest_note?.id === note.id ? { ...emp, latest_note: note } : emp));
        });

        socket.on('noteDeleted', ({ employeeId }) => {
            setEmployees(prev => prev.map(emp => emp.id === employeeId ? { ...emp, latest_note: null } : emp));
        });

        return () => {
            socketService.disconnect();
        };
    }, [fetchEmployees, fetchAnalytics]);

    const filteredEmployees = applyFilters(employees);

    const value = {
        employees: filteredEmployees,
        allEmployees: employees,
        loading,
        error,
        filters,
        setFilters,
        selectedEmployees,
        toggleEmployeeSelection,
        selectAllFiltered,
        clearSelection,
        analytics,
        fetchEmployees,
        fetchAnalytics,
        createEmployee,
        updateStatus,
        bulkUpdateStatus,
        updateEmployee,
        deleteEmployee
    };

    return (
        <EmployeeContext.Provider value={value}>
            {children}
        </EmployeeContext.Provider>
    );
}