
import { useFormStore } from "@/store/form-store";
import { faker } from "@faker-js/faker";
import { DraggableField } from "@/components/form-builder/draggable-field";
import { TemplatesPanel } from "@/components/form-builder/templates-panel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  Zap,
  LayoutTemplate,
  Settings as SettingsIcon,
  Trash,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const fieldTypes = [
  { id: "text", label: "Text Input" },
  { id: "email", label: "Email" },
  { id: "phone", label: "Phone" },
  { id: "password", label: "Password" },
  { id: "date", label: "Date" },
  { id: "number", label: "Number" },
  { id: "textarea", label: "Text Area" },
  { id: "select", label: "Dropdown" },
  { id: "checkbox", label: "Checkbox" },
  { id: "radio", label: "Radio Group" },
] as const;

type FormField = {
  id: string;
  type: string;
  label: string;
  options?: string[];
};

type Form = {
  fields: FormField[];
  title?: string;
  description?: string;
};

function generateFakeData(currentForm: Form, toast: ReturnType<typeof useToast>["toast"]) {
  const fakeData: Record<string, string | number | string[]> = {};

  currentForm.fields.forEach((field: FormField) => {
    switch (field.type) {
      case "text":
        if (field.label.toLowerCase().includes("name")) {
          fakeData[field.id] = faker.person.fullName();
        } else if (field.label.toLowerCase().includes("city")) {
          fakeData[field.id] = faker.location.city();
        } else {
          fakeData[field.id] = faker.lorem.words(3);
        }
        break;
      case "email":
        fakeData[field.id] = faker.internet.email();
        break;
      case "phone":
        fakeData[field.id] = faker.phone.number();
        break;
      case "date":
        fakeData[field.id] = faker.date.recent().toISOString().split("T")[0];
        break;
      case "number":
        fakeData[field.id] = faker.number.int({ min: 1, max: 100 });
        break;
      case "textarea":
        fakeData[field.id] = faker.lorem.paragraph();
        break;
      case "select":
      case "radio":
        if (field.options && field.options.length > 0) {
          fakeData[field.id] = faker.helpers.arrayElement(field.options);
        }
        break;
      case "checkbox":
        if (field.options && field.options.length > 0) {
          fakeData[field.id] = faker.helpers.arrayElements(field.options, {
            min: 1,
            max: field.options.length,
          });
        }
        break;
    }
  });

  // Apply fake data to form inputs
  Object.entries(fakeData).forEach(([fieldId, value]) => {
    const input = document.getElementById(fieldId) as HTMLInputElement;
    if (input) {
      input.value = Array.isArray(value) ? value.join(", ") : String(value);
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }
  });

  toast({
    title: "Form filled with fake data",
    description: "All fields have been populated with realistic sample data.",
  });
}

function clearForm(currentForm: Form, toast: ReturnType<typeof useToast>["toast"]) {
  currentForm.fields.forEach((field: FormField) => {
    const input = document.getElementById(field.id) as HTMLInputElement;
    if (input) {
      input.value = "";
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }
  });

  toast({
    title: "Form cleared",
    description: "All field values have been cleared.",
  });
}
export function Sidebar() {
  const { currentForm, updateFormMeta } = useFormStore();
  const { toast } = useToast();
  return (
    <aside className="w-80 border-r bg-background/50 backdrop-blur flex flex-col">
      <Tabs defaultValue="fields" className="flex flex-col h-full">
        {/* Fixed Tab Headers */}
        <div className="flex-shrink-0">
          <TabsList className="grid w-full grid-cols-3 m-4 mb-0">
            <TabsTrigger value="fields" className="text-xs">
              <Plus className="h-4 w-4 mr-1" />
              Fields
            </TabsTrigger>
            <TabsTrigger value="templates" className="text-xs">
              <LayoutTemplate className="h-4 w-4 mr-1" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs">
              <SettingsIcon className="h-4 w-4 mr-1" />
              Settings
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Scrollable Tab Content */}
        <div className="flex-1 min-h-0">
          <TabsContent value="fields" className="h-full m-0">
            <ScrollArea className="h-full">
              <div className="p-6 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Plus className="h-5 w-5" />
                    <h2 className="font-semibold text-lg">Add Fields</h2>
                  </div>

                  <div className="grid gap-2">
                    {fieldTypes.map((field) => (
                      <DraggableField
                        key={field.id}
                        type={field.id}
                        label={field.label}
                      />
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Smart Tools - Now properly contained in scroll area */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Form Testing</h4>
                  <div className="grid gap-2">
                    <Button
                      variant="outline"
                      onClick={() => generateFakeData(currentForm, toast)}
                      className="justify-start"
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Fill with Fake Data
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => clearForm(currentForm, toast)}
                      className="justify-start"
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Clear All Fields
                    </Button>
                  </div>
                </div>

                {/* Additional spacing at bottom to ensure scroll works properly */}
                <div className="h-4"></div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="templates" className="h-full m-0">
            <ScrollArea className="h-full">
              <div className="p-6">
                <TemplatesPanel />
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="settings" className="h-full m-0">
            <ScrollArea className="h-full">
              <div className="p-6 space-y-6">
                <h2 className="font-semibold text-lg">Form Settings</h2>
                <Card className="p-4 space-y-4">
                  <div>
                    <Label htmlFor="form-title">Form Title</Label>
                    <Input
                      id="form-title"
                      value={currentForm.title}
                      onChange={(e) =>
                        updateFormMeta({ title: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="form-description">Description</Label>
                    <Textarea
                      id="form-description"
                      value={currentForm.description}
                      onChange={(e) =>
                        updateFormMeta({ description: e.target.value })
                      }
                      className="mt-1 resize-none"
                      rows={3}
                    />
                  </div>
                </Card>
              </div>
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </aside>
  );
}
