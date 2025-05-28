import { useCreateCompanyMutation } from "../../../redux/features/companyApi"
import { toast } from "react-toastify"
import { Form, Formik } from "formik"
import InputField from "../../../components/InputField"
import Button from "../../../components/buttons/Button"
import * as Yup from 'yup'

const validationSchema = Yup.object({
    name: Yup.string().required('Company name is required')
})

interface CreateCompanyFormProps {
    onClose?: () => void;
    refetch?: () => void;
}

const CreateCompanyForm = ({ onClose, refetch }: CreateCompanyFormProps) => {
    const [createCompany, { isLoading }] = useCreateCompanyMutation()

    const handleSubmit = async (values: { name: string }) => {
        try {
            await createCompany(values).unwrap()
            toast.success("Company created successfully")
            onClose?.()
            refetch?.()
        } catch (error) {
            toast.error("Failed to create company, try again")
        }
    }

    return (
        <Formik
            initialValues={{ name: '' }}
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
                        labelColor="text-text"
                    />
                    <Button
                        type="submit"
                        text="Create Company"
                        fullWidth={false}
                        isSubmitting={isLoading || isSubmitting}
                    />
                </Form>
            )}
        </Formik>
    )
}

export default CreateCompanyForm
