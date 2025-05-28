import Button from "../../../components/buttons/Button";
import { toast } from "react-toastify";

interface DeleteCompanyFormProps {
    handleDeleteConfirm: () => Promise<void>;
    isDeleting: boolean;
    onClose?: () => void;
    refetch?: () => void;
}

const DeleteCompanyForm = ({ handleDeleteConfirm, isDeleting, onClose, refetch }: DeleteCompanyFormProps) => {
    const handleDelete = async () => {
        try {
            await handleDeleteConfirm();
            toast.success("Company deleted successfully");
            refetch?.();
        } catch (error) {
            toast.error("Failed to delete company");
            onClose?.();
        }
    };

    return (
        <div className="flex flex-col">
            <p className="mb-6 ">Are you sure you want to delete this company? This action cannot be undone.</p>
            <div className="flex gap-4">
                <Button
                    text="Cancel"
                    onClick={onClose}
                    fullWidth={false}
                    preview="secondary"
                    className="text-textDark"
                />
                <Button
                    text={isDeleting ? "Deleting..." : "Delete"}
                    onClick={handleDelete}
                    fullWidth={false}
                    isSubmitting={isDeleting}
                />
            </div>
        </div>
    );
};

export default DeleteCompanyForm;
