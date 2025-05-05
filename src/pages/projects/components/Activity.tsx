import React, {useEffect, useState} from "react";
import {format, parseISO} from "date-fns";
import {useGetProjectActiveLogsQuery} from "../../../redux/features/projectsApi";
import {parseNewValueToList} from "../../../utils";
import SelectField from "../../../components/form/SelectField";

const Activity = ({ projectId, issues, issueId }: any) => {
    const [page, setPage] = useState(1);
    const [selectedIssue, setSelectedIssue] = useState<{ label: string; value: string } | null>(null); // State to hold selected issue
    const limit = 10;

    // Set the initial selected issue based on the issueId prop
    useEffect(() => {
        if (issueId) {
            const initialIssue = issues.find((issue: any) => issue.id === issueId);
            if (initialIssue) {
                setSelectedIssue({ label: initialIssue.title, value: initialIssue.id });
            }
        }
    }, [issueId, issues]);

    const { data, isLoading, isFetching, isError } = useGetProjectActiveLogsQuery({
        projectId,
        page,
        limit,
        issueId: selectedIssue ? selectedIssue.value : undefined, // issueId if selected
    });

    const handleNextPage = () => {
        if (data?.data.page < data?.data.totalPages) {
            setPage((prev) => prev + 1);
        }
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage((prev) => prev - 1);
        }
    };

    if (isLoading || isFetching) return (
        <div className="flex justify-center items-center min-h-[200px]">
            <div className="text-primary text-lg font-semibold">Loading activity logs...</div>
        </div>
    );

    if (isError || !data?.data) {
        return <div className="text-error">Failed to load activity logs.</div>;
    }

    const { history, page: currentPage, totalPages } = data.data;

    return (
        <div className=" rounded-lg shadow-md">
            {/* <h3 className="text-lg font-bold text-primary mb-4">Activity Logs</h3> */}

            {/* Dropdown to select issue */}
            <div className="mb-4">
                <SelectField
                    label="Select Issue to get more details"
                    options={[{ label: "All Issues", value: "" }, ...issues.map((issue: any) => ({
                        label: issue.title,
                        value: issue.id,
                    }))]}
                    value={selectedIssue} 
                    onChange={(option) => {
                        setSelectedIssue(option);
                        setPage(1); // Reset to the first page when selecting a new issue
                    }}
                />
            </div>

            {history.length === 0 ? (
                <div className="text-text">No activity logs found for this project or issue.</div>
            ) : (
                <div className="space-y-4">
                    {history.map((log: any) => {
                        const isDateField = log.fieldName === "startDate" || log.fieldName === "endDate";
                        const formattedOldValue = isDateField && log.oldValue
                            ? format(parseISO(log.oldValue), "PPP")
                            : log.oldValue || "N/A";
                        const formattedNewValue = isDateField && log.newValue
                            ? format(parseISO(log.newValue), "PPP")
                            : log.newValue || "N/A";

                        return (
                            <div
                                key={log.id}
                                className="p-4 bg-backgroundShade1 rounded-md border border-border"
                            >
                                <p className="text-sm text-text">
                                    <strong className="text-text">{log.user.displayName}</strong>{" "}
                                    {
                                        log?.fieldName !== "Issue Created" ? (
                                            <>
                                                <span className="text-textSecondary">updated</span> {' '}
                                                <strong className="text-todo">{log.fieldName}</strong>
                                            </>
                                        ) : (
                                            <strong className="text-todo">created this issue</strong>
                                        )
                                    }
                                </p>
                                {
                                    log?.fieldName === "Issue Created" ? (
                                        <>
                                            <ul className="list-disc ml-6 text-sm text-text">
                                                {parseNewValueToList(log.newValue).map(({ key, value }, index) => (
                                                    <li key={index}>
                                                        <strong>{key}:</strong> {value}
                                                    </li>
                                                ))}
                                            </ul>
                                            <p className="text-xs text-text">
                                                {format(new Date(log.createdAt), "PPPpp")}
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-sm text-text">
                                                From:{" "}
                                                <span className="italic text-pending">{formattedOldValue}</span>{" "}
                                                To: <span className="italic text-success">{formattedNewValue}</span>
                                            </p>
                                            <p className="text-xs text-text">
                                                {format(new Date(log.createdAt), "PPPpp")}
                                            </p>
                                        </>
                                    )
                                }
                            </div>
                        );
                    })}
                </div>
            )}
            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex flex-wrap justify-between items-center mt-4">
                    <button
                        onClick={handlePreviousPage}
                        disabled={page === 1}
                        className={`px-4 py-2 rounded-md   ${page === 1
                            ? "bg-backgroundShade2 text-text cursor-not-allowed "
                            : "bg-primary text-background border-2 border-primary hover:bg-transparent hover:text-primary"
                            }`}
                    >
                        Previous
                    </button>
                    <span className="text-sm text-text">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={handleNextPage}
                        disabled={page === totalPages}
                        className={`px-4 py-2 rounded-md ${page === totalPages
                            ? "bg-backgroundShade2 text-text cursor-not-allowed"
                            : "bg-primary text-background border-2 border-primary  hover:bg-transparent hover:text-primary"
                            }`}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default Activity;
