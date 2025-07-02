import {useState} from 'react';
import {Link} from 'react-router-dom';
import {APP_ROUTES} from '../../../constant/APP_ROUTES';
import {ROLES} from '../../../constant/ROLES';
import {API_ROUTES} from '../../../constant/API_ROUTES';
import {BASE_URL} from '../../../constant/BASE_URL';

const ProjectDropDown = ({ projectId, setIsDeleteModalOpen, setIsArchiveModalOpen, role }: any) => {
    const [isLoading, setIsLoading] = useState(false); // Loading state

    // Function to handle report download using fetch
    const handleGenerateReport = async () => {
        try {
            setIsLoading(true); 
            const response = await fetch(`${BASE_URL}${API_ROUTES.PROJECT.ROOT}/${projectId}/${API_ROUTES.PROJECT.GENERATE_REPORT}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/pdf',
                },
                credentials: "include",
            });

            // Check if the response is OK
            if (!response.ok) {
                throw new Error('Failed to generate the report');
            }

            // Convert the response to a Blob
            const blob = await response.blob();

            // URL for the Blob and trigger the download
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
        <div className="absolute right-0 mt-2 w-56 bg-backgroundShade2 text-textDark rounded-md shadow-lg z-50">
            <ul className="py-2">
                {role !== ROLES.WORKER && (
                    <>
                        <li>
                            <Link
                                to={`${APP_ROUTES.APP.PROJECTS.EDIT}/${projectId}`}
                                className="block px-4 py-2 text-sm  hover:bg-background"
                            >
                                Edit Project
                            </Link>
                        </li>
                        <li>
                            <button
                                onClick={() => setIsDeleteModalOpen(true)}
                                className="w-full text-left block px-4 py-2 text-sm  hover:bg-background"
                            >
                                Delete Project
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setIsArchiveModalOpen(true)}
                                className="w-full text-left block px-4 py-2 text-sm  hover:bg-background"
                            >
                                Archive Project
                            </button>
                        </li>
                    </>
                )}
                <li>
                    <button
                        onClick={handleGenerateReport}
                        disabled={isLoading} // Disable button while loading
                        className={`w-full text-left block px-4 py-2 text-sm hover:bg-background  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? 'Downloading...' : 'Generate Report'}
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default ProjectDropDown;
