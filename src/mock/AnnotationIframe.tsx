import React, { useRef } from 'react';

const AnnotationIframe = () => {
  const iframeRef = useRef(null);

  const handleMessage = (event:any) => {
    if (event.origin !== 'http://localhost:4200') return; // Change to your Angular app's URL
    if (event.data.type === 'ANNOTATION_SAVE') {
      console.log('Annotation Data:', event.data.payload);
    }
  };

  React.useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src={`http://localhost:4200`}
      style={{ width: '100%', height: '100vh', border: 'none' }}
      title="Annotation Tool"
    />
  );
};

export default AnnotationIframe;
