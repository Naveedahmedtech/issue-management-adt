// import React, {useEffect, useRef, useState} from 'react';
// import * as Fabric from 'fabric';
// import {BASE_URL} from '../constant/BASE_URL';
// import {getDocument, GlobalWorkerOptions} from 'pdfjs-dist';
// import {PDFDocument} from 'pdf-lib';
//
// import workerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';
//
// GlobalWorkerOptions.workerSrc = workerUrl;
//
// export default function PDFAnnotator() {
//     const pdfCanvasRef = useRef<HTMLCanvasElement>(null);
//     const fabricCanvasRef = useRef<HTMLCanvasElement>(null);
//     const fabricInstanceRef = useRef<Fabric.Canvas | null>(null);
//     const [pdfLoaded, setPdfLoaded] = useState(false);
//     const tempPDFURL = `${BASE_URL}/uploads/projects/Example-Floor-Plans-220331.pdf`;
//
//     const addHazardImage = () => {
//         const fabricCanvas = fabricInstanceRef.current;
//         if (!fabricCanvas) return;
//
//         const imgElement = document.createElement('img');
//         imgElement.src = `${import.meta.env.BASE_URL}assets/images/hazard.png`;
//
//         imgElement.onload = () => {
//             const fabricImage = new Fabric.Image(imgElement, {
//                 left: 50,
//                 top: 50,
//                 scaleX: 0.3,
//                 scaleY: 0.3,
//             });
//
//             fabricCanvas.add(fabricImage);
//             fabricCanvas.renderAll();
//         };
//     };
//
//     const renderPDF = async (url: string) => {
//         const loadingTask = getDocument(url);
//         const pdf = await loadingTask.promise;
//         const page = await pdf.getPage(1);
//
//         const scale = 1.5;
//         const viewport = page.getViewport({ scale });
//
//         const pdfCanvas = pdfCanvasRef.current;
//         const context = pdfCanvas?.getContext('2d');
//         if (!pdfCanvas || !context) return;
//
//         // Set size
//         pdfCanvas.width = viewport.width;
//         pdfCanvas.height = viewport.height;
//
//         // Render PDF to bottom canvas
//         await page.render({ canvasContext: context, viewport }).promise;
//
//         // Set fabric overlay to match size
//         const fabricCanvas = new Fabric.Canvas(fabricCanvasRef.current as HTMLCanvasElement, {
//             backgroundColor: 'transparent',
//             selection: true,
//         });
//
//         fabricCanvas.setWidth(viewport.width);
//         fabricCanvas.setHeight(viewport.height);
//
//         fabricInstanceRef.current = fabricCanvas;
//
//         addHazardImage();
//         setPdfLoaded(true);
//     };
//
//     useEffect(() => {
//         renderPDF(tempPDFURL);
//
//         return () => {
//             fabricInstanceRef.current?.dispose();
//         };
//     }, []);
//
//     const downloadAnnotatedImage = () => {
//         if (!fabricInstanceRef.current || !pdfCanvasRef.current) return;
//
//         const pdfImage = pdfCanvasRef.current.toDataURL('image/png');
//         const annotationImage = fabricInstanceRef.current.toDataURL();
//
//         const mergedCanvas = document.createElement('canvas');
//         mergedCanvas.width = pdfCanvasRef.current.width;
//         mergedCanvas.height = pdfCanvasRef.current.height;
//         const ctx = mergedCanvas.getContext('2d');
//
//         const background = new Image();
//         const overlay = new Image();
//         let loaded = 0;
//
//         background.onload = overlay.onload = () => {
//             loaded += 1;
//             if (loaded === 2) {
//                 ctx?.drawImage(background, 0, 0);
//                 ctx?.drawImage(overlay, 0, 0);
//                 const dataUrl = mergedCanvas.toDataURL('image/png');
//                 const a = document.createElement('a');
//                 a.href = dataUrl;
//                 a.download = 'annotated.png';
//                 a.click();
//             }
//         };
//
//         background.src = pdfImage;
//         overlay.src = annotationImage;
//     };
//
//     const downloadAnnotatedPDF = async () => {
//         if (!fabricInstanceRef.current || !pdfCanvasRef.current) return;
//
//         // Fetch the original PDF file
//         const pdfBytes = await fetch(tempPDFURL).then(res => res.arrayBuffer());
//
//         // Load PDF using pdf-lib
//         const pdfDoc = await PDFDocument.load(pdfBytes);
//         const page = pdfDoc.getPages()[0]; // Page 1
//
//         const { width, height } = page.getSize();
//
//         // Get annotations as PNG image
//         // const annotationDataUrl = fabricInstanceRef.current.toDataURL({ format: 'png' });
//         const annotationDataUrl = fabricInstanceRef.current.toDataURL();
//         const annotationBytes = await fetch(annotationDataUrl).then(res => res.arrayBuffer());
//         const annotationImage = await pdfDoc.embedPng(annotationBytes);
//
//         // Draw annotations on top of the existing PDF page
//         page.drawImage(annotationImage, {
//             x: 0,
//             y: 0,
//             width,
//             height,
//         });
//
//         // Save and trigger download
//         const modifiedPdfBytes = await pdfDoc.save();
//         const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
//         const url = URL.createObjectURL(blob);
//
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = 'annotated.pdf';
//         a.click();
//
//         URL.revokeObjectURL(url);
//     };
//
//     return (
//         <div className="p-4">
//             <div style={{ position: 'relative', display: 'inline-block' }}>
//                 <canvas ref={pdfCanvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }} />
//                 <canvas ref={fabricCanvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }} />
//             </div>
//             {pdfLoaded && (
//                 <button
//                     className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//                     onClick={downloadAnnotatedImage}
//                 >
//                     Download Annotated PNG
//                 </button>
//             )}
//             {pdfLoaded && (
//                 <div className="mt-4 flex gap-4">
//                     <button
//                         className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//                         onClick={downloadAnnotatedImage}
//                     >
//                         Download Annotated PNG
//                     </button>
//
//                     <button
//                         className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//                         onClick={downloadAnnotatedPDF}
//                     >
//                         Download Annotated PDF
//                     </button>
//                 </div>
//             )}
//
//         </div>
//     );
// }
