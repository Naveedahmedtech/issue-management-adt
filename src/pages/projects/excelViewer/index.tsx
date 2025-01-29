import { useLocation } from "react-router-dom";
import { HotTable } from "@handsontable/react";
import * as XLSX from "xlsx"; // SheetJS to parse Excel files
import { useState } from "react";
import Button from "../../../components/buttons/Button";
import 'handsontable/styles/handsontable.min.css';
import 'handsontable/styles/ht-theme-main.min.css';
import { toast } from "react-toastify";
import { useUpdateFileMutation } from "../../../redux/features/projectsApi";


function ExcelViewer() {
  const location = useLocation();
  const { excelData, modifiedData: initialModifiedData, theme, selectedFile, projectId } = location.state || {};
  const [modifiedData, setModifiedData] = useState(initialModifiedData || []);

  console.log(selectedFile, projectId)

    const [updateFile, { isLoading: isUpdateFile }] = useUpdateFileMutation();
  

  const saveExcelFile = async () => {
    if (selectedFile) {

      try {
        // Convert modified data to a worksheet
        const worksheet = XLSX.utils.aoa_to_sheet(modifiedData);

        // Create a new workbook and append the worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        // Generate a Blob for the Excel file
        const excelData = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelData], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        // Prepare the FormData object
        const formData = new FormData();
        formData.append("files", blob, selectedFile.fileName);

        if (selectedFile.type === "issueFile" && selectedFile?.issue?.id) {
          formData.append("issueId", selectedFile.issue.id);
        } else if (selectedFile.type !== "issueFile" && projectId) {
          formData.append("projectId", projectId);
        } else {
          throw new Error("Invalid file type or missing project/issue ID");
        }

        if (selectedFile.id) {
          // Perform the update API call
          await updateFile({ fileId: selectedFile.id, formData }).unwrap();
          toast.success("Changes saved to the file successfully!");
        } else {
          throw new Error("File ID is missing for the selected file.");
        }
      } catch (error) {
        console.error("Error saving the file:", error);

        // Display a user-friendly error message
        toast.error(
          "An error occurred while saving the file. Please check the data and try again."
        );
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Excel Viewer</h1>
      {excelData && modifiedData.length > 0 ? (
        <>
          <HotTable
            data={modifiedData}
            colHeaders={true}
            rowHeaders={true}
            stretchH="all"
            width="100%"
            height="500px"
            licenseKey="non-commercial-and-evaluation"
            colWidths={150}
            afterChange={(changes, source) => {
              if (changes && source !== "loadData") {
                const updatedData = [...modifiedData];
                changes.forEach(([row, prop, _, newVal]) => {
                  if (typeof prop === "string" || typeof prop === "number") {
                    updatedData[row][prop] = newVal;
                  }
                });
                setModifiedData(updatedData);
              }
            }}
            themeName={`${theme === "dark" ? "ht-theme-main-dark-auto" : ""}`}
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button
              text="Save Changes"
              onClick={saveExcelFile}
              fullWidth={false}
              isSubmitting={isUpdateFile}
            />
          </div>
        </>
      ) : (
        <p>No data available to display</p>
      )}
    </div>
  );
}

export default ExcelViewer;
