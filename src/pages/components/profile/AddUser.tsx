import React from 'react';
import { Formik, Form } from 'formik';
import FormikSelect from '../../../components/dropdown/Dropdown';
import InputField from '../../../components/InputField';
import { generateRandomPassword, roleOptions, validationSchema } from '../../../utils/universal';
import { useRegisterMutation } from '../../../redux/features/authApi';
import { toast } from 'react-toastify';

const AddUser: React.FC = () => {
    const initialValues = { email: '', password: '', role: 'USER' };
    const [register, { isLoading, isError, error }] = useRegisterMutation();

    const handleSubmit = async (values: typeof initialValues, { resetForm }: { resetForm: () => void }) => {
        try {
            const result = await register(values).unwrap();
            toast.success('User added successfully!');
            resetForm(); // Reset form fields after success
            console.log('User registered successfully:', result);
        } catch (err) {
            console.error('Failed to register user:', err);
        }
    };

    React.useEffect(() => {
        if (isError) {
            const errorMessage =
                'data' in error
                    ? (error as { data: { message: string } }).data.message
                    : 'Failed to register user';
            toast.error(errorMessage);
        }
    }, [isError, error]);

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting, setFieldValue }) => (
                <Form className="space-y-4">
                    <InputField label="Email" name="email" type="email" />

                    {/* Password Field with Toggle and Generate Functionality */}
                    <div className="relative">
                        <InputField
                            label="Password"
                            name="password"
                            type="password"
                        />
                        <button
                            type="button"
                            onClick={() => setFieldValue('password', generateRandomPassword())}
                            className="text-text bg-[#7A23FF]  p-2 rounded text-xs focus:outline-none mr-2"
                        >
                            Generate Password
                        </button>
                    </div>

                    <div>
                        <label className="block font-medium">Role</label>
                        <FormikSelect
                            name="role"
                            options={roleOptions}
                            placeholder="Select Role"
                            className="mt-1"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || isLoading}
                        className="mt-3 btn border-2 border-[#7A23FF] bg-[#7A23FF] px-5 py-2 text-text rounded-[7px] hover:bg-transparent hover:text-[#7A23FF] transition-all"
                    >
                        {isLoading ? 'Adding...' : 'Add User'}
                    </button>
                </Form>
            )}
        </Formik>
    );
};

export default AddUser;
