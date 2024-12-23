import { Formik, Form, Field } from 'formik';
import VerificationInput from 'react-verification-input';
import { verifyCodeSchema } from '../utils/formSchema';
import CommonHeader from '../pages/components/auth/CommonHeader';
import AuthButton from './buttons/Button';
import { TitleText } from '../utils/Common';


interface CodeVerificationProps {
    onSubmit: (values: any, actions: any) => void;
    heading: string;
    paragraph: string;
    buttonText: string;
    image: string;
}

const CodeVerification: React.FC<CodeVerificationProps> = ({
    onSubmit,
    heading,
    paragraph,
    buttonText,
    image,
}) => {
    const initialValues = {
        code: '',
    };



    return (
        <CommonHeader
            image={image}
            primaryHeading={<TitleText text="Verify Code For" />}
            secondaryHeading={heading}
            paragraph={paragraph}
        >
            <Formik
                initialValues={initialValues}
                validationSchema={verifyCodeSchema}
                onSubmit={onSubmit}
            >
                {({ setFieldValue, errors, touched, isSubmitting }) => (
                    <Form>
                        <Field name="code">
                            {({ field, form }: any) => (
                                <VerificationInput
                                    {...field}
                                    length={6}
                                    validChars="0-9"
                                    placeholder="_"
                                    classNames={{
                                        container: 'container',
                                        character: 'text-primary',
                                        characterInactive: 'text-primary',
                                        characterSelected: 'text-primary',
                                        characterFilled: 'text-primary',
                                    }}
                                    onChange={(value) => {
                                        setFieldValue('code', value);
                                        if (value.length === 6) {
                                            form.submitForm();
                                        }
                                    }}
                                />
                            )}
                        </Field>
                        {errors.code && touched.code && (
                            <div className="text-red-500 text-xs">{errors.code}</div>
                        )}
                        <AuthButton text={buttonText} isSubmitting={isSubmitting} />
                    </Form>
                )}
            </Formik>
        </CommonHeader>
    );
};

export default CodeVerification;
