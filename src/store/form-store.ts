import { create } from "zustand";
import { FormData, FormField } from "@/types/form";
import { useHistoryStore } from "./history-store";
import { v4 as uuidv4 } from "uuid";

interface FormStore {
  // State
  currentForm: FormData;
  selectedFieldId: string | null;
  isDragging: boolean;
  isAutoSaving: boolean;
  lastSaved: Date | null;

  // Actions
  addField: (field: Omit<FormField, "id">) => void;
  updateField: (id: string, updates: Partial<FormField>) => void;
  removeField: (id: string) => void;
  duplicateField: (id: string) => void;
  reorderFields: (fromIndex: number, toIndex: number) => void;
  selectField: (id: string | null) => void;
  updateFormMeta: (updates: { title?: string; description?: string }) => void;
  setDragging: (isDragging: boolean) => void;
  resetForm: () => void;
  loadForm: (form: FormData) => void;
  undo: () => void;
  redo: () => void;
  saveToHistory: () => void;
  bulkUpdateFields: (updates: {
    fieldIds: string[];
    updates: Partial<FormField>;
  }) => void;
  importForm: (json: string) => void;
}

const defaultForm: FormData = {
  id: uuidv4(),
  title: "Untitled Form",
  description: "",
  fields: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const useFormStore = create<FormStore>((set, get) => ({
  currentForm: defaultForm,
  selectedFieldId: null,
  isDragging: false,
  isAutoSaving: false,
  lastSaved: null,

  saveToHistory: () => {
    const { currentForm } = get();
    useHistoryStore.getState().saveState(currentForm);
  },

  addField: (field) => {
    const newField: FormField = {
      ...field,
      id: uuidv4(),
    };

    set((state) => ({
      currentForm: {
        ...state.currentForm,
        fields: [...state.currentForm.fields, newField],
        updatedAt: new Date(),
      },
    }));

    get().saveToHistory();
  },

  updateField: (id, updates) => {
    set((state) => ({
      currentForm: {
        ...state.currentForm,
        fields: state.currentForm.fields.map((field) =>
          field.id === id ? { ...field, ...updates } : field
        ),
        updatedAt: new Date(),
      },
    }));

    // Debounce history saving for frequent updates
    setTimeout(() => get().saveToHistory(), 500);
  },

  duplicateField: (id) => {
    const { currentForm } = get();
    const fieldToDuplicate = currentForm.fields.find((f) => f.id === id);

    if (fieldToDuplicate) {
      const duplicatedField: FormField = {
        ...fieldToDuplicate,
        id: uuidv4(),
        label: `${fieldToDuplicate.label} (Copy)`,
      };

      const fieldIndex = currentForm.fields.findIndex((f) => f.id === id);
      const newFields = [...currentForm.fields];
      newFields.splice(fieldIndex + 1, 0, duplicatedField);

      set((state) => ({
        currentForm: {
          ...state.currentForm,
          fields: newFields,
          updatedAt: new Date(),
        },
      }));

      get().saveToHistory();
    }
  },

  removeField: (id) => {
    set((state) => ({
      currentForm: {
        ...state.currentForm,
        fields: state.currentForm.fields.filter((field) => field.id !== id),
        updatedAt: new Date(),
      },
      selectedFieldId:
        state.selectedFieldId === id ? null : state.selectedFieldId,
    }));

    get().saveToHistory();
  },

  reorderFields: (fromIndex, toIndex) => {
    set((state) => {
      const fields = [...state.currentForm.fields];
      const [movedField] = fields.splice(fromIndex, 1);
      fields.splice(toIndex, 0, movedField);

      return {
        currentForm: {
          ...state.currentForm,
          fields,
          updatedAt: new Date(),
        },
      };
    });

    get().saveToHistory();
  },

  bulkUpdateFields: ({ fieldIds, updates }) => {
    set((state) => ({
      currentForm: {
        ...state.currentForm,
        fields: state.currentForm.fields.map((field) =>
          fieldIds.includes(field.id) ? { ...field, ...updates } : field
        ),
        updatedAt: new Date(),
      },
    }));

    get().saveToHistory();
  },

  selectField: (id) => {
    set({ selectedFieldId: id });
  },

  updateFormMeta: (updates) => {
    set((state) => ({
      currentForm: {
        ...state.currentForm,
        ...updates,
        updatedAt: new Date(),
      },
    }));

    get().saveToHistory();
  },

  setDragging: (isDragging) => {
    set({ isDragging });
  },

  resetForm: () => {
    set({
      currentForm: { ...defaultForm, id: uuidv4(), createdAt: new Date() },
      selectedFieldId: null,
      isDragging: false,
    });

    useHistoryStore.getState().clearHistory();
    get().saveToHistory();
  },

  loadForm: (form) => {
    set({
      currentForm: form,
      selectedFieldId: null,
    });

    useHistoryStore.getState().clearHistory();
    get().saveToHistory();
  },

  undo: () => {
    const previousState = useHistoryStore.getState().undo();
    if (previousState) {
      set({
        currentForm: previousState,
        selectedFieldId: null,
      });
    }
  },

  redo: () => {
    const nextState = useHistoryStore.getState().redo();
    if (nextState) {
      set({
        currentForm: nextState,
        selectedFieldId: null,
      });
    }
  },

  importForm: (json) => {
    try {
      const formData = JSON.parse(json) as FormData;
      // Validate the imported data
      if (formData.fields && Array.isArray(formData.fields)) {
        get().loadForm({
          ...formData,
          id: uuidv4(), // Generate new ID for imported form
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    } catch (error) {
      console.error("Failed to import form:", error);
      throw new Error("Invalid form data");
    }
  },
}));