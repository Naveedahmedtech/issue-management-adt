import {  useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { useGetProjectActiveLogsQuery } from "../../../redux/features/projectsApi";
import { parseNewValueToList } from "../../../utils";
import SelectField from "../../../components/form/SelectField";

const IssueActivity = ({ projectId }: any) => {
    const [page, setPage] = useState(1);
    //   const [selectedIssue, setSelectedIssue] = useState<{ label: string; value: string } | null>(null);
    const [selectedType, setSelectedType] = useState<string>("");
    const limit = 10;


const queryArgs = useMemo(() => ({
  projectId,
  page,
  limit,
  type: selectedType || undefined,
}), [projectId, page, limit, selectedType]);

const { data, isLoading, isFetching, isError } = useGetProjectActiveLogsQuery(queryArgs);

    const handleNextPage = () => {
        if (data?.data.page < data?.data.totalPages) setPage((prev) => prev + 1);
    };

    const handlePreviousPage = () => {
        if (page > 1) setPage((prev) => prev - 1);
    };

    const renderBoolean = (value: string | null) => {
        if (value === "true") return <span className="text-success">Yes ✅</span>;
        if (value === "false") return <span className="text-error">No ❌</span>;
        return <span className="italic text-textSecondary">empty</span>;
    };

    const renderFileName = (path: string) => path?.split("/").pop();

    if (isLoading || isFetching) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="text-primary text-lg font-semibold">Loading activity logs...</div>
            </div>
        );
    }

    if (isError || !data?.data) {
        return <div className="text-error">Failed to load activity logs.</div>;
    }

    const { history, page: currentPage, totalPages } = data.data;

    return (
        <div className="rounded-lg shadow-md p-2">
            <div className="mb-4">
                <SelectField
                    label="Filter by Type"
                    options={[
                        { label: "All", value: "" },
                        { label: "Issues", value: "ISSUES" },
                        { label: "Checklist", value: "CHECKLIST" },
                    ]}
                    value={{ label: selectedType || "All", value: selectedType }}
                    onChange={(option) => {
                        setSelectedType(option?.value || "");
                        setPage(1);
                    }}
                />

            </div>

            {history.length === 0 ? (
                <div className="text-textDark h-64 flex justify-center items-center">
                    <p>No activity logs found for this project or issue.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {history.map((log: any) => {
                        const isChecklist = log.type === "CHECKLIST";
                        const isFile = log.fieldName === "attachmentFileId";
                        const isBoolean = log.fieldName === "answer";
                        const isDateField = log.fieldName === "startDate" || log.fieldName === "endDate";

                        const formattedOldValue = isDateField && log.oldValue
                            ? format(parseISO(log.oldValue), "PPP")
                            : log.oldValue || "empty";

                        const formattedNewValue = isDateField && log.newValue
                            ? format(parseISO(log.newValue), "PPP")
                            : log.newValue || "empty";

                        return (
                            <div
                                key={log.id}
                                className="p-4 bg-backgroundShade2 text-textDark rounded-md border border-border"
                            >
                                <p className="text-sm font-medium">
                                    {log.user.displayName} updated{" "}
                                    <span className="text-todo font-semibold">
                                        {isChecklist
                                            ? log.checklistItem?.question || "Checklist item"
                                            : log.issue?.title || "Issue"}
                                    </span>
                                </p>

                                {log.fieldName === "Issue Created" ? (
                                    <>
                                        <ul className="list-disc ml-6 text-sm mt-1">
                                            {parseNewValueToList(log.newValue).map(({ key, value }, i) => (
                                                <li key={i}>
                                                    <strong>{key}:</strong> {value || "empty"}
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-sm mt-1">
                                            <span className="font-medium">{log.fieldName === "answer" ? "Completed" : log.fieldName}</span>
                                        </p>
                                        <p className="text-sm">
                                            From:{" "}
                                            {isFile ? (
                                                log.oldFilePath ? (
                                                    <a
                                                        href={`/${log.oldFilePath}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="underline text-red-600"
                                                    >
                                                        {renderFileName(log.oldFilePath)}
                                                    </a>
                                                ) : (
                                                    <span className="text-textSecondary italic">empty</span>
                                                )
                                            ) : isBoolean ? (
                                                <span className="text-error line-through">{renderBoolean(log.oldValue)}</span>
                                            ) : (
                                                <span className="text-error line-through">{formattedOldValue}</span>
                                            )}
                                        </p>
                                        <p className="text-sm">
                                            To:{" "}
                                            {isFile ? (
                                                log.newFilePath ? (
                                                    <a
                                                        href={`/${log.newFilePath}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="underline text-green-600"
                                                    >
                                                        {renderFileName(log.newFilePath)}
                                                    </a>
                                                ) : (
                                                    <span className="text-textSecondary italic">none</span>
                                                )
                                            ) : isBoolean ? (
                                                <span className="text-success">{renderBoolean(log.newValue)}</span>
                                            ) : (
                                                <span className="text-success">{formattedNewValue}</span>
                                            )}
                                        </p>
                                    </>
                                )}

                                <p className="text-xs mt-2 text-textSecondary">
                                    {format(new Date(log.createdAt), "PPPpp")}
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex flex-wrap justify-between items-center mt-4">
                    <button
                        onClick={handlePreviousPage}
                        disabled={page === 1}
                        className={`px-4 py-2 rounded-md ${page === 1
                            ? "bg-backgroundShade2 text-textSecondary cursor-not-allowed"
                            : "bg-primary text-text border-2 border-primary hover:bg-transparent hover:text-primary"
                            }`}
                    >
                        Previous
                    </button>
                    <span className="text-sm text-textDark">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={handleNextPage}
                        disabled={page === totalPages}
                        className={`px-4 py-2 rounded-md ${page === totalPages
                            ? "bg-backgroundShade2 text-textSecondary cursor-not-allowed"
                            : "bg-primary text-text border-2 border-primary hover:bg-transparent hover:text-primary"
                            }`}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default IssueActivity;
