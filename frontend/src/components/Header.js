import React from 'react';
import { useEmployees } from '../context/EmployeeContext';

const Header = ({ onAddEmployee, currentView, setCurrentView }) => {
    const { allEmployees } = useEmployees();

    return (
        <div className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Employee Tracker
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {allEmployees.length} total employee{allEmployees.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <button
                        onClick={onAddEmployee}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        + Add Employee
                    </button>
                </div>

                {/* View Toggle */}
                <div className="flex gap-2 border-t pt-4">
                    <button
                        onClick={() => setCurrentView('list')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            currentView === 'list'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        📋 Employee List
                    </button>
                    <button
                        onClick={() => setCurrentView('dashboard')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            currentView === 'dashboard'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        📊 Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Header;