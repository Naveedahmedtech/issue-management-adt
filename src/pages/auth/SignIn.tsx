import { useCallback, useEffect } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import InputField from '../../components/InputField';
import { loginSchema } from '../../utils/formSchema';
import { FaEnvelope, FaEye, FaLock } from 'react-icons/fa';
import image from "../../assets/images/auth/image.png";
import { IconColors } from '../../utils/styles';
import CommonHeader from '../components/auth/CommonHeader';
import { useNavigate } from 'react-router-dom';
// import { AdditionalBody } from './utils/common';
import { useLoginMutation } from '../../redux/features/authApi';
import { updateUserData } from '../../redux/features/authSlice';
import { useDispatch } from "react-redux";
import { toast } from 'react-toastify';
import { TitleText } from '../../utils/Common';
import Button from '../../components/buttons/Button';

const SignIn = () => {
  const navigate = useNavigate();
  const [loginUser] = useLoginMutation();
  const dispatch = useDispatch();


  const handleSubmit = useCallback(async (values: { email: string, password: string }, { setSubmitting }: FormikHelpers<{ email: string, password: string }>) => {
    try {
      const loginData = {
        ...values,
      };

      await loginUser(loginData).unwrap();
      dispatch(updateUserData({ isLoggedIn: true }));
      navigate("/");
    } catch (error: any) {
      if (error?.data?.message) {
        toast.error(error.data.message);
      } else {
        toast.error("An unexpected error occurred during login.");
      }
      console.error("SignIn error:", error);
    } finally {
      setSubmitting(false);
    }
  }, [loginUser, navigate, dispatch]);


  useEffect(() => {
    const fetchAwen = async () => {
      try {
        
        const response = await fetch(`https://testing-dep-two.vercel.app/api/v1/auth`);
        const data = await response.json();
        console.log(data)
      } catch (error) {
       console.log("ERROR") 
      }
    }
    fetchAwen();
  }, [])


  return (
    <>
      <CommonHeader
        image={image}
        primaryHeading={<TitleText text="Welcome Back to" />}
        secondaryHeading="Sign In"
        paragraph="Sign in to get back to your account."
        type="sign-in"
        // additionBody={<AdditionalBody title="Don't have an account?" action='create account' path="/auth/register" />}
      >
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField
                label="Email"
                name="email"
                type="email"
                leftIcon={<FaEnvelope color={IconColors.color} />}
              />
              <InputField
                label="Password"
                name="password"
                type="password"
                leftIcon={<FaLock color={IconColors.color} />}
                rightIcon={<FaEye color={IconColors.color} />}
              />
              <Button text="Sign in" isSubmitting={isSubmitting} type={'submit'} />
            </Form>
          )}
        </Formik>
      </CommonHeader>
    </>
  );
};

export default SignIn;
