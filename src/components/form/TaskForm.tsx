import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import InputField from '../InputField';
import FormikSelect from '../dropdown/Dropdown';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { TaskFormProps } from '../../types/types';
import { priorityOptions, statusOptions } from '../../mock/tasks';

const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    status: Yup.string().required('Status is required'),
    priority: Yup.string().required('Priority is required'),
    dueDate: Yup.date().required('Due date is required'),
});

const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit }) => (
    <Formik
        initialValues={{
            ...task,
            dueDate: task.dueDate ? new Date(task.dueDate) : null, // Ensure dueDate is a Date object
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
            // Convert the dueDate to ISO format before submitting
            const formattedValues = {
                ...values,
                dueDate: values.dueDate ? values.dueDate.toISOString() : null,
            };
            onSubmit(formattedValues);
        }}
    >
        {({ isSubmitting, setFieldValue, values }) => (
            <Form className="space-y-4">
                <InputField label="Title" name="title" />
                <InputField label="Description" name="description" />

                {/* Status Dropdown */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <FormikSelect
                        name="status"
                        options={statusOptions}
                        placeholder="Select Status"
                        className="mt-1"
                    />
                </div>

                {/* Priority Dropdown */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Priority</label>
                    <FormikSelect
                        name="priority"
                        options={priorityOptions}
                        placeholder="Select Priority"
                        className="mt-1"
                    />
                </div>

                {/* Due Date Picker */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Due Date</label>
                    <DatePicker
                        selected={values.dueDate}
                        onChange={(date) => setFieldValue("dueDate", date)}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Select Due Date"
                        className="mt-1 input-field dark-datepicker"
                        calendarClassName="dark-calendar"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-4 btn bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition"
                >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
            </Form>
        )}
    </Formik>
);

export default TaskForm;
