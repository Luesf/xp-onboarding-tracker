import React, { useState } from 'react';
import { EmployeeProvider } from './context/EmployeeContext';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import EmployeeList from './components/EmployeeList';
import Dashboard from './components/Dashboard';
import AddEmployeeModal from './components/AddEmployeeModal';
import EmployeeDetailModal from './components/EmployeeDetailModal';
import BulkActionsBar from './components/BulkActionsBar';

function App() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [currentView, setCurrentView] = useState('list');

    const handleViewDetails = (employee) => {
        setSelectedEmployee(employee);
    };

    const handleCloseDetails = () => {
        setSelectedEmployee(null);
    };

    return (
        <EmployeeProvider>
            <div className="min-h-screen bg-gray-50 pb-20">
                <Header 
                    onAddEmployee={() => setIsAddModalOpen(true)}
                    currentView={currentView}
                    setCurrentView={setCurrentView}
                />
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {currentView === 'list' ? (
                        <>
                            <FilterBar />
                            <EmployeeList onViewDetails={handleViewDetails} />
                        </>
                    ) : (
                        <Dashboard />
                    )}
                </div>

                <AddEmployeeModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                />

                <EmployeeDetailModal
                    employee={selectedEmployee}
                    isOpen={!!selectedEmployee}
                    onClose={handleCloseDetails}
                />

                <BulkActionsBar />
            </div>
        </EmployeeProvider>
    );
}

export default App;