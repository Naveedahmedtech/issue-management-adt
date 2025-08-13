import React, { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const ANGULAR_URL = 'http://localhost:4200';

const CompareFiles: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [searchParams] = useSearchParams();

  const [iframeKey, setIframeKey] = useState<number>(0);
  const [comparePayload, setComparePayload] = useState<any | null>(null);
  const [showIframe, setShowIframe] = useState<boolean>(false);

  const hexToRgb = (hex: string) => {
    const cleanHex = hex.replace('#', '');
    const bigint = parseInt(cleanHex, 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  };

  useEffect(() => {
    const backgroundFile = searchParams.get('backgroundFile');
    const overlayFile = searchParams.get('overlayFile');
    const outputName = searchParams.get('filename') || 'ComparisonResult.pdf';
    const backgroundColor = searchParams.get('backgroundColor') || '#ff0000';
    const overlayColor = searchParams.get('overlayColor') || '#00ff00';

    if (!backgroundFile || !overlayFile) return;

    const payload = {
      backgroundFileName: backgroundFile,
      overlayFileName: overlayFile,
      outputName,
      backgroundColor: hexToRgb(backgroundColor),
      overlayColor: hexToRgb(overlayColor),
    };

    setComparePayload(payload);
    setIframeKey(prev => prev + 1);
    setShowIframe(true);
  }, [searchParams]);

  const handleIframeLoad = () => {
    if (comparePayload && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'compare', payload: comparePayload },
        '*'
      );
      console.log('Sent compare command to iframe', comparePayload);
    }
  };

  useEffect(() => {
    const handleViewerMessage = (event: MessageEvent) => {
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
      <Link to="testing"></Link>
      {showIframe && (
        <iframe
          key={iframeKey}
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

export default CompareFiles;
