"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface UnsavedChangesGuardProps {
  hasUnsavedChanges: boolean;
}

export function UnsavedChangesGuard({ hasUnsavedChanges }: UnsavedChangesGuardProps) {
  const router = useRouter();

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
        return "You have unsaved changes. Are you sure you want to leave?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  return null;
}