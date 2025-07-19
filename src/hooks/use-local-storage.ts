import { useEffect } from "react";
import { useFormStore } from "@/store/form-store";

const STORAGE_KEY = "formiq-autosave";
const AUTOSAVE_INTERVAL = 30000; // 30 seconds

export function useLocalStorage() {
  const { currentForm } = useFormStore();

  // Auto-save to localStorage
  useEffect(() => {
    const interval = setInterval(() => {
      if (
        currentForm &&
        (currentForm.fields.length > 0 || currentForm.title !== "Untitled Form")
      ) {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            form: currentForm,
            timestamp: new Date().toISOString(),
          })
        );
        useFormStore.setState({ lastSaved: new Date() });
      }
    }, AUTOSAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [currentForm]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const { form, timestamp } = JSON.parse(savedData);
        const savedDate = new Date(timestamp);
        const now = new Date();
        const hoursDiff =
          (now.getTime() - savedDate.getTime()) / (1000 * 60 * 60);

        // Only restore if saved within last 24 hours
        if (hoursDiff < 24 && form.fields.length > 0) {
          const shouldRestore = confirm(
            `Found an auto-saved form from ${savedDate.toLocaleString()}. Would you like to restore it?`
          );
          if (shouldRestore) {
            useFormStore.getState().loadForm(form);
          }
        }
      } catch (error) {
        console.error("Failed to load auto-saved form:", error);
      }
    }
  }, []);

  const clearAutoSave = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  return { clearAutoSave };
}