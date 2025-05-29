import { useEffect, useState, FC } from "react";
import { skipToken } from "@reduxjs/toolkit/query/react";
import {
    useGetProjectAllTemplatesQuery,
    useGetProjectChecklistsQuery,
    useAnswerToChecklistItemsMutation,
    useAppendItemsToProjectChecklistMutation,
    useUploadFileToChecklistItemsMutation,
    useDeleteChecklistItemsMutation
} from "../../../redux/features/checklistApi";
import ChecklistUI from "./checklist/ChecklistUI";

interface ChecklistProps {
    projectId: any;
    isArchived: boolean
}
interface ResponseItem {
    answer: boolean | null;
    comment: string;
}

const Checklist: FC<ChecklistProps> = ({ projectId, isArchived }) => {
    const { data: templateData = { data: [] } as any, isLoading: loadingTemplates } =
        useGetProjectAllTemplatesQuery({ projectId });
    const [selectedEntry, setSelectedEntry] = useState<any>(null);
    const [uploadedFiles, setUploadedFiles] = useState<Record<string, any>>({});
    const [uploadingMap, setUploadingMap] = useState<Record<string, boolean>>({});


    useEffect(() => {
        if (templateData.data?.length) {
            setSelectedEntry(templateData.data[0]);
        }
    }, [templateData]);

    const {
        data: checklistData = { data: { items: [] } } as any,
        isLoading: loadingItems,
    } = useGetProjectChecklistsQuery(
        selectedEntry ? { projectId, checklistId: selectedEntry.id } : skipToken
    );

    const [responses, setResponses] = useState<Record<string, ResponseItem>>({});
    const [dirty, setDirty] = useState<Record<string, boolean>>({});
    const [saving, setSaving] = useState<Record<string, boolean>>({});
    const [saved, setSaved] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const initial: Record<string, ResponseItem> = {};
        const fileMap: Record<string, any> = {};

        checklistData.data.items.forEach((item: any) => {
            initial[item.id] = { answer: item.answer, comment: item.comment || "" };

            if (item.attachmentFile?.filePath?.endsWith(".pdf")) {
                fileMap[item.id] = item.attachmentFile;
            }
        });

        setResponses(initial);
        setUploadedFiles(fileMap);
    }, [checklistData]);


    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    const [newQuestion, setNewQuestion] = useState<string>("");

    const [appendItems, { isLoading: isAppendingLoading }] = useAppendItemsToProjectChecklistMutation();
    const [saveResponse] = useAnswerToChecklistItemsMutation();

    const [uploadFileToItem, { isLoading: isUploading }] = useUploadFileToChecklistItemsMutation();

    const [deleteChecklistItem] = useDeleteChecklistItemsMutation();



    const handleAnswer = async (id: string, answer: boolean) => {
        setResponses((prev) => ({
            ...prev,
            [id]: { ...prev[id], answer },
        }));

        // Use latest answer directly instead of reading stale state
        const comment = responses[id]?.comment || "";
        try {

            await saveResponse({
                projectId,
                checklistId: selectedEntry.id,
                itemId: id,
                body: { answer, comment },
            });

            setSaved((prev) => ({ ...prev, [id]: true }));
            setDirty((prev) => ({ ...prev, [id]: false }));
            setTimeout(() => setSaved((prev) => ({ ...prev, [id]: false })), 1500);
        } catch (error) {
            console.log('error', error)
        } finally {
            setSaving((prev) => ({ ...prev, [id]: false }));
        }
    };


    const handleComment = (id: string, comment: string) => {
        setResponses((prev) => ({ ...prev, [id]: { ...prev[id], comment } }));
        setDirty((prev) => ({ ...prev, [id]: true }));
    };

    const handleSave = async (id: string, passDirt = false) => {
        const { answer, comment } = responses[id] ?? {};
        console.log('responses[id]', responses[id])
        if ((!dirty[id] && !passDirt) || answer == null) return;

        setSaving((prev) => ({ ...prev, [id]: true }));
        try {
            await saveResponse({
                projectId,
                checklistId: selectedEntry.id,
                itemId: id,
                body: { answer, comment },
            });
            setSaved((prev) => ({ ...prev, [id]: true }));
            setDirty((prev) => ({ ...prev, [id]: false }));
            setTimeout(() => setSaved((prev) => ({ ...prev, [id]: false })), 1500);
        } catch (error) {
            console.log('error', error)
        } finally {
            setSaving((prev) => ({ ...prev, [id]: false }));
        }
    };

    const handleAddItem = async () => {
        if (!newQuestion.trim() || !selectedEntry) return;
        await appendItems({ templateId: selectedEntry.template.id, projectId, body: { items: [{ question: newQuestion.trim() }] } });
        setNewQuestion("");
        setShowAddModal(false);
    };

    const handleFileUpload = async (itemId: string, file?: File) => {
        if (!file) return;

        const formData = new FormData();
        formData.append("files", file);
        setUploadingMap(prev => ({ ...prev, [itemId]: true }));
        try {
            const res = await uploadFileToItem({
                projectId,
                itemId,
                body: formData,
            }).unwrap();

            const uploaded = res?.data?.createdFiles?.[0];

            if (uploaded && uploaded.filePath?.endsWith(".pdf")) {
                setUploadedFiles((prev) => ({
                    ...prev,
                    [itemId]: uploaded,
                }));
            }
        } catch (err) {
            console.error("File upload failed", err);
        } finally {
            setUploadingMap(prev => ({ ...prev, [itemId]: false }));
        }
    };

    const handleDeleteItem = async (itemId: string) => {
        if (!selectedEntry) return;
        try {
            await deleteChecklistItem({
                projectId,
                checklistId: selectedEntry.id,
                itemId,
            }).unwrap();
        } catch (error) {
            console.error("Failed to delete checklist item", error);
        }
    };




    return (
        <>
            {
                !isArchived &&
                <ChecklistUI
                    templateData={templateData}
                    selectedEntry={selectedEntry}
                    setSelectedEntry={setSelectedEntry}
                    checklistData={checklistData}
                    responses={responses}
                    dirty={dirty}
                    setDirty={setDirty}
                    saving={saving}
                    saved={saved}
                    uploadedFiles={uploadedFiles}
                    showAddModal={showAddModal}
                    setShowAddModal={setShowAddModal}
                    newQuestion={newQuestion}
                    setNewQuestion={setNewQuestion}
                    handleAnswer={handleAnswer}
                    handleComment={handleComment}
                    handleSave={handleSave}
                    handleAddItem={handleAddItem}
                    handleFileUpload={handleFileUpload}
                    loadingItems={loadingItems}
                    isAppendingLoading={isAppendingLoading}
                    loadingTemplates={loadingTemplates}
                    isUploading={isUploading}
                    handleDeleteItem={handleDeleteItem}
                    uploadingMap={uploadingMap}
                />
            }
        </>
    );

};

export default Checklist;
