import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FormStep {
  id: string;
  title: string;
  description?: string;
  fields: any[];
}

interface FormStore {
  // Form data
  formData: Record<string, any>;
  updateFormData: (data: Record<string, any>) => void;
  clearFormData: () => void;

  // Steps
  steps: FormStep[];
  setSteps: (steps: FormStep[]) => void;

  // Current step
  currentStepIndex: number;
  setCurrentStep: (stepIndex: number) => void;

  // Progress tracking
  getStepProgress: (stepIndex: number) => number;
  getTotalProgress: () => number;
}

export const useFormStore = create<FormStore>()(
  persist(
    (set, get) => ({
      // Initial state
      formData: {},
      steps: [],
      currentStepIndex: 0,

      // Actions
      updateFormData: (newData) =>
        set((state) => ({
          formData: { ...state.formData, ...newData }
        })),

      clearFormData: () => 
        set({ formData: {}, currentStepIndex: 0 }),

      setSteps: (steps) => 
        set({ steps }),

      setCurrentStep: (stepIndex) => 
        set({ currentStepIndex: stepIndex }),

      getStepProgress: (stepIndex: number) => {
        const { steps, formData } = get();
        const step = steps[stepIndex];
        
        if (!step?.fields) return 0;
        
        const filledFields = step.fields.filter(field => {
          const value = formData[field.name];
          return value !== undefined && value !== "" && value !== null;
        });
        
        return Math.round((filledFields.length / step.fields.length) * 100);
      },

      getTotalProgress: () => {
        const { steps } = get();
        if (steps.length === 0) return 0;
        
        const totalProgress = steps.reduce((sum, _, index) => {
          return sum + get().getStepProgress(index);
        }, 0);
        
        return Math.round(totalProgress / steps.length);
      }
    }),
    {
      name: "udyam-form-store",
      partialize: (state) => ({
        formData: state.formData,
        currentStepIndex: state.currentStepIndex
      })
    }
  )
);