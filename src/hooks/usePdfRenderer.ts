// usePdfRenderer.ts
import {useEffect} from 'react';
import {getDocument, GlobalWorkerOptions} from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';

GlobalWorkerOptions.workerSrc = workerUrl;

export function usePdfRenderer(
    url: string,
    canvasRef: React.RefObject<HTMLCanvasElement>,
    pageNumber: number,
    setNumPages: (n: number) => void
) {
    useEffect(() => {
        const renderPDFPage = async () => {
            const loadingTask = getDocument(url);
            const pdf = await loadingTask.promise;
            setNumPages(pdf.numPages);

            const page = await pdf.getPage(pageNumber);
            const scale = 1.5;
            const viewport = page.getViewport({ scale });

            const canvas = canvasRef.current;
            const context = canvas?.getContext('2d');
            if (!canvas || !context) return;

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({ canvasContext: context, viewport }).promise;
        };

        renderPDFPage();
    }, [url, canvasRef, pageNumber, setNumPages]);
}
