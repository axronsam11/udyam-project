"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useFormStore } from "@/lib/store/formStore";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, ChevronUp, Circle } from "lucide-react";

export function FormStepper() {
  const [isOpen, setIsOpen] = useState(false);
  const { steps, currentStepIndex, setCurrentStep, formData } = useFormStore();

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStepIndex) return "completed";
    if (stepIndex === currentStepIndex) return "current";
    return "upcoming";
  };

  const getStepProgress = (step: any) => {
    if (!step?.fields) return 0;
    
    const filledFields = step.fields.filter((field: any) => {
      const value = formData[field.name];
      return value !== undefined && value !== "" && value !== null;
    });
    
    return Math.round((filledFields.length / step.fields.length) * 100);
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const StepIcon = ({ status, stepNumber }: { status: string; stepNumber: number }) => {
    switch (status) {
      case "completed":
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white">
            <Check className="h-4 w-4" />
          </div>
        );
      case "current":
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white font-semibold">
            {stepNumber}
          </div>
        );
      default:
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 text-gray-300">
            <Circle className="h-4 w-4" />
          </div>
        );
    }
  };

  return (
    <Card className="rounded-2xl shadow-lg">
      <CardContent className="p-6">
        {/* Mobile Collapsible Header */}
        <div className="lg:hidden">
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0">
                <span className="font-semibold">Progress Overview</span>
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <StepperContent />
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Desktop Always Visible */}
        <div className="hidden lg:block">
          <h3 className="font-semibold mb-4">Progress Overview</h3>
          <StepperContent />
        </div>
      </CardContent>
    </Card>
  );

  function StepperContent() {
    return (
      <div className="space-y-4">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const progress = getStepProgress(step);

          return (
            <div key={step.id} className="space-y-2">
              <button
                onClick={() => handleStepClick(index)}
                className={cn(
                  "w-full text-left p-3 rounded-xl transition-all duration-200 border",
                  status === "current" 
                    ? "bg-blue-50 border-blue-200 shadow-sm"
                    : status === "completed"
                    ? "bg-green-50 border-green-200 hover:bg-green-100"
                    : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                )}
              >
                <div className="flex items-center gap-3">
                  <StepIcon status={status} stepNumber={index + 1} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={cn(
                        "text-sm font-medium truncate",
                        status === "current" ? "text-blue-900" : "text-gray-900"
                      )}>
                        {step.title}
                      </h4>
                      <Badge 
                        variant={status === "completed" ? "default" : "secondary"} 
                        className="ml-2 text-xs"
                      >
                        {progress}%
                      </Badge>
                    </div>
                    {step.description && (
                      <p className="text-xs text-gray-600 mt-1 truncate">
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>
              </button>

              {/* Progress bar for current step */}
              {status === "current" && (
                <div className="ml-11 mr-3">
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-300 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }
}