import { useContext } from "react";
import { NutritionContext } from "../context/nutritionContext";

export const useNutrition = () => {
  const context = useContext(NutritionContext);
  if (!context) {
    throw new Error('useNutrition must be used within NutritionProvider');
  }
  return context;
};
