import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const employeeAPI = {
  getAllEmployees: () => api.get('/employees'),
  getAllEmployeesWithNotes: () => api.get('/employees/with-notes'),
  getEmployee: (id) => api.get(`/employees/${id}`),
  createEmployee: (data) => api.post('/employees', data),
  updateEmployeeStatus: (id, status) => api.patch(`/employees/${id}/status`, { status }),
  updateEmployee: (id, data) => api.put(`/employees/${id}`, data),
  deleteEmployee: (id) => api.delete(`/employees/${id}`),
  filterEmployees: (params) => api.get('/employees/filter', { params }),
  bulkUpdateStatus: (employeeIds, status) => api.patch('/employees/bulk-status', { employeeIds, status })
};

export const historyAPI = {
  getEmployeeHistory: (employeeId) => api.get(`/history/employee/${employeeId}`),
  getAllHistory: () => api.get('/history'),
  getAnalytics: () => api.get('/history/analytics'),
  getStaleEmployees: (status, days) => api.get('/history/stale', { params: { status, days } })
};

export const noteAPI = {
  getEmployeeNotes: (employeeId) => api.get(`/notes/employee/${employeeId}`),
  createNote: (employeeId, content) => api.post(`/notes/employee/${employeeId}`, { content }),
  updateNote: (noteId, content) => api.put(`/notes/${noteId}`, { content }),
  deleteNote: (noteId) => api.delete(`/notes/${noteId}`)
};

export default api;