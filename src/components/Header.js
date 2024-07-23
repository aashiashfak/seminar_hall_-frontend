import React from "react";
import {useSelector, useDispatch} from "react-redux";
import {clearUser} from "../redux/userReducer"; // Adjust the path to your userReducer
import {useNavigate} from "react-router-dom";

const Header = () => {
  const user = useSelector((state) => state.user);
  console.log('user',user);
  console.log('user.user',user.user)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // logout the user with clearing UserData from localstorage and navigate to login
  const handleLogout = () => {
    dispatch(clearUser());
    navigate("/login"); // Adjust the path to your login route
  };

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Seminar Hall</h1>
      {user.user ? (
        <div className="flex items-center">
          <span className="mr-4">{user.user.username}</span>
          <button
            onClick={handleLogout}
            className="bg-violet-600 text-white py-2 px-4 rounded-md hover:bg-violet-700 transition duration-200"
          >
            Logout
          </button>
        </div>
      ) : null}
    </header>
  );
};

export default Header;
