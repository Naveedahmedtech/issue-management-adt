// import {useEffect, useRef, useState} from "react";
// import Tabs from "../../../components/Tabs";
// import Documents from "../../../components/Board/Documents";
// import OrderInfo from "../components/OrderInfo.tsx";
// import {useLocation, useNavigate, useParams} from "react-router-dom";
// import ModalContainer from "../../../components/modal/ModalContainer.tsx";
// import {orderDocumentColumns} from "../../../utils/Common.tsx";
// import FileUpload from "../../../components/form/FileUpload";
// import {BsThreeDotsVertical} from "react-icons/bs";
// import Button from "../../../components/buttons/Button.tsx";
// import {
//     useDeleteOrderMutation,
//     useGetOrderByIdQuery,
//     useToggleArchiveMutation,
//     useUploadFilesToOrderMutation
// } from "../../../redux/features/orderApi.ts";
// import OrderDropDown from "../components/OrderDropDown.tsx";
// import {useAuth} from "../../../hooks/useAuth.ts";
// import {toast} from "react-toastify";
// import {APP_ROUTES} from "../../../constant/APP_ROUTES.ts";
// import {DocumentDataRow} from "../../../types/types.ts";
// import {ANGULAR_URL} from "../../../constant/BASE_URL.ts";
// import {FiRefreshCw} from "react-icons/fi";
// import {format} from "date-fns";

// const OrderDetails = () => {
//     const [activeTab, setActiveTab] = useState("info");
//     const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//     const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
//     const [isUnArchiveModalOpen, setIsUnArchiveModalOpen] = useState(false);
//     const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
//     const [isFileViewModalOpen, setIsFileViewModalOpen] = useState(false)
//     const [signatureModalOpen, setSignatureModalOpen] = useState(false);
//     const [selectedFile, setSelectedFile] = useState<DocumentDataRow | null>();
//     const [selectedFilePath, setSelectedFilePath] = useState<string | undefined>('');

//     const [files, setFiles] = useState<File[]>([]);
//     const [dropdownOpen, setDropdownOpen] = useState(false);
//     const dropdownRef = useRef<HTMLDivElement | null>(null);

//     const { userData } = useAuth();
//     const params = useParams();
//     const location = useLocation();
//     const onBackReset = location.state?.onBackReset;

//     const navigate = useNavigate();


//     const { userData: { id: userId, role, displayName: username } } = userData;
//     const { orderId: orderId } = params;
//     const isArchived = location.state?.archive;

//     const { data: orderData, isLoading: isOrderDataLoading, isFetching: isOrderDataRefetching, refetch: refetchOrders } = useGetOrderByIdQuery(orderId);

//     const [uploadFilesToOrder, { isLoading: isUploadingOrderFile }] = useUploadFilesToOrderMutation();
//     const [deleteOrder, { isLoading: isDeletingOrder }] = useDeleteOrderMutation();

//     const [archiveOrder, { isLoading: isArchiveOrder }] = useToggleArchiveMutation();


//     const handleSignFile = (file: DocumentDataRow) => {
//         navigate(`${APP_ROUTES.APP.PROJECTS.PDF_VIEWER}?userId=${userId}&username=${username}&orderId=${orderId}&fileId=${file?.id}&filePath=${file?.filePath}&isSigned=${file?.isSigned}`)
//     };

//     useEffect(() => {
//         const handleMessage = (event: MessageEvent) => {
//             if (event.origin !== ANGULAR_URL) return;

//             if (event.data?.type === 'SIGNATURE_SAVE') {
//                 refetchOrders();
//             }
//         };

//         window.addEventListener('message', handleMessage);
//         return () => window.removeEventListener('message', handleMessage);
//     }, []);

//     useEffect(() => {
//         if(onBackReset) {
//             setActiveTab('documents')
//         }
//     }, [onBackReset]);

//     useEffect(() => {
//         const handleMessage = (event: MessageEvent) => {
//             if (event.origin !== ANGULAR_URL) return;

//             if (event.data?.type === 'SIGNATURE_SAVE') {
//                 refetchOrders()
//             }
//         };

//         window.addEventListener('message', handleMessage);
//         return () => window.removeEventListener('message', handleMessage);
//     }, []);


//     const transformFilesData = (files: any[]) => {
//         return files.map((file) => {
//             const dateObj = new Date(file.updatedAt);

//             return {
//                 id: file.id,
//                 fileName: file.filePath.split("/").pop(),
//                 date: format(dateObj, "EEEE, MMMM do yyyy"),
//                 time: format(dateObj, "hh:mm a"),
//                 type: file.filePath.split(".").pop()?.toUpperCase() || "Unknown",
//                 location: "",
//                 status: "Pending",
//                 filePath: file.filePath,
//                 isSigned: file.isSigned
//             };
//         });
//     };

//     const handleFileView = (filePath: string | undefined) => {
//         setSelectedFilePath(filePath);
//         setIsFileViewModalOpen(true)
//     }


//     const documentColumns = orderDocumentColumns(handleSignFile, isArchived);

//     const tabs = [
//         { id: "info", label: "Order Info" },
//         { id: "documents", label: "Documents" },
//     ];

//     const handleOutsideClick = (event: MouseEvent) => {
//         if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//             setDropdownOpen(false);
//         }
//     };

//     const handleFileUpload = (uploadedFiles: File[]) => {
//         const allowedFileTypes = [".pdf", ".xlsx"]; // Allowed file extensions
//         const validFiles = uploadedFiles.filter((file) =>
//             allowedFileTypes.some((type) => file.name.endsWith(type))
//         );

//         const excludedFiles = uploadedFiles.filter(
//             (file) => !allowedFileTypes.some((type) => file.name.endsWith(type))
//         );

//         if (excludedFiles.length > 0) {
//             toast.error(
//                 `The following files were not allowed and excluded:\n${excludedFiles
//                     .map((file) => file.name)
//                     .join(", ")}`
//             );
//         }

//         setFiles((prevFiles) => [...prevFiles, ...validFiles]);
//     };

//     const handleUploadSubmit = async () => {
//         if (files.length === 0) {
//             toast.error("Please select at least one file to upload.");
//             return;
//         }

//         const formData = new FormData();
//         files.forEach((file) => {
//             formData.append("files", file);
//         });

//         try {
//             await uploadFilesToOrder({ orderId, formData }).unwrap();
//             toast.success("Files uploaded successfully!");
//             setFiles([]);
//             refetchOrders();
//             setIsUploadModalOpen(false);
//         } catch (error: any) {
//             console.error("Failed to upload files:", error);
//             toast.error(error?.data?.error?.message || "Failed to upload files. Please try again.");
//         }
//     };

//     useEffect(() => {
//         if (dropdownOpen) {
//             document.addEventListener("mousedown", handleOutsideClick);
//         } else {
//             document.removeEventListener("mousedown", handleOutsideClick);
//         }
//         return () => {
//             document.removeEventListener("mousedown", handleOutsideClick);
//         };
//     }, [dropdownOpen]);

//     const renderActiveTab = () => {
//         switch (activeTab) {
//             case "documents":
//                 return <></>
//                 // return (
//                 //     <Documents
//                 //         columns={documentColumns}
//                 //         data={transformFilesData(orderData?.data?.files || [])}
//                 //         setIsUploadModalOpen={setIsUploadModalOpen}
//                 //         isLoading={isOrderDataLoading || isOrderDataRefetching}
//                 //     />
//                 // );
//             case "info":
//                 return <OrderInfo data={orderData?.data} isLoading={isOrderDataLoading || isOrderDataRefetching} />;
//             default:
//                 return null;
//         }
//     };

//     const handleDelete = async () => {
//         try {
//             await deleteOrder(orderId).unwrap();

//             toast.success("Order deleted successfully!");
//             setIsDeleteModalOpen(false);
//             refetchOrders();
//             navigate(APP_ROUTES.APP.ORDERS.ALL)
//         } catch (error: any) {
//             console.error("Failed to delete order:", error);
//             toast.error("Failed to delete order. Please try again.");
//         }
//     };

//     const handleArchive = async () => {
//         try {
//             await archiveOrder(orderId);
//             toast.success("Order archived successfully!");
//             navigate(APP_ROUTES.APP.ORDERS.CREATE)
//         } catch (error) {
//             toast.error("Failed to archive order. Please try again.");

//         } finally {
//             setIsArchiveModalOpen(false);
//         }
//     };

//     const refetchData = () => {
//         refetchOrders();
//     };

//     return (
//         <main className="p-6">
//             <div className="flex flex-wrap justify-between items-center mb-4">
//                 <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
//                 <div ref={dropdownRef} className="relative">
//                     {
//                         !isArchived ?
//                             <div className="flex gap-x-2">
//                                 <button
//                                     onClick={refetchData} // Function to refetch data
//                                     className="inline-flex justify-center items-center rounded-md border border-border bg-background py-2 px-3 text-sm font-medium text-text hover:bg-backgroundShade1 focus:outline-none"
//                                     title="Refresh"
//                                 >
//                                     <FiRefreshCw className="text-xl" />
//                                 </button>
//                                 <button
//                                     onClick={() => setDropdownOpen((prev) => !prev)}
//                                     className="inline-flex justify-center w-full rounded-md border border-border bg-background py-2 px-4 text-sm font-medium text-text hover:bg-backgroundShade1 focus:outline-none"
//                                 >
//                                     <BsThreeDotsVertical className="text-xl" />
//                                 </button>
//                             </div>
//                             :
//                             <Button
//                                 text="Unarchive"
//                                 onClick={() => setIsUnArchiveModalOpen(true)}
//                             />
//                     }
//                     {dropdownOpen && (
//                         <OrderDropDown
//                             orderId={orderId}
//                             setIsDeleteModalOpen={setIsDeleteModalOpen}
//                             setIsArchiveModalOpen={setIsArchiveModalOpen}
//                             setIsUploadModalOpen={setIsUploadModalOpen}
//                             role={role}
//                         />
//                     )}
//                 </div>
//             </div>
//             <div>{renderActiveTab()}</div>

//             <ModalContainer
//                 isOpen={isDeleteModalOpen}
//                 onClose={() => setIsDeleteModalOpen(false)}
//                 title="Delete Order Confirmation"
//             >
//                 <p className="text-text">
//                     Are you sure you want to delete this Order? This action cannot be undone.
//                 </p>
//                 <div className="flex justify-end mt-6 space-x-4">
//                     <Button
//                         text={'Delete'}
//                         onClick={handleDelete}
//                         preview={'danger'}
//                         isSubmitting={isDeletingOrder}
//                     />
//                 </div>
//             </ModalContainer>

//             <ModalContainer
//                 isOpen={isArchiveModalOpen}
//                 onClose={() => setIsArchiveModalOpen(false)}
//                 title="Archive Project Confirmation"
//             >
//                 <p className="text-text">
//                     Are you sure you want to archive this Order?
//                 </p>
//                 <div className="flex justify-end mt-6 space-x-4">
//                     <Button
//                         text={'Archive'}
//                         onClick={handleArchive}
//                         fullWidth={false}
//                         isSubmitting={isArchiveOrder}
//                     />
//                 </div>
//             </ModalContainer>

//             <ModalContainer
//                 isOpen={isUnArchiveModalOpen}
//                 onClose={() => setIsUnArchiveModalOpen(false)}
//                 title="Archive Order Confirmation"
//             >
//                 <p className="text-text">
//                     Are you sure you want to unarchive this order?
//                 </p>
//                 <div className="flex justify-end mt-6 space-x-4">
//                     <Button
//                         text={'Unarchive'}
//                         onClick={handleArchive}
//                         fullWidth={false}
//                         isSubmitting={isArchiveOrder}
//                     />
//                 </div>
//             </ModalContainer>

//             <ModalContainer
//                 isOpen={isUploadModalOpen}
//                 onClose={() => setIsUploadModalOpen(false)}
//                 title="Upload Files"
//             >
//                 <FileUpload
//                     label="Upload Files (PDFs or Excel)"
//                     onChange={handleFileUpload}
//                     accept="application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//                     className="mb-4"
//                 />
//                 <div className="flex justify-end mt-6 space-x-4">
//                     <Button
//                         text={'Upload'}
//                         onClick={handleUploadSubmit}
//                         isSubmitting={isUploadingOrderFile}
//                     />
//                 </div>
//             </ModalContainer>
//         </main>
//     );
// };

// export default OrderDetails;
