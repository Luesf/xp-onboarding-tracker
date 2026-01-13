import React, { useState } from 'react';
import { useEmployees } from '../context/EmployeeContext';
import { STATUSES } from '../constants/statuses';

const BulkActionsBar = () => {
    const { selectedEmployees, bulkUpdateStatus, clearSelection } = useEmployees();
    const [selectedStatus, setSelectedStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (selectedEmployees.length === 0) return null;

    const handleBulkUpdate = async () => {
        if (!selectedStatus) {
            setError('Please select a status');
            return;
        }

        try {
            setLoading(true);
            setError('');
            await bulkUpdateStatus(selectedStatus);
            setSelectedStatus('');
        } catch (err) {
            setError('Failed to update employees');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-blue-600 text-white shadow-lg z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        <span className="font-medium">
                            {selectedEmployees.length} employee{selectedEmployees.length !== 1 ? 's' : ''} selected
                        </span>
                        <button
                            onClick={clearSelection}
                            className="text-sm underline hover:no-underline"
                        >
                            Clear selection
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        {error && (
                            <span className="text-sm text-red-200">{error}</span>
                        )}
                        
                        <select
                            value={selectedStatus}
                            onChange={(e) => {
                                setSelectedStatus(e.target.value);
                                setError('');
                            }}
                            className="px-3 py-2 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                            disabled={loading}
                        >
                            <option value="">Select status...</option>
                            {STATUSES.map(status => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={handleBulkUpdate}
                            disabled={loading || !selectedStatus}
                            className="px-6 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Updating...' : 'Update Status'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BulkActionsBar;