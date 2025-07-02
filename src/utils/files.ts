    // const handleDownloadFile = async (file: DocumentDataRow) => {
    //     toast.info("Downloading file, please wait...");
    //     const type = file.type === 'projectFile' ? 'project' : 'issue';
    //     try {
    //         const response = await fetch(
    //             `${BASE_URL}${API_ROUTES.PROJECT.ROOT}/${API_ROUTES.PROJECT.FILES}/${file.id}/${API_ROUTES.PROJECT.DOWNLOAD}?type=${type}`,
    //             {
    //                 method: "GET",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 },
    //                 credentials: 'include'
    //             }
    //         );

    //         if (!response.ok) {
    //             console.log("ERRR!!!", response)
    //             throw new Error("Failed to download file");
    //         }

    //         const blob = await response.blob();
    //         const url = window.URL.createObjectURL(blob);

    //         // Create an anchor and trigger the download
    //         const a = document.createElement("a");
    //         a.href = url;
    //         a.download = file.fileName;
    //         document.body.appendChild(a);
    //         a.click();
    //         a.remove();

    //         toast.success("File downloaded successfully!");
    //     } catch (error) {
    //         console.error("Download error:", error);
    //         toast.error("Failed to download the file.");
    //     }
    // };
