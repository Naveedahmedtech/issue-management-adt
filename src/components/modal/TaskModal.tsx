import React from 'react';
import ModalContainer from './ModalContainer';
import TaskForm from '../form/TaskForm';
import { TaskModalProps } from '../../types/types';

const statusColorClasses: { [key in string]: string } = {
    'IN_PROGRESS': 'bg-yellow-500 text-white',
    'PENDING': 'bg-orange-500 text-white',
    'COMPLETED': 'bg-green-500 text-white',
};

const priorityColorClasses: { [key in string]: string } = {
    'HIGH': 'bg-red-500 text-white',
    'MEDIUM': 'bg-blue-500 text-white',
    'LOW': 'bg-gray-500 text-white',
};

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, task, isEditing, handleUpdate }) => {


    return (
        <ModalContainer isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Task' : 'View Task'}>
            {isEditing ? (
                <TaskForm task={{ ...task, dueDate: task.dueDate || null }} onSubmit={handleUpdate} />
            ) : (
                <div className="">
                    {/* Task Header */}
                    <div className="flex justify-between items-center mb-6 pb-4">
                        <h3 className="text-2xl font-semibold">{task.title}</h3>
                    </div>

                    {/* Task Information */}
                    <div className="">
                        {/* Description Section */}
                        <div className="mb-2">
                            <div>
                                <h4 className="text-lg font-semibold text-gray-400">Description</h4>
                                <p className="text-sm text-gray-300 mt-1">{task.description}</p>
                            </div>
                        </div>

                        {/* Status Section */}
                        <div className="mb-2">
                            <div>
                                <h4 className="text-lg font-semibold text-gray-400">Status</h4>
                                <span className={`px-3 py-1 inline-block mt-1 rounded-md ${statusColorClasses[task.status]}`}>
                                    {task.status}
                                </span>
                            </div>
                        </div>

                        {/* Priority Section */}
                        <div className="mb-2">
                            <div>
                                <h4 className="text-lg font-semibold text-gray-400">Priority</h4>
                                <span className={`px-3 py-1 inline-block mt-1 rounded-md ${priorityColorClasses[task.priority]}`}>
                                    {task.priority}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </ModalContainer>
    );
};

export default TaskModal;
