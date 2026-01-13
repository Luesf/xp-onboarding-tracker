import React, { useState } from 'react';
import StatusHistory from './StatusHistory';
import Notes from './Notes';

const EmployeeDetailModal = ({ employee, isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('history');

    if (!isOpen || !employee) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {employee.name}
                        </h2>
                        <p className="text-gray-600">{employee.email}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                        ✕
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b">
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`flex-1 px-6 py-3 font-medium ${
                            activeTab === 'history'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Status History
                    </button>
                    <button
                        onClick={() => setActiveTab('notes')}
                        className={`flex-1 px-6 py-3 font-medium ${
                            activeTab === 'notes'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Notes
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === 'history' ? (
                        <StatusHistory
                            employeeId={employee.id}
                            employeeName={employee.name}
                        />
                    ) : (
                        <Notes employeeId={employee.id} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmployeeDetailModal;