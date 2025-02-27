import React, { useRef, useState, useEffect } from 'react';
import { ANGULAR_SIGN_URL } from "../../constant/BASE_URL.ts";

const SignatureIframe = ({ userId, selectedFile, orderId }: any) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Ensure selectedFile is valid
  const fileId = selectedFile?.id;
  const filePath = selectedFile?.filePath;

  // Check for missing parameters
  const isInvalidParams = !fileId || !filePath || !orderId || !userId;

  // Function to handle messages from the iframe
  const handleMessage = (event: MessageEvent) => {
    if (event.origin !== ANGULAR_SIGN_URL) return; // Ensure it matches only the base URL

    if (event.data?.type === 'ANNOTATION_SAVE') {
      console.log('Annotation Data:', event.data.payload);
    }
  };

  useEffect(() => {
    window.addEventListener('message', handleMessage);

    // Clean up on component unmount
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Handle iframe load completion
  const handleIframeLoad = () => {
    setLoading(false);
    setError(null); // Reset any previous errors
  };

  // Handle iframe loading errors
  const handleIframeError = () => {
    setLoading(false);
    setError("Failed to load the annotation tool. Please try again.");
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      {/* Edge Case: Show Error if Parameters are Missing */}
      {isInvalidParams && (
        <div className="flex justify-center items-center min-h-[200px] text-red-500 font-semibold">
          Missing required parameters (fileId, filePath, projectId, or userId). Please select a valid file.
        </div>
      )}

      {/* Edge Case: Loading Indicator */}
      {loading && !isInvalidParams && (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="text-primary text-lg font-semibold">Please wait while we are processing...</div>
        </div>
      )}

      {/* Edge Case: Display Error if Iframe Fails to Load */}
      {error && !isInvalidParams && (
        <div className="flex justify-center items-center min-h-[200px] text-red-500 font-semibold">
          {error}
        </div>
      )}

      {/* Render Iframe Only When All Parameters Are Valid */}
      {!isInvalidParams && !error && (
        <iframe
          ref={iframeRef}
          src={`${ANGULAR_SIGN_URL}/?fileId=${fileId}&filePath=${filePath}&orderId=${orderId}&userId=${userId}`}
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="Annotation Tool"
          onLoad={handleIframeLoad} // Trigger when iframe finishes loading
          onError={handleIframeError} // Handle iframe errors
        />
      )}
    </div>
  );
};

export default SignatureIframe;
