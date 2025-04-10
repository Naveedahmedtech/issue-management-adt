import React, {useEffect, useRef, useState} from 'react';
import {getDocument, GlobalWorkerOptions, PDFDocumentProxy} from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';

GlobalWorkerOptions.workerSrc = workerUrl;

const PDFReader = ({ url }: { url: string }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [numPages, setNumPages] = useState(0);

    const renderPage = async (pageNum: number) => {
        if (!pdfDoc) return;

        const page = await pdfDoc.getPage(pageNum);
        const scale = 1.5;
        const viewport = page.getViewport({ scale });

        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');

        if (canvas && context) {
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
                canvasContext: context,
                viewport,
            };

            await page.render(renderContext).promise;
        }
    };

    useEffect(() => {
        const loadPdf = async () => {
            const loadingTask = getDocument(url);
            const pdf = await loadingTask.promise;
            setPdfDoc(pdf);
            setNumPages(pdf.numPages);
        };

        loadPdf();
    }, [url]);

    useEffect(() => {
        if (pdfDoc) renderPage(pageNumber);
    }, [pdfDoc, pageNumber]);

    return (
        <div style={{ textAlign: 'center' }}>
            <canvas ref={canvasRef} />

            <div style={{ marginTop: '1rem' }}>
                <button
                    onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                    disabled={pageNumber <= 1}
                >
                    Previous
                </button>

                <span style={{ margin: '0 1rem' }}>
          Page {pageNumber} of {numPages}
        </span>

                <button
                    onClick={() => setPageNumber((prev) => Math.min(prev + 1, numPages))}
                    disabled={pageNumber >= numPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default PDFReader;
