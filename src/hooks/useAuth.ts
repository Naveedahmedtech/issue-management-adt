import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, logoutSuccess, updateUserData } from "../redux/features/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, userData } = useSelector((state: any) => state.auth);

  const login = (userData: any) => {
    dispatch(loginSuccess(userData));
  };

  const logout = () => {
    dispatch(logoutSuccess());
  };

  const updateToken = (newUserData: any) => {
    dispatch(updateUserData(newUserData));
  };

  return { isLoggedIn, userData, login, logout, updateToken };
};
