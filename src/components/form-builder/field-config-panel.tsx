import { useFormStore } from "@/store/form-store";
import { FormField } from "@/types/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus, Trash2, Settings } from "lucide-react";

export function FieldConfigPanel() {
  const { selectedFieldId, currentForm, updateField, selectField } =
    useFormStore();

  const selectedField = currentForm.fields.find(
    (f) => f.id === selectedFieldId
  );

  if (!selectedField) {
    return (
      <div className="w-80 border-l p-6 bg-muted/30">
        <div className="text-center py-12">
          <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">Field Settings</h3>
          <p className="text-sm text-muted-foreground">
            Select a field to edit its properties
          </p>
        </div>
      </div>
    );
  }

  const updateFieldProperty = (property: keyof FormField, value: any) => {
    updateField(selectedFieldId!, { [property]: value });
  };

  const addOption = () => {
    const currentOptions = selectedField.options || [];
    updateFieldProperty("options", [
      ...currentOptions,
      `Option ${currentOptions.length + 1}`,
    ]);
  };

  const updateOption = (index: number, value: string) => {
    const currentOptions = selectedField.options || [];
    const newOptions = [...currentOptions];
    newOptions[index] = value;
    updateFieldProperty("options", newOptions);
  };

  const removeOption = (index: number) => {
    const currentOptions = selectedField.options || [];
    const newOptions = currentOptions.filter((_, i) => i !== index);
    updateFieldProperty("options", newOptions);
  };

  const needsOptions = ["select", "checkbox", "radio"].includes(
    selectedField.type
  );

  return (
    <div className="w-80 border-l bg-background">
      <div className="sticky top-0 bg-background border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          <span className="font-semibold">Field Settings</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => selectField(null)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4 space-y-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
        {/* Field Type Badge */}
        <div>
          <Badge variant="secondary" className="capitalize">
            {selectedField.type} Field
          </Badge>
        </div>

        {/* Basic Properties */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Basic Properties</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="field-label">Label</Label>
              <Input
                id="field-label"
                value={selectedField.label}
                onChange={(e) => updateFieldProperty("label", e.target.value)}
                placeholder="Field label"
              />
            </div>

            <div>
              <Label htmlFor="field-placeholder">Placeholder</Label>
              <Input
                id="field-placeholder"
                value={selectedField.placeholder || ""}
                onChange={(e) =>
                  updateFieldProperty("placeholder", e.target.value)
                }
                placeholder="Placeholder text"
              />
            </div>

            <div>
              <Label htmlFor="field-default">Default Value</Label>
              <Input
                id="field-default"
                value={selectedField.defaultValue || ""}
                onChange={(e) =>
                  updateFieldProperty("defaultValue", e.target.value)
                }
                placeholder="Default value"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="field-required">Required Field</Label>
              <Switch
                id="field-required"
                checked={selectedField.required}
                onCheckedChange={(checked) =>
                  updateFieldProperty("required", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Options for Select/Radio/Checkbox */}
        {needsOptions && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedField.options?.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeOption(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={addOption} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Validation Rules */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Validation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(selectedField.type === "text" ||
              selectedField.type === "textarea") && (
              <>
                <div>
                  <Label htmlFor="min-length">Minimum Length</Label>
                  <Input
                    id="min-length"
                    type="number"
                    value={selectedField.validation?.minLength || ""}
                    onChange={(e) =>
                      updateFieldProperty("validation", {
                        ...selectedField.validation,
                        minLength: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      })
                    }
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="max-length">Maximum Length</Label>
                  <Input
                    id="max-length"
                    type="number"
                    value={selectedField.validation?.maxLength || ""}
                    onChange={(e) =>
                      updateFieldProperty("validation", {
                        ...selectedField.validation,
                        maxLength: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      })
                    }
                    placeholder="100"
                  />
                </div>
              </>
            )}

            {selectedField.type === "number" && (
              <>
                <div>
                  <Label htmlFor="min-value">Minimum Value</Label>
                  <Input
                    id="min-value"
                    type="number"
                    value={selectedField.validation?.min || ""}
                    onChange={(e) =>
                      updateFieldProperty("validation", {
                        ...selectedField.validation,
                        min: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="max-value">Maximum Value</Label>
                  <Input
                    id="max-value"
                    type="number"
                    value={selectedField.validation?.max || ""}
                    onChange={(e) =>
                      updateFieldProperty("validation", {
                        ...selectedField.validation,
                        max: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      })
                    }
                  />
                </div>
              </>
            )}

            <div>
              <Label htmlFor="custom-pattern">Custom Pattern (Regex)</Label>
              <Input
                id="custom-pattern"
                value={selectedField.validation?.pattern || ""}
                onChange={(e) =>
                  updateFieldProperty("validation", {
                    ...selectedField.validation,
                    pattern: e.target.value,
                  })
                }
                placeholder="^[A-Za-z]+$"
              />
            </div>
          </CardContent>
        </Card>

        {/* Conditional Logic */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Conditional Logic</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-4">
              Show this field only when certain conditions are met
            </p>

            {selectedField.conditional ? (
              <div className="space-y-3">
                <Select
                  value={selectedField.conditional.showWhen.fieldId}
                  onValueChange={(value) =>
                    updateFieldProperty("conditional", {
                      showWhen: {
                        ...selectedField.conditional!.showWhen,
                        fieldId: value,
                      },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentForm.fields
                      .filter((f) => f.id !== selectedFieldId)
                      .map((field) => (
                        <SelectItem key={field.id} value={field.id}>
                          {field.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedField.conditional.showWhen.condition}
                  onValueChange={(value: any) =>
                    updateFieldProperty("conditional", {
                      showWhen: {
                        ...selectedField.conditional!.showWhen,
                        condition: value,
                      },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equals">equals</SelectItem>
                    <SelectItem value="not_equals">does not equal</SelectItem>
                    <SelectItem value="contains">contains</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  value={selectedField.conditional.showWhen.value}
                  onChange={(e) =>
                    updateFieldProperty("conditional", {
                      showWhen: {
                        ...selectedField.conditional!.showWhen,
                        value: e.target.value,
                      },
                    })
                  }
                  placeholder="Value to compare"
                />

                <Button
                  variant="outline"
                  onClick={() => updateFieldProperty("conditional", undefined)}
                  className="w-full"
                >
                  Remove Condition
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={() =>
                  updateFieldProperty("conditional", {
                    showWhen: { fieldId: "", condition: "equals", value: "" },
                  })
                }
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Condition
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}