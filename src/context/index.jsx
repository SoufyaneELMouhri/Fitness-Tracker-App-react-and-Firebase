//context/index.jsx
import { AuthProvider } from "./AuthContext";
import { NutritionProvider } from "./nutritionContext";
import { OnboardingProvider } from "./OnboardingContext";
import { ProgressProvider } from "./progressContext";
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
                                <ProgressProvider>
                                     {children}
                                </ProgressProvider>
                            </NutritionProvider>
                        </WorkoutProvider>
                    </OnboardingProvider>
                </UserProvider>
            </AuthProvider>
        </>
    )
}
export default AppProvider;