//context/index.jsx
import { AuthProvider } from "./AuthContext";
import { OnboardingProvider } from "./OnboardingContext";
import { UserProvider } from "./UserContext";
import { WorkoutProvider } from "./workoutContext";

const AppProvider = ({ children }) => {
    return (
        <>
            <AuthProvider>
                <UserProvider>
                    <OnboardingProvider>
                        <WorkoutProvider>
                            {children}
                        </WorkoutProvider>
                    </OnboardingProvider>
                </UserProvider>
            </AuthProvider>
        </>
    )
}
export default AppProvider;