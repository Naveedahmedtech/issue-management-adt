import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import AddUser from '../components/profile/AddUser';

const Profile: React.FC = () => {
    const { userData } = useAuth(); // Retrieve user data, including role

    const isAdmin = userData?.userData?.role  === 'ADMIN';
    const isManager = userData?.userData?.role === 'MANAGER';
    const isRegularUser = userData?.userData?.role === 'USER';

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">Profile</h2>

            {/* Admin Section */}
            {isAdmin && (
                <div className="space-y-6">
                    <div className="border rounded-lg p-4 bg-backgroundShade1">
                        <h4 className="text-lg font-semibold mb-2">Add New User</h4>
                        <AddUser />
                    </div>
                    {/* <div className="border rounded-lg p-4 bg-backgroundShade1 mt-4">
                        <h4 className="text-lg font-semibold mb-2">Manage Roles and Permissions</h4>
                        <ManageRoles />
                    </div> */}
                </div>
            )}

            {/* Manager Section */}
            {isManager && (
                <div className="space-y-6 mt-6">
                    {/* <h3 className="text-xl font-semibold">Manager Capabilities</h3>
                    <div className="border rounded-lg p-4 bg-backgroundShade1">
                        <h4 className="text-lg font-semibold mb-2">View My Tasks</h4>
                        <MyTasks />
                    </div>
                    <div className="border rounded-lg p-4 bg-backgroundShade1 mt-4">
                        <h4 className="text-lg font-semibold mb-2">View Assigned User Tasks</h4>
                        <AssignedTasks />
                    </div> */}
                </div>
            )}

            {/* Regular User Section */}
            {isRegularUser && (
                <div className="space-y-6 mt-6">
                    {/* <h3 className="text-xl font-semibold">Your Tasks</h3>
                    <div className="border rounded-lg p-4 bg-backgroundShade1">
                        <h4 className="text-lg font-semibold mb-2">My Tasks</h4>
                        <MyTasks />
                    </div> */}
                </div>
            )}
        </div>
    );
};

export default Profile;
