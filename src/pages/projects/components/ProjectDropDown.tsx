import { Link } from 'react-router-dom'
import { APP_ROUTES } from '../../../constant/APP_ROUTES'

const ProjectDropDown = ({ projectId, setIsDeleteModalOpen, setIsArchiveModalOpen, setIsUploadModalOpen }: any) => {
    return (
        <div className="absolute right-0 mt-2 w-56 bg-background rounded-md shadow-lg z-50">
            <ul className="py-2">
                <li>
                    <Link
                        to={`${APP_ROUTES.APP.PROJECTS.EDIT}/${projectId}`}
                        className="block px-4 py-2 text-sm text-text hover:bg-backgroundShade1"
                    >
                        Edit Project
                    </Link>
                </li>
                <li>
                    <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="w-full text-left block px-4 py-2 text-sm text-text hover:bg-backgroundShade1"
                    >
                        Delete Project
                    </button>
                </li>
                <li>
                    <button
                        onClick={() => setIsArchiveModalOpen(true)}
                        className="w-full text-left block px-4 py-2 text-sm text-text hover:bg-backgroundShade1"
                    >
                        Archive Project
                    </button>
                </li>
                <li>
                    <button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="w-full text-left block px-4 py-2 text-sm text-text hover:bg-backgroundShade1"
                    >
                        Upload File
                    </button>
                </li>
            </ul>
        </div>
    )
}

export default ProjectDropDown
