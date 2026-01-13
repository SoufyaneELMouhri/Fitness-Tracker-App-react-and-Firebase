import React, { useState } from 'react';
import { useNutrition } from '../../../Hooks/useNutrition';

export default function AddFoodModal({ show, onClose, mealType = 'breakfast' }) {
  const { addFoodLog } = useNutrition();
  
  const [formData, setFormData] = useState({
    foodName: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    fiber: '',
    servingSize: '',
    servingUnit: 'g',
    quantity: 1,
    mealType: mealType
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.foodName.trim()) {
      newErrors.foodName = 'Food name is required';
    }

    if (!formData.calories || formData.calories <= 0) {
      newErrors.calories = 'Calories must be greater than 0';
    }

    if (!formData.protein || formData.protein < 0) {
      newErrors.protein = 'Protein cannot be negative';
    }

    if (!formData.carbs || formData.carbs < 0) {
      newErrors.carbs = 'Carbs cannot be negative';
    }

    if (!formData.fat || formData.fat < 0) {
      newErrors.fat = 'Fat cannot be negative';
    }

    if (!formData.servingSize || formData.servingSize <= 0) {
      newErrors.servingSize = 'Serving size must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const foodData = {
      foodName: formData.foodName.trim(),
      calories: parseFloat(formData.calories),
      protein: parseFloat(formData.protein),
      carbs: parseFloat(formData.carbs),
      fat: parseFloat(formData.fat),
      fiber: parseFloat(formData.fiber) || 0,
      servingSize: parseFloat(formData.servingSize),
      servingUnit: formData.servingUnit,
      quantity: parseInt(formData.quantity),
      mealType: formData.mealType
    };

    const result = await addFoodLog(foodData);

    setLoading(false);

    if (result.success) {
      // Reset form and close modal
      setFormData({
        foodName: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        fiber: '',
        servingSize: '',
        servingUnit: 'g',
        quantity: 1,
        mealType: mealType
      });
      onClose();
    } else {
      setErrors({ submit: result.error || 'Failed to add food' });
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!show) return null;

  return (
    <div 
      className="modal fade show d-block" 
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={handleBackdropClick}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          {/* Modal Header */}
          <div className="modal-header">
            <h5 className="modal-title fw-bold">Add Food to {formData.mealType}</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              disabled={loading}
            ></button>
          </div>

          {/* Modal Body */}
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              {/* Error Message */}
              {errors.submit && (
                <div className="alert alert-danger" role="alert">
                  {errors.submit}
                </div>
              )}

              {/* Food Name */}
              <div className="mb-3">
                <label htmlFor="foodName" className="form-label fw-semibold">
                  Food Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.foodName ? 'is-invalid' : ''}`}
                  id="foodName"
                  name="foodName"
                  value={formData.foodName}
                  onChange={handleChange}
                  placeholder="e.g., Grilled Chicken Breast"
                  disabled={loading}
                />
                {errors.foodName && (
                  <div className="invalid-feedback">{errors.foodName}</div>
                )}
              </div>

              {/* Meal Type */}
              <div className="mb-3">
                <label htmlFor="mealType" className="form-label fw-semibold">
                  Meal Type <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  id="mealType"
                  name="mealType"
                  value={formData.mealType}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>

              {/* Macros Row */}
              <div className="row g-3 mb-3">
                {/* Calories */}
                <div className="col-md-6">
                  <label htmlFor="calories" className="form-label fw-semibold">
                    Calories (kcal) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className={`form-control ${errors.calories ? 'is-invalid' : ''}`}
                    id="calories"
                    name="calories"
                    value={formData.calories}
                    onChange={handleChange}
                    placeholder="0"
                    disabled={loading}
                  />
                  {errors.calories && (
                    <div className="invalid-feedback">{errors.calories}</div>
                  )}
                </div>

                {/* Protein */}
                <div className="col-md-6">
                  <label htmlFor="protein" className="form-label fw-semibold">
                    Protein (g) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className={`form-control ${errors.protein ? 'is-invalid' : ''}`}
                    id="protein"
                    name="protein"
                    value={formData.protein}
                    onChange={handleChange}
                    placeholder="0"
                    disabled={loading}
                  />
                  {errors.protein && (
                    <div className="invalid-feedback">{errors.protein}</div>
                  )}
                </div>
              </div>

              <div className="row g-3 mb-3">
                {/* Carbs */}
                <div className="col-md-6">
                  <label htmlFor="carbs" className="form-label fw-semibold">
                    Carbs (g) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className={`form-control ${errors.carbs ? 'is-invalid' : ''}`}
                    id="carbs"
                    name="carbs"
                    value={formData.carbs}
                    onChange={handleChange}
                    placeholder="0"
                    disabled={loading}
                  />
                  {errors.carbs && (
                    <div className="invalid-feedback">{errors.carbs}</div>
                  )}
                </div>

                {/* Fat */}
                <div className="col-md-6">
                  <label htmlFor="fat" className="form-label fw-semibold">
                    Fat (g) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className={`form-control ${errors.fat ? 'is-invalid' : ''}`}
                    id="fat"
                    name="fat"
                    value={formData.fat}
                    onChange={handleChange}
                    placeholder="0"
                    disabled={loading}
                  />
                  {errors.fat && (
                    <div className="invalid-feedback">{errors.fat}</div>
                  )}
                </div>
              </div>

              {/* Fiber (Optional) */}
              <div className="mb-3">
                <label htmlFor="fiber" className="form-label fw-semibold">
                  Fiber (g) <span className="text-muted small">(Optional)</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  id="fiber"
                  name="fiber"
                  value={formData.fiber}
                  onChange={handleChange}
                  placeholder="0"
                  disabled={loading}
                />
              </div>

              {/* Serving Size Row */}
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label htmlFor="servingSize" className="form-label fw-semibold">
                    Serving Size <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className={`form-control ${errors.servingSize ? 'is-invalid' : ''}`}
                    id="servingSize"
                    name="servingSize"
                    value={formData.servingSize}
                    onChange={handleChange}
                    placeholder="100"
                    disabled={loading}
                  />
                  {errors.servingSize && (
                    <div className="invalid-feedback">{errors.servingSize}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label htmlFor="servingUnit" className="form-label fw-semibold">
                    Unit
                  </label>
                  <select
                    className="form-select"
                    id="servingUnit"
                    name="servingUnit"
                    value={formData.servingUnit}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="g">grams (g)</option>
                    <option value="ml">milliliters (ml)</option>
                    <option value="oz">ounces (oz)</option>
                    <option value="cup">cup</option>
                    <option value="tbsp">tablespoon</option>
                    <option value="tsp">teaspoon</option>
                    <option value="piece">piece</option>
                    <option value="serving">serving</option>
                  </select>
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-3">
                <label htmlFor="quantity" className="form-label fw-semibold">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  disabled={loading}
                />
                <div className="form-text">
                  How many servings of this food?
                </div>
              </div>

              {/* Calculated Total Preview */}
              <div className="alert alert-info">
                <h6 className="alert-heading mb-2">Total Nutrition</h6>
                <div className="d-flex justify-content-between">
                  <span>
                    <strong>Calories:</strong> {(parseFloat(formData.calories) || 0) * (parseInt(formData.quantity) || 1)} kcal
                  </span>
                  <span>
                    <strong>Protein:</strong> {(parseFloat(formData.protein) || 0) * (parseInt(formData.quantity) || 1)}g
                  </span>
                  <span>
                    <strong>Carbs:</strong> {(parseFloat(formData.carbs) || 0) * (parseInt(formData.quantity) || 1)}g
                  </span>
                  <span>
                    <strong>Fat:</strong> {(parseFloat(formData.fat) || 0) * (parseInt(formData.quantity) || 1)}g
                  </span>
                </div>
              </div>
            </form>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Adding...
                </>
              ) : (
                'Add Food'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
