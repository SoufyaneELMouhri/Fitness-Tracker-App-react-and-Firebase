//context/index.jsx
import { AuthProvider } from "./AuthContext";
import { NutritionProvider } from "./nutritionContext";
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
                            <NutritionProvider>
                                {children}
                            </NutritionProvider>
                        </WorkoutProvider>
                    </OnboardingProvider>
                </UserProvider>
            </AuthProvider>
        </>
    )
}
export default AppProvider;