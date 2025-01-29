import React, { useRef } from 'react';

const AnnotationIframe = ({userId,selectedFile,projectId}:any) => {
  const iframeRef = useRef(null);
console.log({userId,selectedFile,projectId})
  const {id:fileId, filePath} = selectedFile;
  const handleMessage = (event:any) => {
    if (event.origin !== `http://localhost:4200/?fileId=${fileId}&filePath=${filePath}&projectId=${projectId}&userId=${userId}`) return; // Change to your Angular app's URL
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
      src={`http://localhost:4200/?fileId=${fileId}&filePath=${filePath}&projectId=${projectId}&userId=${userId}`}
      style={{ width: '100%', height: '100vh', border: 'none' }}
      title="Annotation Tool"
    />
  );
};

export default AnnotationIframe;
