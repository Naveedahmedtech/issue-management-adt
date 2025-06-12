import React, { useState } from "react";
import { format } from "date-fns";
import { useGetChecklistLogsByProjectQuery } from "../../../redux/features/checklistApi";

const ChecklistActivity = ({ projectId }: { projectId: string }) => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isFetching, isError } = useGetChecklistLogsByProjectQuery({
    projectId,
    page,
    limit,
  });

  if (isLoading || isFetching) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-primary text-lg font-semibold">Loading checklist activity...</div>
      </div>
    );
  }

  if (isError || !data?.data) {
    return <div className="text-error">Failed to load checklist activity logs.</div>;
  }

  const { logs, page: currentPage, totalPages } = data.data;

  const handleNextPage = () => {
    if (currentPage < totalPages) setPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  if (!logs.length) return <div className="text-text">No checklist activity found.</div>;

  return (
    <div className="rounded-lg shadow-md p-2">
      <div className="space-y-4">
        {logs.map((log: any) => {
          const isFile = log.changedField === "attachmentFileId";
          const isBoolean =
            log.changedField === "answer" &&
            (log.newValue === "true" || log.newValue === "false");

          const getFileName = (path: string) => path?.split("/").pop();

          const renderBoolean = (value: string | null) => {
            if (value === "true") return <span className="text-success">Yes ✅</span>;
            if (value === "false") return <span className="text-error">No ❌</span>;
            return <span className="italic text-textSecondary">empty</span>;
          };

          return (
            <div
              key={log.id}
              className="p-4 bg-backgroundShade2 text-textDark rounded-md border border-border"
            >
              <p className="text-sm">
                <strong>{log.changedBy.displayName}</strong>{" "}
                <span className="text-textSecondary">updated</span>{" "}
                <strong className="text-todo">{log.checklistItem.question}</strong>
              </p>

              <p className="text-sm mt-1">
                <span className="font-medium">{log.changedField === "answer" ? "Completed" : log.changedField}</span>:
                {isFile ? (
                  <>
                    {" "}
                    <span className="italic text-pending">
                      {log.oldFilePath ? (
                        <a
                          href={`/${log.oldFilePath}`}
                          target="_blank"
                          rel="noreferrer"
                          className="underline text-red-600"
                        >
                          {getFileName(log.oldFilePath)}
                        </a>
                      ) : (
                        " none"
                      )}
                    </span>{" "}
                    →{" "}
                    <span className="italic text-success">
                      {log.newFilePath ? (
                        <a
                          href={`/${log.newFilePath}`}
                          target="_blank"
                          rel="noreferrer"
                          className="underline text-green-600"
                        >
                          {getFileName(log.newFilePath)}
                        </a>
                      ) : (
                        " none"
                      )}
                    </span>
                  </>
                ) : isBoolean ? (
                  <>
                    {" "}
                    <span className="line-through text-error">{renderBoolean(log.oldValue)}</span>{" "}
                    → {renderBoolean(log.newValue)}
                  </>
                ) : (
                  <>
                    {" "}
                    <span className="line-through text-error">{log.oldValue || "empty"}</span>{" "}
                    → <span className="text-success">{log.newValue || "empty"}</span>
                  </>
                )}
              </p>

              <p className="text-xs mt-1 text-textSecondary">
                {format(new Date(log.createdAt), "PPPpp")}
              </p>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-wrap justify-between items-center mt-4">
          <button
            onClick={handlePreviousPage}
            disabled={page === 1}
            className={`px-4 py-2 rounded-md ${
              page === 1
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
            className={`px-4 py-2 rounded-md ${
              page === totalPages
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

export default ChecklistActivity;
