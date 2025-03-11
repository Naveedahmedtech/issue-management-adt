import { Form, Formik } from "formik";
import InputField from "../../../components/InputField";
import Button from "../../../components/buttons/Button";
import { Company } from "../../../types/types";
import { useUpdateCompanyMutation } from "../../../redux/features/companyApi";
import { toast } from "react-toastify";
import * as Yup from 'yup';

const validationSchema = Yup.object({
    name: Yup.string().required('Company name is required')
});

interface EditCompanyFormProps {
    selectedCompany: Company | null;
    onClose?: () => void;
    refetch?: () => void;
}

const EditCompanyForm = ({ selectedCompany, onClose, refetch }: EditCompanyFormProps) => {
    const [updateCompany, { isLoading }] = useUpdateCompanyMutation();

    if (!selectedCompany) return null;

    const handleSubmit = async (values: { name: string }) => {
        try {
            await updateCompany({
                id: selectedCompany.id,
                name: values.name
            }).unwrap();
            toast.success("Company updated successfully");
            onClose?.();
            refetch?.();
        } catch (error) {
            toast.error("Failed to update company, try again");
        }
    };

    return (
        <Formik
            initialValues={{ name: selectedCompany.name }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting }) => (
                <Form className="space-y-4">
                    <InputField
                        label="Name"
                        name="name"
                        type="text"
                        placeholder="Enter company name"

                    />
                    <Button
                        type="submit"
                        className="mt-4"
                        text="Update Company"
                        fullWidth={false}
                        isSubmitting={isLoading || isSubmitting}
                    />
                </Form>
            )}
        </Formik>
    );
};

export default EditCompanyForm;
