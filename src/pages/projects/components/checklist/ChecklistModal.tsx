import Button from "../../../../components/buttons/Button";
import ModalContainer from "../../../../components/modal/ModalContainer";

const ChecklistModal = ({
  isOpen,
  onClose,
  newQuestion,
  setNewQuestion,
  onAdd,
  isSubmitting,
}: any) => (
  <ModalContainer isOpen={isOpen} onClose={onClose} title="Add Checklist Item">
    <input
      type="text"
      value={newQuestion}
      onChange={(e) => setNewQuestion(e.target.value)}
      placeholder="Enter checklist item..."
      className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500"
    />
    <div className="flex justify-end mt-4 space-x-2">
      <Button text="Add" onClick={onAdd} fullWidth={false} isSubmitting={isSubmitting} />
    </div>
  </ModalContainer>
);

export default ChecklistModal;
