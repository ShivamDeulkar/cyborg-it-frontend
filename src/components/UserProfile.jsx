import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const UserProfile = ({ user }) => {
  const [sameUser, setSameUser] = useState(false);
  const navigate = useNavigate();
  const { userId } = useParams();
  if (userId === user?._id) {
    !sameUser && setSameUser(true);
  } else {
    sameUser && setSameUser(false);
  }
  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };
  return (
    <div className="w-full h-full flex-col flex items-center justify-center">
      <p>User profile</p>
      {sameUser && (
        <button
          className="bg-highlight text-white px-5 py-2 rounded-full"
          onClick={logout}
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default UserProfile;
