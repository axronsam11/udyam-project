"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { FieldRenderer } from "./FieldRenderer";
import { FormFooter } from "./FormFooter";
import { useFormStore } from "@/lib/store/formStore";
import { useFormPersistence } from "@/lib/hooks/useFormPersistence";
import { generateZodSchema } from "@/lib/schema/zodGenerator";
import { loadFormSchema } from "@/lib/schema/schemaLoader";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { toast } from "sonner";

interface FormStep {
  id: string;
  title: string;
  description?: string;
  fields: any[];
}

export function SchemaForm() {
  const [schema, setSchema] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const { 
    formData, 
    currentStepIndex, 
    updateFormData, 
    setCurrentStep: setStoreStep,
    setSteps
  } = useFormStore();
  
  const { saveFormData, setHasUnsavedChanges } = useFormPersistence();

  // Load schema on component mount
  useEffect(() => {
    const loadSchema = async () => {
      try {
        const schemaData = await loadFormSchema();
        setSchema(schemaData);
        setSteps(schemaData.steps);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load form schema:', error);
        toast.error('Failed to load form configuration');
        setIsLoading(false);
      }
    };
    
    loadSchema();
  }, [setSteps]);

  // Sync current step with store
  useEffect(() => {
    setCurrentStep(currentStepIndex);
  }, [currentStepIndex]);

  // Generate Zod schema for current step
  const currentStepSchema = schema?.steps[currentStep] 
    ? generateZodSchema(schema.steps[currentStep]) 
    : null;

  // Extract default values from schema
  const getSchemaDefaults = () => {
    if (!schema) return {};
    
    const defaults: any = {};
    schema.steps.forEach(step => {
      step.fields.forEach((field: any) => {
        if (field.defaultValue !== undefined) {
          defaults[field.name] = field.defaultValue;
        }
      });
    });
    return defaults;
  };

  // Merge schema defaults with existing form data
  const mergedDefaults = { ...getSchemaDefaults(), ...formData };

  const form = useForm({
    resolver: currentStepSchema ? zodResolver(currentStepSchema) : undefined,
    defaultValues: mergedDefaults,
    mode: "onChange"
  });

  const { watch, handleSubmit, formState: { isValid, errors } } = form;
  const watchedData = watch();

  // Auto-save form data
  useEffect(() => {
    const subscription = watch((data) => {
      updateFormData(data);
      setHasUnsavedChanges(true);
      
      // Debounced auto-save
      const timeoutId = setTimeout(() => {
        saveFormData(data);
      }, 2000);

      return () => clearTimeout(timeoutId);
    });

    return () => subscription.unsubscribe();
  }, [watch, updateFormData, saveFormData, setHasUnsavedChanges]);

  const onSubmit = (data: any) => {
    updateFormData(data);
    saveFormData(data);
    setHasUnsavedChanges(false);

    if (currentStep < schema.steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setStoreStep(nextStep);
      toast.success('Progress saved');
    } else {
      // Navigate to review page
      window.location.href = '/review';
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      setStoreStep(prevStep);
    }
  };

  const handleManualSave = async () => {
    const currentData = form.getValues();
    await saveFormData(currentData);
    setHasUnsavedChanges(false);
    toast.success('Form saved successfully');
  };

  if (isLoading || !schema) {
    return (
      <div className="space-y-6">
        <Card className="rounded-2xl animate-pulse">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentStepData = schema.steps[currentStep];
  const progress = ((currentStep + 1) / schema.steps.length) * 100;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Progress Bar */}
        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStep + 1} of {schema.steps.length}
              </span>
              <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">{currentStepData.title}</CardTitle>
                {currentStepData.description && (
                  <p className="text-gray-600">{currentStepData.description}</p>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Render Fields */}
                <div className="grid gap-6 md:grid-cols-2">
                  {currentStepData.fields.map((field: any) => (
                    <FieldRenderer
                      key={field.name}
                      field={field}
                      form={form}
                    />
                  ))}
                </div>

                {/* Validation Summary */}
                {Object.keys(errors).length > 0 && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <h4 className="text-sm font-medium text-red-800 mb-2">
                      Please fix the following errors:
                    </h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      {Object.entries(errors).map(([field, error]: [string, any]) => (
                        <li key={field}>• {error.message}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Form Footer */}
        <FormFooter
          currentStep={currentStep}
          totalSteps={schema.steps.length}
          isValid={isValid}
          isLastStep={currentStep === schema.steps.length - 1}
          onPrevious={handlePrevious}
          onSave={handleManualSave}
        />
      </form>
    </Form>
  );
}