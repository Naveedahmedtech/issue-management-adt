import { Formik, Form } from 'formik';
import InputField from '../../components/InputField';
import { forgotSchema, } from '../../utils/formSchema';
import { FaEnvelope } from 'react-icons/fa';
import image from "../../assets/images/auth/image.png";
import Text from '../../components/Text';
import { IconColors } from '../../utils/styles';
import CommonHeader from '../components/auth/CommonHeader';
import { Link, useNavigate } from 'react-router-dom';
import { useSendCodeOnEmailMutation } from '../../redux/features/authApi';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import AuthButton from '../../components/buttons/Button';
import { TitleText } from '../../utils/Common';


const AdditionalBody = () => (
    <div className='mt-5'>
        <div className='flex items-center gap-1'>
            <Text className="text-text text-sm">Already have an account?</Text>
            <Link to="/auth/sign-in" className="text-sm text-blue-500 underline">Sign-in</Link>
        </div>
        <Text className="text-text text-xs mt-2">By clicking on “create account” you will accept our terms and conditions and privacy policy.</Text>
    </div>
);


const ForgotPassword = () => {
    const navigate = useNavigate()
    const [sendCode] = useSendCodeOnEmailMutation();
    const handleSubmit = useCallback(async (values: { email: string }, setSubmitting: (a: boolean) => void) => {
        setSubmitting(true)
        try {
            const resendData = {
                email: values?.email,
                event: "FORGOT_PASSWORD"
            };

            await sendCode(resendData).unwrap();
            navigate(`/auth/verify-reset-password-code`, {
                state: { email: values?.email }
            })
        } catch (error: any) {
            if (error?.data?.message) {
                toast.error(error.data.message);
            } else {
                toast.error("An unexpected error occurred while resending the email.");
            }
            console.error("Resend email error:", error);
        } finally {
            setSubmitting(false)
        }
    }, [sendCode, navigate]);

    return (
        <>
            <CommonHeader
                image={image}
                primaryHeading={<TitleText text="Welcome Back to" />}
                secondaryHeading="Forgot Password"
                paragraph="Please provide your email to send a code to reset your password"
                additionBody={<AdditionalBody />}
            >
                <Formik
                    initialValues={{ email: '' }}
                    validationSchema={forgotSchema}
                    onSubmit={(values, { setSubmitting }) => {
                        handleSubmit(values, setSubmitting)
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <InputField
                                label="Email"
                                name="email"
                                type="email"
                                leftIcon={<FaEnvelope color={IconColors.color} />}
                            />
                            <AuthButton text="Get Code" isSubmitting={isSubmitting} />
                        </Form>
                    )}
                </Formik>
            </CommonHeader>
        </>
    );
};

export default ForgotPassword;
