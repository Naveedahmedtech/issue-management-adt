import { Formik, Form } from 'formik';
import FormikSelect from './Dropdown';
import { Option, TaskDropdownProps } from '../../types/types';



const TaskDropdown = ({ task, type, handleUpdate }: TaskDropdownProps) => {
    const options: Option[] = type === 'status'
        ? [
            { value: 'COMPLETED', label: 'Completed' },
            { value: 'PENDING', label: 'Pending' },
            { value: 'IN_PROGRESS', label: 'In Progress' },
        ]
        : [
            { value: 'HIGH', label: 'High' },
            { value: 'MEDIUM', label: 'Medium' },
            { value: 'LOW', label: 'Low' },
        ];

    // Initial form value based on the current task status or priority
    const initialValue = task[type];

    const handleSubmit = (values: { [key: string]: string }) => {
        const updatedTask = { ...task, [type]: values[type] };
        handleUpdate(updatedTask); // Call handleUpdate with the new task data
    };

    return (
        <Formik
            initialValues={{ [type]: initialValue }}
            onSubmit={handleSubmit}
            enableReinitialize // Allows reinitialization if the task changes
        >
            {({ submitForm }) => (
                <Form>
                    <FormikSelect
                        name={type}
                        options={options}
                        placeholder={`Select ${type.charAt(0).toUpperCase() + type.slice(1)}`}
                        className="mt-1"
                        onChange={() => {
                            submitForm();
                        }}
                    />
                </Form>
            )}
        </Formik>
    );
};

export default TaskDropdown;
