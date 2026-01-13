import React from 'react';
import { useEmployees } from '../context/EmployeeContext';
import { STATUSES } from '../constants/statuses';

const FilterBar = () => {
    const { filters, setFilters, employees, selectedEmployees, selectAllFiltered, clearSelection } = useEmployees();

    const handleStatusToggle = (status) => {
        setFilters(prev => ({
            ...prev,
            statuses: prev.statuses.includes(status)
                ? prev.statuses.filter(s => s !== status)
                : [...prev.statuses, status]
        }));
    };

    const handleSearchChange = (e) => {
        setFilters(prev => ({
            ...prev,
            search: e.target.value
        }));
    };

    const clearFilters = () => {
        setFilters({ statuses: [], search: '' });
    };

    const handleSelectAll = () => {
        const currentIds = employees.map(emp => emp.id);
        if (selectedEmployees.length === currentIds.length) {
            clearSelection();
        } else {
            selectAllFiltered(currentIds);
        }
    };

    const allSelected = employees.length > 0 && selectedEmployees.length === employees.length;

    return (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
            {/* Search and Select All */}
            <div className="mb-4 flex gap-3">
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={filters.search}
                    onChange={handleSearchChange}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleSelectAll}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        allSelected
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    {allSelected ? 'Deselect All' : 'Select All'}
                </button>
            </div>

            {/* Status Filters */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Status:
                </label>
                <div className="flex flex-wrap gap-2">
                    {STATUSES.map(status => (
                        <button
                            key={status}
                            onClick={() => handleStatusToggle(status)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                filters.statuses.includes(status)
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Clear Filters */}
            {(filters.statuses.length > 0 || filters.search) && (
                <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                    Clear all filters
                </button>
            )}
        </div>
    );
};

export default FilterBar;