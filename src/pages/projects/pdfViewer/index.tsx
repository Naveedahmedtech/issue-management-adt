import AnnotationIframe from '../../../components/iframe/AnnotationIframe';
import { useLocation } from "react-router-dom";

const PdfViewer = () => {
  const location = useLocation();
  const { userId, selectedFile, projectId } = location.state || {};

  if (!userId || !selectedFile || !projectId) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Nothing to Display</h2>
        <p>We couldn't load the content at this time. Please try navigating back and selecting a file again.</p>
      </div>
    );
  }

  return (
    <AnnotationIframe
      userId={userId}
      selectedFile={selectedFile}
      projectId={projectId}
    />
  );
};

export default PdfViewer;
