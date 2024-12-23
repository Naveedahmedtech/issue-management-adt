import { Formik, Form } from 'formik';
import InputField from '../../components/InputField';
import { resetPasswordSchema } from '../../utils/formSchema';
import { FaEye, FaLock } from 'react-icons/fa';
import image from "../../assets/images/auth/image.png";
import { IconColors } from '../../utils/styles';
import CommonHeader from '../components/auth/CommonHeader';
import { useNavigate, useLocation } from 'react-router-dom';
import Text from '../../components/Text';
import { APP_NAME } from '../../constant/BASE_URL';
import { useResetPasswordMutation } from '../../redux/features/authApi'; // RTK Query Hook
import { toast } from 'react-toastify';
import AuthButton from '../../components/buttons/Button';

const AdditionalBody = () => (
    <div className='mt-5'>
        <Text className="text-text text-sm mt-4">
            Creating a strong password helps protect your account from unauthorized access and ensures better security.
        </Text>
    </div>
);

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email; // Retrieve email from location state
    const code = location.state?.code;   // Retrieve code from location state

    const [resetPassword] = useResetPasswordMutation(); // RTK Query mutation hook for resetting the password

    const TitleText = () => {
        return <Text className="text-4xl font-semibold mb-5 text-text">{APP_NAME}</Text>
    };

    const handleSubmit = async (values: { password: string, confirm_password: string }, { setSubmitting }: any) => {
        const data = {
            email,
            code: parseInt(code, 10),
            confirmPassword: values.confirm_password,
            newPassword: values.password
        }
        try {
            // Make the API call to reset the password
            const response = await resetPassword(data).unwrap();

            // If successful, navigate to sign-in page
            if (response.success) {
                toast.success('Password reset successfully. Please log in.');
                navigate("/auth/sign-in");
            } else {
                toast.error('Failed to reset the password.');
            }
        } catch (error: any) {
            toast.error(error?.data?.message || 'An error occurred while resetting the password.');
        } finally {
            setSubmitting(false); // End form submission state
        }
    };

    return (
        <CommonHeader
            image={image}
            primaryHeading={<TitleText />}
            secondaryHeading="Reset Password"
            paragraph="Create a new strong password"
            type="sign-up"
            additionBody={<AdditionalBody />}
        >
            <Formik
                initialValues={{ password: '', confirm_password: '' }}
                validationSchema={resetPasswordSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            label="Password"
                            name="password"
                            type="password"
                            leftIcon={<FaLock color={IconColors.color} />}
                            rightIcon={<FaEye color={IconColors.color} />}
                        />
                        <InputField
                            label="Confirm Password"
                            name="confirm_password"
                            type="password"
                            leftIcon={<FaLock color={IconColors.color} />}
                            rightIcon={<FaEye color={IconColors.color} />}
                        />
                        <AuthButton text="Reset Password" isSubmitting={isSubmitting} />
                    </Form>
                )}
            </Formik>
        </CommonHeader>
    );
};

export default ResetPassword;
