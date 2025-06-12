import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ANGULAR_URL, BASE_URL } from '../../constant/BASE_URL.ts';
import { IAnnotationProps, Metadata } from "../../types/types.ts";

const AnnotationIframe = ({ userId, filePath, fileId, projectId, username, orderId, isSigned }: IAnnotationProps) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const navigate = useNavigate();

    const isInvalidParams = !fileId || !filePath || !userId;
    const fullFileUrl = `${BASE_URL}/${filePath}`;

    const sendFileToIframe = () => {
        if (typeof window !== 'undefined' && iframeRef.current?.contentWindow) {
            const fileObj = {
                // filepath: fullFileUrl,
                filepath: "https://backend.viewsoft.com/uploads/orders/Service%20English.pdf",
                cacheid: fileId,
                mime: 'application/pdf'
            };

            const metadata: Metadata = {
                username,
                userId
            };
            if (projectId) {
                metadata.projectId = projectId;
                metadata.mode = 'annotation';
            }
            if (orderId) {
                metadata.orderId = fileId;
                metadata.mode = 'signature';
                metadata.isSigned = isSigned;
            }

            iframeRef.current.contentWindow.postMessage(
                { type: 'view', payload: fileObj, metadata },
                ANGULAR_URL
            );

            console.log("Sent file object via postMessage:", fileObj);
        }
    };

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== ANGULAR_URL) return;

            if (event.data?.type === 'ISSUE_SAVE') {
                console.log("Issue saved! ✅")
                window.sessionStorage.setItem("ISSUE_SAVED", "true");
            }
            if (event.data?.type === 'SIGNATURE_SAVE') {
                console.log("Signature saved! ✅")
                window.sessionStorage.setItem("SIGNATURE_SAVED", "true");
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    const handleIframeLoad = () => {
        sendFileToIframe();
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

    const handleBack = () => {
        navigate(projectId ? `/projects/${projectId}` : `/projects/${orderId}`, {
            state: { onBackReset: true }
        });
    }

    return (
        <div className="relative w-full h-[100vh]">
            <button
                onClick={handleBack}
                className="sticky  top-0 left-0 m-4 px-4 py-2 bg-primary text-text font-semibold rounded hover:opacity-90 transition"
            >
                ← Back
            </button>

            {isInvalidParams ? (
                <div className="flex justify-center items-center min-h-[200px] text-red-500 font-semibold">
                    Missing required parameters. Please select a valid file.
                </div>
            ) : (
                <iframe
                    ref={iframeRef}
                    src={ANGULAR_URL}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    title="Rasterex Viewer"
                    onLoad={handleIframeLoad}
                    id="rxview"
                />
            )}
        </div>
    );
};

export default AnnotationIframe;
