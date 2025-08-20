import {useEffect, useRef, useState} from 'react';
import {Link} from 'react-router-dom';
import {APP_ROUTES} from '../../../constant/APP_ROUTES';
import {ROLES} from '../../../constant/ROLES';
import {API_ROUTES} from '../../../constant/API_ROUTES';
import {BASE_URL} from '../../../constant/BASE_URL';

const EDGE_PADDING = 8; // px gutter from the viewport edges

const ProjectDropDown = ({ projectId, setIsDeleteModalOpen, setIsArchiveModalOpen, role }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Call this right after showing the dropdown, and on window resize
  const clampToViewport = () => {
    const el = menuRef.current;
    if (!el) return;
    // Reset any previous nudges
    el.style.transform = 'translateX(0px)';
    const rect = el.getBoundingClientRect();

    let shiftX = 0;
    if (rect.left < EDGE_PADDING) {
      // Push right if left edge is outside
      shiftX = EDGE_PADDING - rect.left;
    } else if (rect.right > window.innerWidth - EDGE_PADDING) {
      // Push left if right edge is outside
      shiftX = (window.innerWidth - EDGE_PADDING) - rect.right;
    }
    if (shiftX !== 0) {
      el.style.transform = `translateX(${shiftX}px)`;
    }
  };

  useEffect(() => {
    clampToViewport();
    window.addEventListener('resize', clampToViewport);
    return () => window.removeEventListener('resize', clampToViewport);
  }, []);

  const handleGenerateReport = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}${API_ROUTES.PROJECT.ROOT}/${projectId}/${API_ROUTES.PROJECT.GENERATE_REPORT}`, {
        method: 'GET',
        headers: { 'Accept': 'application/pdf' },
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to generate the report');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Project_Report_${projectId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error while downloading the report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Make sure the parent that anchors this dropdown is `relative`
    <div
      ref={menuRef}
      className="absolute right-0 mt-2 w-56 max-w-[calc(100vw-16px)] bg-backgroundShade2 text-textDark rounded-md shadow-lg z-50 will-change-transform"
    >
      <ul className="py-2">
        {role !== ROLES.WORKER && (
          <>
            <li>
              <Link
                to={`${APP_ROUTES.APP.PROJECTS.EDIT}/${projectId}`}
                className="block px-4 py-2 text-sm hover:bg-background"
              >
                Edit Project
              </Link>
            </li>
            <li>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="w-full text-left block px-4 py-2 text-sm hover:bg-background"
              >
                Delete Project
              </button>
            </li>
            <li>
              <button
                onClick={() => setIsArchiveModalOpen(true)}
                className="w-full text-left block px-4 py-2 text-sm hover:bg-background"
              >
                Archive Project
              </button>
            </li>
          </>
        )}
        <li>
          <button
            onClick={handleGenerateReport}
            disabled={isLoading}
            className={`w-full text-left block px-4 py-2 text-sm hover:bg-background ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Downloading...' : 'Generate Report'}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ProjectDropDown;
