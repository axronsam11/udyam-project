"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Save, Eye } from "lucide-react";
import Link from "next/link";

interface FormFooterProps {
  currentStep: number;
  totalSteps: number;
  isValid: boolean;
  isLastStep: boolean;
  onPrevious: () => void;
  onSave: () => void;
}

export function FormFooter({
  currentStep,
  totalSteps,
  isValid,
  isLastStep,
  onPrevious,
  onSave
}: FormFooterProps) {
  return (
    <Card className="rounded-2xl shadow-lg border-t-4 border-t-blue-500">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          {/* Left side - Previous button */}
          <div className="flex gap-3">
            {currentStep > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={onPrevious}
                className="min-w-[120px]"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
            )}
            
            <Button
              type="button"
              variant="ghost"
              onClick={onSave}
              className="min-w-[100px]"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>

          {/* Center - Step info */}
          <div className="text-sm text-gray-600 text-center">
            Step {currentStep + 1} of {totalSteps}
          </div>

          {/* Right side - Next/Review buttons */}
          <div className="flex gap-3">
            {currentStep < totalSteps - 1 && (
              <Link href="/review">
                <Button variant="outline" className="min-w-[120px]">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </Link>
            )}
            
            <Button
              type="submit"
              disabled={!isValid}
              className="min-w-[120px] bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700"
            >
              {isLastStep ? (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Review
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Validation warning */}
        {!isValid && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              Please fill in all required fields to continue to the next step.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}