import { useState, useCallback, useEffect } from "react";
import { MockDataClient } from "@/lib/data/MockDataClient";

const dataClient = new MockDataClient();

interface FormPersistenceHook {
  formData: any;
  hasUnsavedChanges: boolean;
  saveFormData: (data: any) => Promise<void>;
  loadFormData: () => Promise<any>;
  clearFormData: () => Promise<void>;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  clearUnsavedChanges: () => void;
}

export function useFormPersistence(): FormPersistenceHook {
  const [formData, setFormData] = useState<any>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load form data on mount
  useEffect(() => {
    loadFormData();
  }, []);

  const saveFormData = useCallback(async (data: any) => {
    try {
      await dataClient.saveDraft(data);
      setFormData(data);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Failed to save form data:', error);
      throw error;
    }
  }, []);

  const loadFormData = useCallback(async () => {
    try {
      const data = await dataClient.loadDraft();
      if (data) {
        setFormData(data);
      }
      return data;
    } catch (error) {
      console.error('Failed to load form data:', error);
      throw error;
    }
  }, []);

  const clearFormData = useCallback(async () => {
    try {
      localStorage.removeItem('udyam_draft');
      setFormData({});
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Failed to clear form data:', error);
      throw error;
    }
  }, []);

  const clearUnsavedChanges = useCallback(() => {
    setHasUnsavedChanges(false);
  }, []);

  return {
    formData,
    hasUnsavedChanges,
    saveFormData,
    loadFormData,
    clearFormData,
    setHasUnsavedChanges,
    clearUnsavedChanges
  };
}