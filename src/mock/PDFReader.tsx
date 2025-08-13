
import React, { useRef, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

// Angular viewer origin (local dev or your prod URL)
const ANGULAR_URL = 'http://localhost:4200';

const FILE_1 = 'https://backend.viewsoft.com/uploads/projects/Framework.pdf';
const FILE_2 = 'https://backend.viewsoft.com/uploads/projects/annotated.pdf';

const PdfREADER : React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // which file is background / overlay
  const [backgroundFile, setBackgroundFile] = useState<string>(FILE_1);
  const [overlayFile, setOverlayFile]     = useState<string>(FILE_2);

  // showing the iframe and its unique key
  const [showIframe, setShowIframe]   = useState<boolean>(false);
  const [iframeKey, setIframeKey]     = useState<number>(0);

  // the payload we’ll post into the iframe
  const [comparePayload, setComparePayload] = useState<{
    backgroundFileName: string;
    overlayFileName: string;
    outputName: string;
    backgroundColor: { r: number; g: number; b: number };
    overlayColor: { r: number; g: number; b: number };
  } | null>(null);

  const backgroundColor = '#ff0000'; // red
  const overlayColor    = '#00ff00'; // green

  const hexToRgb = (hex: string) => {
    const cleanHex = hex.replace('#', '');
    const bigint = parseInt(cleanHex, 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >>  8) & 255,
      b:  bigint        & 255,
    };
  };
  const handleCompare = () => {
    const payload = {
      backgroundFileName: backgroundFile,
      overlayFileName:   overlayFile,
      outputName:        'ComparisonResult.pdf',
      backgroundColor:   hexToRgb(backgroundColor),
      overlayColor:      hexToRgb(overlayColor),
    };
    // 1) store payload for when iframe loads
    setComparePayload(payload);
    // 2) bump the key so React tears down/mounts a fresh iframe
    setIframeKey(k => k + 1);
    // 3) ensure it’s visible
    setShowIframe(true);
  };

  // once iframe is actually in the DOM and loaded, send the compare command
  const handleIframeLoad = () => {
    if (comparePayload && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'compare', payload: comparePayload },
        '*'
      );
      console.log('Sent compare command to iframe', comparePayload);
    }
  };

  // listen for progress & result messages from the Angular viewer
  useEffect(() => {
    const handleViewerMessage = (event: MessageEvent) => {
      // you can lock this down to ANGULAR_URL if you want
      if (event.data?.type === 'progressStart') {
        console.log('Viewer progress start:', event.data.message);
      } else if (event.data?.type === 'progressEnd') {
        console.log('Viewer progress end');
      } else if (event.data?.type === 'comparisonComplete') {
        console.log('Comparison complete:', event.data.payload);
        toast.success(`Comparison "${event.data.payload.name}" created!`);
      }
    };
    window.addEventListener('message', handleViewerMessage);
    return () => window.removeEventListener('message', handleViewerMessage);
  }, []);

  return (
    <div className="w-full h-screen p-4 flex flex-col gap-4">
      <div className="flex gap-4">
        <div>
          <label className="block font-semibold mb-1">Background File</label>
          <select
            value={backgroundFile}
            onChange={e => setBackgroundFile(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value={FILE_1}>Framework.pdf</option>
            <option value={FILE_2}>Service English.pdf</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Overlay File</label>
          <select
            value={overlayFile}
            onChange={e => setOverlayFile(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value={FILE_1}>Framework.pdf</option>
            <option value={FILE_2}>Service English.pdf</option>
          </select>
        </div>

        <button
          onClick={handleCompare}
          className="self-end px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Compare
        </button>
      </div>

      {showIframe && (
        <iframe
          key={iframeKey}            // ← forces React to unmount/remount this iframe
          ref={iframeRef}
          src={ANGULAR_URL}
          onLoad={handleIframeLoad}
          title="Rasterex Viewer"
          className="flex-1 w-full border"
          style={{ minHeight: '600px' }}
        />
      )}
    </div>
  );
};

export default PdfREADER ;
