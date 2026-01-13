import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ANGULAR_URL, BASE_URL, ENV } from '../../constant/BASE_URL.ts';
import { IAnnotationProps, Metadata } from "../../types/types.ts";
import { BsArrowLeftCircle } from 'react-icons/bs';
import ModalContainer from '../modal/ModalContainer.tsx';

const AnnotationIframe = ({ userId, filePath, fileId, projectId, username, orderId, isSigned }: IAnnotationProps) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const isInvalidParams = !fileId || !filePath || !userId;
    const fullFileUrl = `${BASE_URL}/${filePath}`;

    const sendFileToIframe = () => {
        if (typeof window !== 'undefined' && iframeRef.current?.contentWindow) {
            const fileObj = {
                filepath: fullFileUrl ,
                // filepath: "https://backend.viewsoft.com/uploads/projects/tepper2.pdf",
                // "https://backend.viewsoft.com/uploads/projects/Index-75222.pdf",
                //    filepath: "https://backend.viewsoft.com/uploads/projects/Project_Report_38c1ff87-923b-4054-bad2-0aa145713abe%20(11).pdf",
                cacheid: 'yuitp-ssfgdf1',
                // cacheid: fileId,
                mime: 'application/pdf'
            };

            const metadata: Metadata = {
                username,
                userId
            };
            if (projectId) {
                metadata.projectId = projectId;
                metadata.mode = 'annotation';
                metadata.orderId = fileId;
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
                console.log("Issue saved! ✅");
                window.sessionStorage.setItem("ISSUE_SAVED", "true");
            }
            if (event.data?.type === 'SIGNATURE_SAVE') {
                console.log("Signature saved! ✅");
                window.sessionStorage.setItem("SIGNATURE_SAVED", "true");
            }
            if (event.data?.type === 'ANNOTATION_SAVE') {
                console.log('Annotation data received:', event.data.payload);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    const handleIframeLoad = () => {
        sendFileToIframe();
    };

    const doNavigate = () => {
        navigate(projectId ? `/projects/${projectId}` : `/projects/${orderId}`, {
            state: { onBackReset: true }
        });
    };

    const handleBack = () => {
        if (!isSigned) {
            setIsModalOpen(true);
        } else {
            doNavigate();
        }
    };

    return (
        <div className="relative w-full sm:min-h-[80vh] sm:h-[80vh] min-h-[80vh] h-[80vh] md:min-h-[80vh] md:h-[100vh]">
            {/* Floating Back button */}
            {/* Floating Back button (sticky) */}
            <div className="sticky top-4 left-2 z-[1000] w-fit">
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded shadow-lg hover:opacity-90 transition"
                >
                    <BsArrowLeftCircle className="text-lg" />
                    Back
                </button>
            </div>

            {isInvalidParams ? (
                <div className="flex justify-center items-center min-h-[200px] text-red-500 font-semibold">
                    Missing required parameters. Please select a valid file.
                </div>
            ) : (
                <iframe
                    ref={iframeRef}
                    src={ANGULAR_URL}
                    className="w-full h-full border-none relative z-0"
                    title="Rasterex Viewer"
                    onLoad={handleIframeLoad}
                    id="rxview"
                />
            )}

            {/* Confirmation Modal */}
            <ModalContainer
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Unsaved Annotations"
            >
                <p className="leading-relaxed">
                    Make sure you’ve saved your annotations in the viewer.
                    If you go back without saving, your changes may be lost.
                    Do you want to continue or stay and review your work?
                </p>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        className="px-4 py-2 bg-gray-400 text-white rounded hover:opacity-80 transition"
                        onClick={() => setIsModalOpen(false)}
                    >
                        Stay & Continue Editing
                    </button>
                    <button
                        className="px-4 py-2 bg-error text-white rounded hover:opacity-80 transition"
                        onClick={doNavigate}
                    >
                        Go Back Anyway
                    </button>
                </div>
            </ModalContainer>

        </div>
    );
};

export default AnnotationIframe;
