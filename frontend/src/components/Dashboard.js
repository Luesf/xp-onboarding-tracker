import React from 'react';
import { useEmployees } from '../context/EmployeeContext';
import { STATUSES, STATUS_COLORS } from '../constants/statuses';

const Dashboard = () => {
    const { analytics, allEmployees } = useEmployees();

    if (!analytics) {
        return (
            <div className='bg-white rounded-lg shadow p-6'>
                <p className='text-gray-500'>Loading analytics...</p>
            </div>
        );
    }

    const { statusDistribution, averageTimeByStatus } = analytics;

    return (
        <div className='space-y-6'>

            {/* Summary Cards */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='bg-white rounded-lg shadow p-6'>
                    <h3 className='text-gray-500 text-sm font-medium mb-2'>
                        Total Employees
                    </h3>
                    <p className='text-3xl font-bold text-gray-900'>
                        {allEmployees.length}
                    </p>
                </div>
                <div className='bg-white rounded-lg shadow p-6'>
                    <h3 className='text-gray-500 text-sm font-medium mb-2'>
                        Active Statuses
                    </h3>
                    <p className='text-3xl font-bold text-gray-900'>
                        {statusDistribution.length}
                    </p>
                </div>
                <div className='bg-white rounded-lg shadow p-6'>
                    <h3 className='text-gray-500 text-sm font-medium mb-2'>
                        In Matching Pool
                    </h3>
                    <p className='text-3xl font-bold text-gray-900'> 
                        {statusDistribution.find(s => s.status === 'Matching Pool')?.count || 0}
                    </p>
                </div>
            </div>

            {/* Status Distribution */}
            <div className='bg-white rounded-lg shadow p-6'>
                <h2 className='text-xl font-bold text-gray-900 mb-4'>
                    Status Distribution
                </h2>
                <div className='space-y-3'>
                    {statusDistribution.map(({ status, count }) => {
                        const percentage = ((count / allEmployees.length) * 100).toFixed(1);
                        return (
                            <div key={status}>
                                <div className='flex justify-between items-center mb-1'>
                                    <span className={`text-sm font-medium px-3 py-1 rounded-full ${STATUS_COLORS[status]}`}>
                                        {status}
                                    </span>
                                    <span className='text-sm text-gray-600'>
                                        {count} ({percentage}%)
                                    </span>
                                </div>
                                <div className='w-full bg-gray-200 rounded-full h-2'>
                                    <div
                                        className='bg-blue-600 h-2 rounded-full transition-all'
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Average Time in Status */}
            <div className='bg-white rounded-lg shadow p-6'>
                    <h2 className='text-xl font-bold text-gray-900 mb-4'>
                        Average Time in Each Status
                    </h2>
                    <div className='overflow-x-auto'>
                        <table className='min-w-full'>
                            <thead>
                                <tr className='border-b'>
                                    <th className='text-left py-3 px-4 font-semibold text-gray-700'>
                                        Status
                                    </th>
                                    <th className='text-left py-3 px-4 font-semibold text-gray-700'>
                                        Occurrences    
                                    </th>
                                    <th className='text-left py-3 px-4 font-semibold text-gray-700'>
                                        Avg. Days
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {averageTimeByStatus.map(({ status, count, avg_days }) => (
                                    <tr key={status} className='border-b hover:bg-gray-50'>
                                        <td className='py-3 px-4'>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[status]}`}>
                                                {status}
                                            </span>
                                        </td>
                                        <td className='py-3 px-4 text-gray-700'>
                                            {count}
                                        </td>
                                        <td className='py-3 px-4'>
                                            <span className={`font-medium ${
                                                parseFloat(avg_days) > 30
                                                    ? 'text-red-600'
                                                    : parseFloat(avg_days) > 14
                                                    ? 'text-yellow-600'
                                                    : 'text-green-600'
                                            }`}>
                                                {parseFloat(avg_days).toFixed(1)} days
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
            </div>
        </div>
    );
};

export default Dashboard;