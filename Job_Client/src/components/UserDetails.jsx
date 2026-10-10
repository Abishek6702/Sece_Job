import React from "react";
import { useParams, Link } from "react-router-dom";

const UserDetails = ({ users, loading }) => {
  const { userId } = useParams();

  if (loading) {
    return (
      <div className="w-2/3 bg-white rounded shadow p-4">
        <div className="text-gray-500">Loading user details...</div>
      </div>
    );
  }

  const selectedUser = users.find((user) => user._id === userId);

  if (!selectedUser) {
    return (
      <div className="w-2/3 bg-white rounded shadow p-4">
        <h3 className="font-semibold text-gray-700 mb-2">Messages</h3>
        <div className="text-gray-500 text-sm">User not found.</div>
      </div>
    );
  }

  const profileImg =
    selectedUser.onboarding?.profileImage &&
    `${import.meta.env.VITE_API_BASE_URL}/${
      selectedUser.onboarding.profileImage
    }`;

  const name =
    selectedUser.onboarding?.firstName && selectedUser.onboarding?.lastName
      ? `${selectedUser.onboarding.firstName} ${selectedUser.onboarding.lastName}`
      : selectedUser.name || "User";

  return (
    <div className="w-2/3 bg-white rounded shadow p-4">
      <div className="border-b pb-4 mb-4">
        <Link
          to="/messages"
          className="text-blue-500 hover:text-blue-700 text-sm mb-2 inline-block"
        >
          ← Back to Messages
        </Link>
        <div className="flex items-center gap-4">
          {profileImg && (
            <img
              src={profileImg}
              alt={name}
              className="w-16 h-16 rounded-full object-cover"
            />
          )}
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
            <p className="text-gray-500">
              @{selectedUser.onboarding?.firstName?.toLowerCase() || "user"}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {selectedUser.email || "No email provided"}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h4 className="font-medium text-gray-700">Role</h4>
          <p className="text-gray-600 capitalize">{selectedUser.role}</p>
        </div>

        {selectedUser.onboarding?.department && (
          <div>
            <h4 className="font-medium text-gray-700">Department</h4>
            <p className="text-gray-600">
              {selectedUser.onboarding.department}
            </p>
          </div>
        )}

        {selectedUser.onboarding?.position && (
          <div>
            <h4 className="font-medium text-gray-700">Position</h4>
            <p className="text-gray-600">{selectedUser.onboarding.position}</p>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t">
        <h4 className="font-medium text-gray-700 mb-2">Messages</h4>
        <div className="text-gray-500 text-sm">
          Start a conversation with {name}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
