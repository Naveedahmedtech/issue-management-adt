import React, { useCallback } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import InputField from '../../components/InputField';
import { registerSchema } from '../../utils/formSchema';
import { FaEnvelope, FaEye, FaLock, FaUser } from 'react-icons/fa';
import { IconColors } from '../../utils/styles';
import { useNavigate } from 'react-router-dom';
import {  useRegisterMutation } from '../../redux/features/authApi';
import { toast } from 'react-toastify';
import { IRegisterValues } from '../../types/types';
import { loginSuccess } from '../../redux/features/authSlice';
import { useDispatch } from 'react-redux';
import CommonHeader from '../components/auth/CommonHeader';
import image from "../../assets/images/auth/image.png";
import { AdditionalBody } from './utils/common';
import { TitleText } from '../../utils/Common.tsx';
import Button from '../../components/buttons/Button';


const Register: React.FC = () => {
  const navigate = useNavigate();
  const [registerUser] = useRegisterMutation();
  const dispatch = useDispatch();


  const handleSubmit = useCallback(async (values: IRegisterValues, { setSubmitting }: FormikHelpers<IRegisterValues>) => {

    const userData = {
      ...values,
      role: "USER"
    };
    try {
      const response = await registerUser(userData).unwrap();
      dispatch(loginSuccess(response.result));
      navigate("/auth/verify-registration-code", {
        state: { email: values.email },
      });
    } catch (error: any) {
      if (error?.data?.message) {
        if (Array.isArray(error.data.message?.message)) {
          toast.error(error.data.message?.message[0]);
        } else if (typeof error.data.message === 'string') {
          toast.error(error.data.message);
        }
        else if (!Array.isArray(error.data.message?.message)) {
          toast.error(error.data.message.message);
        }
      } else if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
      console.error(error.data.message);
    }

    setSubmitting(false);
  }, [registerUser, navigate, dispatch]);

  return (
      <CommonHeader
          image={image}
          primaryHeading={<TitleText text="Welcome Back to" />}
          secondaryHeading="Sign In"
          paragraph="Sign in to get back to your account."
          type="sign-in"
          additionBody={<AdditionalBody title="Alreadu have an account?" action='signin' path="/auth/sign-in" />}
      >
        <Formik
            initialValues={{ email: '', password: '', confirm_password: '', username: '' }}
            validationSchema={registerSchema}
            onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
              <Form>
                <InputField
                    label="Username"
                    name="username"
                    type="text"
                    leftIcon={<FaUser color={IconColors.color} />}
                />
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
                <InputField
                    label="Confirm Password"
                    name="confirm_password"
                    type="password"
                    leftIcon={<FaLock color={IconColors.color} />}
                    rightIcon={<FaEye color={IconColors.color} />}
                />
                <Button text="Register" isSubmitting={isSubmitting}  type={'submit'} />
              </Form>
          )}
        </Formik>
      </CommonHeader>
  );
};

export default Register;