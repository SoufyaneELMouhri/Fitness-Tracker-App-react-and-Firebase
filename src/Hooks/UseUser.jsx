import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export const UseUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};