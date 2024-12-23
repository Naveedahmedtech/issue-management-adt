import { useLocation, useNavigate } from 'react-router-dom';
import image from "../../assets/images/auth/image.png";
import CodeVerification from '../../components/CodeVerification';
import { useVerifyCodeMutation } from '../../redux/features/authApi'; // RTK Query Hook
import { toast } from 'react-toastify'; // For showing error messages

const VerifyResetCode = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const [verifyCode] = useVerifyCodeMutation();

    const handleSubmit = async (values: { code: string }, setSubmitting: (a: boolean) => void ) => {
        const { code } = values;
        const data = {
            email,
            code: parseInt(code, 10),
        }
        try {
            await verifyCode(data).unwrap();
            navigate('/auth/reset-password', { state: { email, code } });
        } catch (error: any) {
            toast.error(error?.data?.message || 'An error occurred while verifying the code.');
        } finally {
            setSubmitting(false); 
        }
    };

    return (
        <CodeVerification
            onSubmit={handleSubmit}
            heading="Verify Code"
            paragraph="Please verify the code to reset your password"
            buttonText="Verify Code"
            image={image}
        />
    );
};

export default VerifyResetCode;
