import { FiX } from "react-icons/fi";
import { BASE_URL } from "../../../../constant/BASE_URL";

const ChecklistItem = ({
  item,
  response,
  uploadedFile,
  dirty,
  saving,
  saved,
  onAnswer,
  onComment,
  onSave,
  onFileUpload,
  onDelete,
}: any) => {
  const isChecked = response?.answer === true;
  const hasFile = uploadedFile?.filePath?.endsWith(".pdf");

  return (
    <div className="bg-white border rounded-md p-3 flex flex-col gap-2 shadow-sm hover:shadow transition">
      <div className="flex justify-between items-start gap-2">
        <label className="flex items-start gap-2 text-sm text-gray-800 w-full cursor-pointer">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() => onAnswer(item.id, !isChecked)}
            className="mt-1 accent-blue-600"
          />
          <span className={isChecked ? "line-through text-gray-500" : ""}>
            {item.question}
          </span>
        </label>

        <button
          onClick={() => onDelete(item.id)}
          title="Delete item"
          className="text-gray-400 hover:text-red-600 p-1.5 rounded-full transition"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>

      <textarea
        rows={1}
        value={response?.comment || ""}
        placeholder="Add comment"
        onChange={(e) => onComment(item.id, e.target.value)}
        className="w-full text-sm p-2 border border-gray-300 rounded-md resize-none focus:ring-1 focus:ring-blue-500"
      />

      <div className="flex justify-between items-center text-xs text-gray-600">
        <label className="cursor-pointer text-blue-600 hover:underline">
          📎 Attach
          <input
            type="file"
            className="hidden"
            onChange={(e) => onFileUpload(item.id, e.target.files?.[0])}
          />
        </label>

        {hasFile && (
          <a
            href={`${BASE_URL}/${uploadedFile.filePath}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            📄 View PDF
          </a>
        )}
      </div>

      {dirty && (
        <div className="text-right">
          <button
            onClick={() => onSave(item.id)}
            disabled={saving}
            className="text-sm px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : saved ? "Saved" : "Save"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ChecklistItem;
