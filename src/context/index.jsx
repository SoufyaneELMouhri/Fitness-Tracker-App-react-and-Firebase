//context/index.jsx
import { AuthProvider } from "./AuthContext";
import { OnboardingProvider } from "./OnboardingContext";
import { UserProvider } from "./UserContext";

const AppProvider = ({ children }) => {
    return (
        <>
            <AuthProvider>
                <UserProvider>
                    <OnboardingProvider>
                        {children}
                    </OnboardingProvider>
                </UserProvider>
            </AuthProvider>
        </>
    )
}
export default AppProvider;