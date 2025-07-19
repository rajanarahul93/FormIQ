import { FormField } from "@/types/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FieldRendererProps {
  field: FormField;
  value?: string | number | boolean | undefined;
  onChange?: (value: string | number | boolean | undefined) => void;
  preview?: boolean;
}

export function FieldRenderer({
  field,
  value,
  onChange,
  preview = false,
}: FieldRendererProps) {
  const renderField = () => {
    const commonProps = {
      id: field.id,
      placeholder: field.placeholder,
      required: field.required,
      value:
        typeof value === "string" || typeof value === "number"
          ? value
          : typeof field.defaultValue === "string" ||
            typeof field.defaultValue === "number"
          ? field.defaultValue
          : "",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        onChange?.(e.target.value),
      disabled: !preview,
    };

    switch (field.type) {
      case "text":
        return <Input type="text" {...commonProps} />;

      case "email":
        return <Input type="email" {...commonProps} />;

      case "phone":
        return <Input type="tel" {...commonProps} />;

      case "password":
        return <Input type="password" {...commonProps} />;

      case "date":
        return <Input type="date" {...commonProps} />;

      case "number":
        return <Input type="number" {...commonProps} />;

      case "textarea":
        return (
          <Textarea
            {...commonProps}
            onChange={(e) => onChange?.(e.target.value)}
            rows={3}
          />
        );

      case "select":
        return (
          <Select
            value={
              typeof value === "string"
                ? value
                : typeof field.defaultValue === "string"
                ? field.defaultValue
                : undefined
            }
            onValueChange={(val) => onChange?.(val)}
            disabled={!preview}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={field.placeholder || "Select an option"}
              />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "checkbox":
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox id={`${field.id}-${index}`} disabled={!preview} />
                <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </div>
        );

      case "radio":
        return (
          <RadioGroup
            value={typeof value === "string" ? value : null}
            onValueChange={(val) => onChange?.(val)}
            disabled={!preview}
          >
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.id}-${index}`} />
                <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      default:
        return <Input {...commonProps} />;
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={field.id}>
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {renderField()}
    </div>
  );
}
