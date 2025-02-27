import AnnotationIframe from '../../../components/iframe/AnnotationIframe'
import {useLocation} from "react-router-dom";

const PdfViewer = () => {
  const location = useLocation();
  const { userId, selectedFile, projectId } = location.state || {};
  return (
    <AnnotationIframe  userId={userId} selectedFile={selectedFile} projectId={projectId} />
  )
}

export default PdfViewer
