import { FiPlus } from "react-icons/fi";

const ChecklistHeader = ({ onAddClick }: { onAddClick: () => void }) => (
  <div className="flex justify-between items-center mb-2">
    <h2 className="text-base font-semibold text-text">Checklist Templates</h2>
    <button
      onClick={onAddClick}
      className="flex items-center gap-1 bg-primary text-white px-3 py-1 rounded-md text-sm hover:bg-primary/90 transition"
    >
      <FiPlus className="h-4 w-4" /> Add
    </button>
  </div>
);

export default ChecklistHeader;
