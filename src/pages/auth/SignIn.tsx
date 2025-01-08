import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import image from "../../assets/images/auth/image.png";
import CommonHeader from '../components/auth/CommonHeader';
import { TitleText } from '../../utils/Common.tsx';
import Button from '../../components/buttons/Button';
import { useAzureLoginQuery } from '../../redux/features/authApi.ts';

const SignIn = () => {
  const { data, isLoading, isError, error } = useAzureLoginQuery({});
  const [loginUrl, setLoginUrl] = useState<string | null>(null);

  // Set the login URL when the data is successfully fetched
  useEffect(() => {
    if (data?.status === "success" && data?.data?.url) {
      setLoginUrl(data.data.url);
    } else if (isError) {
      toast.error("Failed to get Azure login URL. Please try again.");
      console.error("Azure Login Error:", error);
    }
  }, [data, isError, error]);

  // Handle button click to trigger login
  const handleLoginClick = () => {
    if (loginUrl) {
      window.location.href = loginUrl;
    } else {
      toast.error("Azure login URL is not available. Please try again.");
    }
  };

  return (
    <CommonHeader
      image={image}
      primaryHeading={<TitleText text="Welcome Back to" />}
      secondaryHeading="Sign In"
      paragraph="Sign in to continue with your account."
      type="sign-in"
    >
      <Button
        text={isLoading ? "Loading..." : "Login with Azure AD"}
        onClick={handleLoginClick}
        isSubmitting={isLoading}
      />
    </CommonHeader>
  );
};

export default SignIn;
