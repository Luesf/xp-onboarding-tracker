import React, { useState } from 'react';
import { useEmployees } from '../context/EmployeeContext';
import { STATUSES, STATUS_COLORS } from '../constants/statuses';

const EmployeeCard = ({ employee, onViewDetails }) => {
    const { updateStatus, deleteEmployee, selectedEmployees, toggleEmployeeSelection } = useEmployees();
    const [isUpdating, setIsUpdating] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const isSelected = selectedEmployees.includes(employee.id);

    const handleStatusChange = async (newStatus) => {
        try {
            setIsUpdating(true);
            await updateStatus(employee.id, newStatus);
        } catch (error) {
            console.error('Failed to update status:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteEmployee(employee.id);
            setShowDeleteConfirm(false);
        } catch (error) {
            console.error('Failed to delete employee:', error);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getTimeSinceUpdate = (dateString) => {
        const now = new Date();
        const updated = new Date(dateString);
        const diffInDays = Math.floor((now - updated) / (1000 * 60 * 60 * 24));
        
        if (diffInDays === 0) return 'Today';
        if (diffInDays === 1) return 'Yesterday';
        return `${diffInDays} days ago`;
    };

    const getDaysInStatus = (dateString) => {
        const now = new Date();
        const updated = new Date(dateString);
        return Math.floor((now - updated) / (1000 * 60 * 60 * 24));
    };

    const daysInStatus = getDaysInStatus(employee.status_updated_at);
    const isStale = daysInStatus > 30;

    return (
        <div className={`bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-all ${
            isSelected ? 'ring-2 ring-blue-600' : ''
        }`}>
            {/* Header with Checkbox */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-start gap-3 flex-1">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleEmployeeSelection(employee.id)}
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                    />
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {employee.name}
                        </h3>
                        <p className="text-sm text-gray-600">{employee.email}</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="text-red-500 hover:text-red-700 text-sm"
                    title="Delete employee"
                >
                    🗑️
                </button>
            </div>

            {/* Status Badge with Warning */}
            <div className="mb-3 flex items-center gap-2">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[employee.current_status]}`}>
                    {employee.current_status}
                </span>
                {isStale && (
                    <span className="text-xs text-red-600 font-medium" title={`${daysInStatus} days in status`}>
                        ⚠️ {daysInStatus}d
                    </span>
                )}
            </div>

            {/* Latest Note */}
            {employee.latest_note && (
                <div className="mb-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Latest note:</p>
                    <p className="text-sm text-gray-700 line-clamp-2">
                        {employee.latest_note.content}
                    </p>
                </div>
            )}

            {/* Info */}
            <div className="text-sm text-gray-600 mb-3 space-y-1">
                <p>
                    <span className="font-medium">Hired:</span> {formatDate(employee.hire_date)}
                </p>
                <p>
                    <span className="font-medium">Status updated:</span> {getTimeSinceUpdate(employee.status_updated_at)}
                </p>
            </div>

            {/* Status Dropdown */}
            <div className="mb-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                    Change Status:
                </label>
                <select
                    value={employee.current_status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    disabled={isUpdating}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {STATUSES.map(status => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
            </div>

            {/* View Details Button */}
            <button
                onClick={() => onViewDetails(employee)}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
            >
                View Details
            </button>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
                        <h3 className="text-lg font-bold mb-2">Confirm Delete</h3>
                        <p className="text-gray-600 mb-4">
                            Are you sure you want to delete {employee.name}? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeCard;