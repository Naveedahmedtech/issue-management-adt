import React, {useEffect, useRef} from 'react';
import {ANGULAR_URL, BASE_URL} from '../../constant/BASE_URL.ts';

const AnnotationIframe = ({ userId, selectedFile, projectId, username }: any) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const fileId = selectedFile?.id;
    const filePath = selectedFile?.filePath;
    const isInvalidParams = !fileId || !filePath || !projectId || !userId;

    // const fullFileUrl = `https://backend.viewsoft.com/uploads/projects/Small-Handwriting-set.pdf`;

    const fullFileUrl = `${BASE_URL}/${filePath}`;
    const sendFileToIframe = () => {
        if (typeof window !== 'undefined' && iframeRef.current?.contentWindow) {
            const fileObj = {
                filepath: fullFileUrl,
                cacheid: fileId,
                // displayname: 'Sample Document',
                mime: 'application/pdf'
            };

            iframeRef.current.contentWindow.postMessage(
                { type: 'view', payload: fileObj, metadata: { username, projectId, userId } },
                ANGULAR_URL
            );
            // iframeRef.current?.contentWindow.postMessage(
            //     {
            //         type: "guiMode",
            //         payload: {
            //             mode: "annotation" // or "annotation"
            //         }
            //     },
            //     ANGULAR_URL
            // );


            console.log("Sent file object via postMessage:", fileObj);
        }
    };

    const handleIframeLoad = () => {
        sendFileToIframe();
    };

    const handleIframeError = () => {
    };

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== ANGULAR_URL) return;

            if (event.data?.type === 'ANNOTATION_SAVE') {
                console.log('Annotation data received:', event.data.payload);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);


    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
            {isInvalidParams ? (
                <div className="flex justify-center items-center min-h-[200px] text-red-500 font-semibold">
                    Missing required parameters. Please select a valid file.
                </div>
            ) : (
                <iframe
                    ref={iframeRef}
                    src={`${ANGULAR_URL}`}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    title="Rasterex Viewer"
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                    id="rxview"
                />
            )}
        </div>
    );
};

export default AnnotationIframe;
