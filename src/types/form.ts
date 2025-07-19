export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  defaultValue?: string;
  options?: string[]; // for dropdowns, radio, checkbox groups
  validation?: ValidationRules;
  conditional?: ConditionalLogic;
}

export type FieldType =
  | "text"
  | "email"
  | "phone"
  | "password"
  | "date"
  | "select"
  | "checkbox"
  | "radio"
  | "number"
  | "textarea";

export interface ValidationRules {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  min?: number;
  max?: number;
}

export interface ConditionalLogic {
  showWhen: {
    fieldId: string;
    condition: "equals" | "not_equals" | "contains";
    value: string;
  };
}

export interface FormData {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  createdAt: Date;
  updatedAt: Date;
}