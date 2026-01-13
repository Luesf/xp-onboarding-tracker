import React, { useEffect, useState } from 'react';
import { historyAPI } from '../services/api';
import { STATUS_COLORS } from '../constants/statuses';

const StatusHistory = ({ employeeId, employeeName }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                const response = await historyAPI.getEmployeeHistory(employeeId);
                setHistory(response.data);
            } catch (error) {
                console.error('Error fetching history:', error);
            } finally {
                setLoading(false);
            }
        };

            fetchHistory();
    }, [employeeId]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const calculateDuration = (index) => {
        if (index === 0) return 'Current';

        const current = new Date(history[index].changed_at);
        const next = index > 0 ? new Date(history[index - 1].changed_at) : new Date();
        const diffInDays = Math.floor((next -current) / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return 'Less than a day';
        if (diffInDays === 1) return '1 day';
        return `${diffInDays} days`;
    };

    if (loading) {
        return (
            <div className='flex justify-center py-8'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
            </div>
        );
    }

    if (history.length === 0) {
        return (
            <div className='text-center py-8 text-gray-500'>
                No history available
            </div>
        );
    }

    return (
        <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-gray-900'>
                Status History for {employeeName}
            </h3>

            <div className='relative'>
                <div className='absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300'></div>
                <div className='space-y-6'>
                    {history.map((item, index) => (
                        <div key={item.id} className='relative pl-10'>
                            <div className={`absolute left-2 w-4 h-4 rounded-full ${
                                index === 0 ? 'bg-blue-600' : 'bg-gray-400'
                            } border-2 border-white`}></div>
                            <div className='bg-white rounded-lg shadow p-4'>
                                <div className='flex items-center justify-between mb-2'>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[item.status]}`}>
                                        {item.status}
                                    </span>
                                    <span className='text-sm text-gray-600'>
                                        {calculateDuration(index)}
                                    </span>
                                </div>
                                <p className='text-sm text-gray-600'>
                                    {formatDate(item.changed_at)}
                                </p>
                                {item.notes && (
                                    <p className='mt-2 text-sm text-gray-700 bg-gray-50 p-2 rounded'>
                                        {item.notes}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StatusHistory;