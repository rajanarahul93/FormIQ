import { useState } from "react";
import { useFormStore } from "@/store/form-store";
import { FieldRenderer } from "@/components/form-builder/field-renderer";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SmartTools } from "@/components/form-builder/smart-tools";
import { Eye, Smartphone, Monitor, Tablet } from "lucide-react";

type PreviewMode = "desktop" | "tablet" | "mobile";

export function LivePreview() {
  const { currentForm } = useFormStore();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Form submitted! Check console for data.");
  };

  const getPreviewWidth = () => {
    switch (previewMode) {
      case "mobile":
        return "max-w-sm";
      case "tablet":
        return "max-w-md";
      default:
        return "max-w-2xl";
    }
  };

  if (!isPreviewMode) {
    return (
      <div className="w-96 border-l p-6 bg-muted/30 space-y-6">
        {/* Preview Toggle */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Live Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setIsPreviewMode(true)} className="w-full">
              <Eye className="h-4 w-4 mr-2" />
              Enter Preview Mode
            </Button>
          </CardContent>
        </Card>

        {/* Mini Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Form Structure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm font-medium">{currentForm.title}</div>
            {currentForm.description && (
              <p className="text-xs text-muted-foreground">
                {currentForm.description}
              </p>
            )}
            <div className="space-y-1">
              {currentForm.fields.map((field) => (
                <div key={field.id} className="flex items-center gap-2 text-xs">
                  <Badge variant="outline" className="text-xs">
                    {field.type}
                  </Badge>
                  <span className="truncate">{field.label}</span>
                  {field.required && <span className="text-red-500">*</span>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Smart Tools */}
        <SmartTools />
      </div>
    );
  }

  return (
    <div className="w-96 border-l bg-background">
      {/* Preview Controls */}
      <div className="sticky top-0 bg-background border-b p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Live Preview</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPreviewMode(false)}
          >
            Exit Preview
          </Button>
        </div>

        {/* Device Toggle */}
        <div className="flex gap-1">
          <Button
            variant={previewMode === "desktop" ? "default" : "outline"}
            size="sm"
            onClick={() => setPreviewMode("desktop")}
          >
            <Monitor className="h-4 w-4" />
          </Button>
          <Button
            variant={previewMode === "tablet" ? "default" : "outline"}
            size="sm"
            onClick={() => setPreviewMode("tablet")}
          >
            <Tablet className="h-4 w-4" />
          </Button>
          <Button
            variant={previewMode === "mobile" ? "default" : "outline"}
            size="sm"
            onClick={() => setPreviewMode("mobile")}
          >
            <Smartphone className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="p-4">
        <div className={`mx-auto ${getPreviewWidth()}`}>
          <Card>
            <CardHeader>
              <CardTitle>{currentForm.title}</CardTitle>
              {currentForm.description && (
                <p className="text-muted-foreground">
                  {currentForm.description}
                </p>
              )}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {currentForm.fields.map((field) => (
                  <FieldRenderer
                    key={field.id}
                    field={field}
                    value={formData[field.id]}
                    onChange={(value) => handleFieldChange(field.id, value)}
                    preview={true}
                  />
                ))}

                {currentForm.fields.length > 0 && (
                  <Button type="submit" className="w-full">
                    Submit Form
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}