//context/index.jsx
import { AuthProvider } from "./AuthContext";
import { UserProvider } from "./UserContext";

const AppProvider = ({ children }) => {
    return (
        <>
            <AuthProvider>
                <UserProvider>
                    {children}
                </UserProvider>
            </AuthProvider>
        </>
    )
}
export default AppProvider;