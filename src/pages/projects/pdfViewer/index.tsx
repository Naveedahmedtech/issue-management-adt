import AnnotationIframe from '../../../components/iframe/AnnotationIframe';
import {useSearchParams} from "react-router-dom";

const PdfViewer = () => {
  const [searchParams] = useSearchParams();
  const username= searchParams.get('username');
  const userId= searchParams.get('userId');
  const projectId= searchParams.get('projectId') || undefined;
  const fileId= searchParams.get('fileId');
  const filePath= searchParams.get('filePath');
  const isSigned= searchParams.get('isSigned');
  const orderId= searchParams.get('orderId') || undefined;
  const projectOrOrderId = orderId || projectId;
  if (!userId || !projectOrOrderId || !username || !fileId || !filePath || !isSigned) {
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
      fileId={fileId}
      filePath={filePath}
      projectId={projectId}
      orderId={orderId}
      username={username}
      isSigned={isSigned === 'true'}
    />
  );
};

export default PdfViewer;
