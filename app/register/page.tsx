"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SchemaForm } from "@/components/forms/SchemaForm";
import { FormStepper } from "@/components/common/FormStepper";
import { SaveBar } from "@/components/common/SaveBar";
import { UnsavedChangesGuard } from "@/components/common/UnsavedChangesGuard";
import { useFormPersistence } from "@/lib/hooks/useFormPersistence";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Info } from "lucide-react";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { hasUnsavedChanges, clearUnsavedChanges } = useFormPersistence();

  useEffect(() => {
    // Simulate schema loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 py-8">
          {/* Header Skeleton */}
          <div className="mb-8 text-center">
            <Skeleton className="mx-auto mb-4 h-8 w-64" />
            <Skeleton className="mx-auto h-4 w-96" />
          </div>

          {/* Stepper Skeleton */}
          <div className="mb-8">
            <div className="flex justify-center space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-10 w-10 rounded-full" />
              ))}
            </div>
          </div>

          {/* Form Skeleton */}
          <div className="space-y-6">
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Alert className="max-w-md">
          <Info className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <UnsavedChangesGuard hasUnsavedChanges={hasUnsavedChanges} />
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="mx-auto max-w-6xl px-4 py-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Udyam Registration Form
              </h1>
              <p className="text-gray-600">
                Complete all sections to register your enterprise
              </p>
            </motion.div>

            {/* Important Notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-6"
            >
              <Alert className="border-amber-200 bg-amber-50">
                <Info className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800 text-sm">
                  <span className="font-semibold">Disclaimer:</span> This is a demonstration portal. 
                  No actual registration will be processed. All data is stored locally in your browser.
                </AlertDescription>
              </Alert>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="grid gap-8 lg:grid-cols-4">
            {/* Sidebar with Stepper */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <FormStepper />
              </div>
            </div>

            {/* Form Content */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <SchemaForm />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <SaveBar />
      </div>
    </>
  );
}