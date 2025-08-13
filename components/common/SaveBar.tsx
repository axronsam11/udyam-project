"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useFormPersistence } from "@/lib/hooks/useFormPersistence";
import { cn } from "@/lib/utils";
import { Save, Check, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function SaveBar() {
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const { hasUnsavedChanges, saveFormData, formData } = useFormPersistence();
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges) {
      const timeoutId = setTimeout(async () => {
        setSaveStatus("saving");
        try {
          await saveFormData(formData);
          setSaveStatus("saved");
          setLastSavedTime(new Date());
          setTimeout(() => setSaveStatus("idle"), 2000);
        } catch (error) {
          setSaveStatus("error");
          setTimeout(() => setSaveStatus("idle"), 3000);
        }
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [hasUnsavedChanges, formData, saveFormData]);

  const handleManualSave = async () => {
    setSaveStatus("saving");
    try {
      await saveFormData(formData);
      setSaveStatus("saved");
      setLastSavedTime(new Date());
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', { 
      hour12: true, 
      hour: 'numeric', 
      minute: '2-digit' 
    });
  };

  return (
    <AnimatePresence>
      {(hasUnsavedChanges || saveStatus !== "idle") && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-4 left-4 right-4 z-50 lg:left-auto lg:right-8 lg:w-80"
        >
          <Card className="shadow-lg border-0 bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {saveStatus === "saving" && (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                  )}
                  {saveStatus === "saved" && (
                    <Check className="h-4 w-4 text-green-500" />
                  )}
                  {saveStatus === "error" && (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  {saveStatus === "idle" && hasUnsavedChanges && (
                    <div className="h-2 w-2 rounded-full bg-orange-500" />
                  )}
                  
                  <div>
                    <div className={cn(
                      "text-sm font-medium",
                      saveStatus === "saved" && "text-green-700",
                      saveStatus === "error" && "text-red-700",
                      saveStatus === "saving" && "text-blue-700",
                      saveStatus === "idle" && hasUnsavedChanges && "text-orange-700"
                    )}>
                      {saveStatus === "saving" && "Saving..."}
                      {saveStatus === "saved" && "All changes saved"}
                      {saveStatus === "error" && "Failed to save"}
                      {saveStatus === "idle" && hasUnsavedChanges && "Unsaved changes"}
                    </div>
                    {lastSavedTime && saveStatus !== "saving" && (
                      <div className="text-xs text-gray-500">
                        Last saved at {formatTime(lastSavedTime)}
                      </div>
                    )}
                  </div>
                </div>

                {(hasUnsavedChanges || saveStatus === "error") && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleManualSave}
                    disabled={saveStatus === "saving"}
                    className="ml-2"
                  >
                    <Save className="h-3 w-3 mr-1" />
                    Save
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}