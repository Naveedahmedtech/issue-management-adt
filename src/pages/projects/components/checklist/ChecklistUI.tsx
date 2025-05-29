import { FiPaperclip, FiPlus, FiTrash2 } from "react-icons/fi";
import ModalContainer from "../../../../components/modal/ModalContainer";
import Button from "../../../../components/buttons/Button";
import { BASE_URL } from "../../../../constant/BASE_URL";
import { useState } from "react";


const ChecklistUI = ({
    templateData,
    selectedEntry,
    setSelectedEntry,
    checklistData,
    responses,
    dirty,
    saving,
    saved,
    uploadedFiles,
    showAddModal,
    setShowAddModal,
    newQuestion,
    setNewQuestion,
    handleAnswer,
    handleComment,
    handleSave,
    handleAddItem,
    handleFileUpload,
    loadingItems,
    isAppendingLoading,
    loadingTemplates,
    isUploading,
    handleDeleteItem,
    uploadingMap
}: any) => {
    const [deleteItemId, setDeleteItemId] = useState<string | null>(null);

    return (
        <div className="p-4 space-y-4 text-textDark bg-backgroundShade2">
            {templateData.data.length === 0 ? (
                <p className="text-sm  italic">No templates available</p>
            ) : (
                <>
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-base font-semibold ">Checklist Templates</h2>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-1 bg-primary text-white px-3 py-1 rounded-md text-sm hover:bg-primary/90 transition"
                        >
                            <FiPlus className="h-4 w-4" /> Add
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                        <aside className="space-y-2 sticky top-4 self-start max-h-[80vh] overflow-y-auto pr-1">
                            {loadingTemplates ? (
                                <p className="text-sm italic text-gray-500">Loading templates...</p>
                            ) : (
                                templateData.data.map((entry: any) => (
                                    <button
                                        key={entry.id}
                                        onClick={() => setSelectedEntry(entry)}
                                        className={`w-full text-left px-3 py-2 rounded-md text-sm ${entry.id === selectedEntry?.id
                                            ? "bg-backgroundShade1 text-text"
                                            : "bg-background text-textDark hover:bg-backgroundShade2"
                                            }`}
                                    >
                                        {entry.template.name}
                                    </button>
                                ))
                            )}
                        </aside>


                        <main className="lg:col-span-3 space-y-3">
                            {loadingItems ? (
                                <p className="text-sm">Loading items...</p>
                            ) : (
                                checklistData.data.items.map((item: any) => {
                                    const isChecked = responses[item.id]?.answer === true;
                                    const hasFile = uploadedFiles[item.id]?.filePath?.endsWith(".pdf");

                                    return (
                                        <div
                                            key={item.id}
                                            className="bg-white border rounded-md p-3 flex flex-col gap-2 shadow-sm hover:shadow transition"
                                        >
                                            <div className="flex justify-between items-start gap-2">
                                                <label className="flex items-start gap-2 text-sm text-gray-800 w-full cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={() => handleAnswer(item.id, !isChecked)}
                                                        className="mt-1 accent-blue-600"
                                                    />
                                                    <span className={isChecked ? "line-through text-gray-500" : ""}>
                                                        {item.question}
                                                    </span>
                                                </label>
                                                <button
                                                    onClick={() => setDeleteItemId(item.id)}
                                                    title="Delete item"
                                                    className="text-gray-400 hover:text-red-600 p-1.5 rounded-full transition"
                                                >
                                                    <FiTrash2 className="text-red-600" />
                                                </button>

                                            </div>

                                            <textarea
                                                rows={1}
                                                value={responses[item.id]?.comment || ""}
                                                placeholder="Add comment"
                                                onChange={(e) => handleComment(item.id, e.target.value)}
                                                className="w-full text-sm p-2 border border-gray-300 rounded-md resize-none focus:ring-1 focus:ring-blue-500"
                                            />

                                            <div className="flex justify-between items-center text-xs text-gray-600">
                                                <label className={`flex items-center cursor-pointer ${isUploading ? "opacity-50 pointer-events-none" : "text-blue-600 hover:underline"}`}>
                                                    <FiPaperclip className="text-xs" /> Attach Document
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        disabled={uploadingMap[item.id]}
                                                        accept="application/pdf"
                                                        onChange={(e) => handleFileUpload(item.id, e.target.files?.[0])}
                                                    />
                                                </label>
                                                {uploadingMap[item.id] && <span className="text-xs italic">Uploading...</span>}
                                                {hasFile && (
                                                    <a
                                                        href={`${BASE_URL}/${uploadedFiles[item.id].filePath}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        📄 View PDF
                                                    </a>
                                                )}
                                            </div>

                                            {dirty[item.id] && (
                                                <div className="text-right">
                                                    <button
                                                        onClick={() => handleSave(item.id)}
                                                        disabled={saving[item.id]}
                                                        className="text-sm px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                                                    >
                                                        {saving[item.id]
                                                            ? "Saving..."
                                                            : saved[item.id]
                                                                ? "Saved"
                                                                : "Save"}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </main>
                    </div>
                </>
            )}

            {showAddModal && (
                <ModalContainer
                    isOpen={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    title="Add Checklist Item"
                >
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleAddItem();
                        }}
                    >
                        <input
                            type="text"
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                            placeholder="Enter checklist item..."
                            className="w-full p-2 text-sm bg-hover border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500"
                        />
                        <div className="flex justify-end mt-4 space-x-2">
                            <Button
                                text="Add"
                                onClick={handleAddItem}
                                fullWidth={false}
                                isSubmitting={isAppendingLoading}
                                type="submit"
                            />
                        </div>
                    </form>
                </ModalContainer>

            )}
            {deleteItemId && (
                <ModalContainer
                    isOpen={!!deleteItemId}
                    onClose={() => setDeleteItemId(null)}
                    title="Confirm Delete"
                >
                    <p className="text-sm text-text">Are you sure you want to delete this checklist item?</p>
                    <div className="flex justify-end mt-4 space-x-2">
                        <Button
                            text="Cancel"
                            onClick={() => setDeleteItemId(null)}
                            fullWidth={false}
                        />
                        <Button
                            text="Delete"
                            onClick={() => {
                                handleDeleteItem(deleteItemId);
                                setDeleteItemId(null);
                            }}
                            fullWidth={false}
                            preview="danger"
                        />
                    </div>
                </ModalContainer>
            )}

        </div>
    );
};

export default ChecklistUI;
