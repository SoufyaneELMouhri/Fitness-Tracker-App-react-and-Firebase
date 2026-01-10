import { useContext } from "react";
import WorkoutContext from "../context/workoutContext";

export const useWorkouts = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkouts must be used within WorkoutProvider');
  }
  return context;
};
