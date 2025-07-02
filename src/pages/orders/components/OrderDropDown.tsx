import {Link} from 'react-router-dom'
import {APP_ROUTES} from '../../../constant/APP_ROUTES'
import {ROLES} from '../../../constant/ROLES'

const OrderDropDown = ({ orderId, setIsDeleteModalOpen, setIsArchiveModalOpen, setIsUploadModalOpen, role }: any) => {
    return (
        <div className="absolute right-[-100px] md:right-0 mt-2 w-56 bg-background rounded-md shadow-lg z-50">
            <ul className="py-2">
                {
                    role !== ROLES.WORKER && (
                        <>
                            <li>
                                <Link
                                    to={`${APP_ROUTES.APP.ORDERS.EDIT}/${orderId}`}
                                    className="block px-4 py-2 text-sm text-text hover:bg-backgroundShade1"
                                >
                                    Edit Order
                                </Link>
                            </li>
                            <li>
                                <button
                                    onClick={() => setIsDeleteModalOpen(true)}
                                    className="w-full text-left block px-4 py-2 text-sm text-text hover:bg-backgroundShade1"
                                >
                                    Delete Order
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setIsArchiveModalOpen(true)}
                                    className="w-full text-left block px-4 py-2 text-sm text-text hover:bg-backgroundShade1"
                                >
                                    Archive Order
                                </button>
                            </li>
                        </>
                    )
                }
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

export default OrderDropDown
