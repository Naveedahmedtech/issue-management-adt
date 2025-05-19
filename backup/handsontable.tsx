// import {useEffect, useState} from "react";
// import Table from "../Table";
// import {BASE_URL} from "../../constant/BASE_URL";
// import * as XLSX from "xlsx";
// import 'handsontable/styles/handsontable.min.css';
// import 'handsontable/styles/ht-theme-main.min.css';
// import {useUpdateFileMutation} from "../../redux/features/projectsApi";
// import {toast} from "react-toastify";
// import {DocumentDataRow} from "../../types/types";
// import {useTheme} from "../../context/ThemeContext";
// import DocumentsCardList from "./DocumentsCardList.tsx";

// const Documents = ({
//   columns,
//   data,
//   isLoading,
//   selectedFile,
//   projectIdForNow,
//   refetch
// }: {
//   columns: any;
//   data: any;
//   setIsUploadModalOpen: any;
//   isLoading: boolean;
//   selectedFile?: DocumentDataRow | null;
//   projectIdForNow?: string;
//   refetch?: () => void;
// }) => {
//   const [excelData, setExcelData] = useState<any[]>([]);
//   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
//   const [modifiedData, setModifiedData] = useState<any[]>([]);

//   const { theme } = useTheme();

//   const [updateFile, { isLoading: isUpdateFile }] = useUpdateFileMutation();

//   useEffect(() => {
//     if (selectedFile?.filePath) {
//       fetchExcelFile(selectedFile.filePath);
//     } else {
//       setExcelData([]); // Clear the data when no file is selected
//       setModifiedData([]);
//     }
//   }, [selectedFile]);


//   useEffect(() => {
//     if (!isModalOpen) {
//       setExcelData([]); // Clear data when modal is closed
//       setModifiedData([]);
//     }
//   }, [isModalOpen]);

//   // Function to load and parse the Excel file using XLSX
//   const fetchExcelFile = async (filePath: string) => {
//     try {
//       const response = await fetch(`${BASE_URL}/${filePath}`);
//       const blob = await response.blob();
//       const reader = new FileReader();

//       reader.onload = (e) => {
//         const data = new Uint8Array(e.target?.result as ArrayBuffer);
//         const workbook = XLSX.read(data, { type: "array" });
//         const sheetName = workbook.SheetNames[0];
//         const sheet = workbook.Sheets[sheetName];
//         const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Convert to 2D array
//         setExcelData(jsonData);
//         setModifiedData(jsonData);
//         setIsModalOpen(true);
//       };

//       reader.readAsArrayBuffer(blob);
//     } catch (error) {
//       console.error("Error fetching the Excel file:", error);
//     }
//   };

//   // Function to save the modified Excel data back to the backend
//   const saveExcelFile = async () => {
//     if (selectedFile) {

//       try {
//         // Convert modified data to a worksheet
//         const worksheet = XLSX.utils.aoa_to_sheet(modifiedData);

//         // Create a new workbook and append the worksheet
//         const workbook = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

//         // Generate a Blob for the Excel file
//         const excelData = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
//         const blob = new Blob([excelData], {
//           type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//         });

//         // Prepare the FormData object
//         const formData = new FormData();
//         formData.append("files", blob, selectedFile.fileName);

//         if (selectedFile.type === "issueFile" && selectedFile?.issue?.id) {
//           formData.append("issueId", selectedFile.issue.id);
//         } else if (selectedFile.type !== "issueFile" && projectIdForNow) {
//           formData.append("projectId", projectIdForNow);
//         } else {
//           throw new Error("Invalid file type or missing project/issue ID");
//         }

//         if (selectedFile.id) {
//           // Perform the update API call
//           await updateFile({ fileId: selectedFile.id, formData }).unwrap();
//           if (refetch) {
//             refetch();
//           }
//           toast.success("Changes saved to the file successfully!");
//         } else {
//           throw new Error("File ID is missing for the selected file.");
//         }
//       } catch (error) {
//         console.error("Error saving the file:", error);

//         // Display a user-friendly error message
//         toast.error(
//           "An error occurred while saving the file. Please check the data and try again."
//         );
//       } finally {
//         setIsModalOpen(false);
//       }
//     }
//   };

//   return (
//     <div className="bg-background min-h-screen">
//       {isLoading ? (
//         <div className="flex justify-center items-center min-h-[200px]">
//           <div className="text-primary text-lg font-semibold">Loading documents...</div>
//         </div>
//       ) : (
//         <>
//           <div className="flex justify-center items-center min-h-[200px]">
//             {data && data.length > 0 ? (
//                 <>
//                   {/* Desktop (md and up) */}
//                   <div className="hidden md:block w-full">
//                     <Table
//                         columns={columns}
//                         data={data}
//                     />
//                   </div>

//                   {/* Mobile (below md) */}
//                   <div className="block md:hidden w-full">
//                     <DocumentsCardList
//                         data={data}
//                         columns={columns}
//                     />
//                   </div>
//                 </>
//             ) : (
//               <div className="text-textLight text-lg font-medium">No documents available.</div>
//             )}
//           </div>

//           {/* Modal for Excel Viewer */}
//           {/*<LargeModal*/}
//           {/*  isOpen={isModalOpen}*/}
//           {/*  onClose={() => setIsModalOpen(false)}*/}
//           {/*  title="Excel Viewer"*/}
//           {/*>*/}
//           {/*  <Link*/}
//           {/*    to={{*/}
//           {/*      pathname: APP_ROUTES.APP.PROJECTS.EXCEL_VIEWER,*/}
//           {/*    }}*/}
//           {/*    state={{*/}
//           {/*      excelData,*/}
//           {/*      modifiedData,*/}
//           {/*      theme,*/}
//           {/*      selectedFile,*/}
//           {/*      projectId: projectIdForNow,*/}
//           {/*    }}*/}
//           {/*    className="underline ml-5 text-textSecondary"*/}
//           {/*  >*/}
//           {/*    Open New Page*/}
//           {/*  </Link>*/}
//           {/*  {excelData.length > 0 && (*/}
//           {/*    <>*/}
//           {/*      <HotTable*/}
//           {/*        data={modifiedData}*/}
//           {/*        colHeaders={true}*/}
//           {/*        rowHeaders={true}*/}
//           {/*        stretchH="all"*/}
//           {/*        width="100%"*/}
//           {/*        height="500px"*/}
//           {/*        licenseKey="non-commercial-and-evaluation"*/}
//           {/*        colWidths={150}*/}
//           {/*        afterChange={(changes, source) => {*/}
//           {/*          if (changes && source !== "loadData") {*/}
//           {/*            const updatedData = [...modifiedData];*/}
//           {/*            changes.forEach(([row, prop, _, newVal]) => {*/}
//           {/*              if (typeof prop === "string" || typeof prop === "number") {*/}
//           {/*                updatedData[row][prop] = newVal;*/}
//           {/*              }*/}
//           {/*            });*/}
//           {/*            setModifiedData(updatedData);*/}
//           {/*          }*/}
//           {/*        }}*/}
//           {/*        themeName={`${theme === "dark" ? "ht-theme-main-dark-auto" : ""}`}*/}
//           {/*      />*/}
//           {/*      <Button*/}
//           {/*        text="Save Changes"*/}
//           {/*        onClick={saveExcelFile}*/}
//           {/*        isSubmitting={isUpdateFile}*/}
//           {/*        fullWidth={false}*/}
//           {/*      />*/}
//           {/*    </>*/}
//           {/*  )}*/}
//           {/*</LargeModal>*/}
//         </>
//       )}
//     </div>
//   );
// };

// export default Documents;
