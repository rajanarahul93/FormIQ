import { useState } from "react";
import { formTemplates } from "@/data/form-templates";
import { useFormStore } from "@/store/form-store";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutTemplate,
  Search,
  FileText,
  Users,
  Calendar,
  MessageSquare,
  Briefcase,
  Plus,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";

const templateIcons = {
  "Contact Form": FileText,
  "User Registration": Users,
  "Event Registration": Calendar,
  "Customer Feedback": MessageSquare,
  "Job Application": Briefcase,
};

export function TemplatesPanel() {
  const { loadForm, currentForm } = useFormStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<
    (typeof formTemplates)[0] | null
  >(null);

  const filteredTemplates = formTemplates.filter(
    (template) =>
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const useTemplate = (template: (typeof formTemplates)[0]) => {
    const newForm = {
      ...template,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    loadForm(newForm);
  };

  const hasUnsavedChanges =
    currentForm.fields.length > 0 || currentForm.title !== "Untitled Form";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <LayoutTemplate className="h-5 w-5" />
        <h3 className="font-semibold">Form Templates</h3>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Templates Grid */}
      <ScrollArea className="h-[400px]">
        <div className="grid gap-3">
          {filteredTemplates.map((template) => {
            const IconComponent =
              templateIcons[template.title as keyof typeof templateIcons] ||
              FileText;

            return (
              <Card
                key={template.title}
                className="cursor-pointer hover:bg-accent/50 transition-colors"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4" />
                      <CardTitle className="text-sm">
                        {template.title}
                      </CardTitle>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {template.fields.length} fields
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {template.description}
                  </p>

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => setSelectedTemplate(template)}
                        >
                          Preview
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <IconComponent className="h-5 w-5" />
                            {selectedTemplate?.title}
                          </DialogTitle>
                          <DialogDescription>
                            {selectedTemplate?.description}
                          </DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="max-h-96">
                          <div className="space-y-4 p-4 border rounded-lg">
                            {selectedTemplate?.fields.map((field, index) => (
                              <div key={index} className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">
                                    {field.label}
                                  </span>
                                  {field.required && (
                                    <Badge
                                      variant="destructive"
                                      className="text-xs"
                                    >
                                      Required
                                    </Badge>
                                  )}
                                  <Badge
                                    variant="outline"
                                    className="text-xs capitalize"
                                  >
                                    {field.type}
                                  </Badge>
                                </div>
                                {field.placeholder && (
                                  <p className="text-xs text-muted-foreground">
                                    Placeholder: {field.placeholder}
                                  </p>
                                )}
                                {field.options && (
                                  <p className="text-xs text-muted-foreground">
                                    Options: {field.options.join(", ")}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => {
                              if (selectedTemplate) {
                                if (hasUnsavedChanges) {
                                  const confirmed = confirm(
                                    "You have unsaved changes. Are you sure you want to load this template?"
                                  );
                                  if (confirmed) {
                                    useTemplate(selectedTemplate);
                                  }
                                } else {
                                  useTemplate(selectedTemplate);
                                }
                              }
                            }}
                            className="flex-1"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Use Template
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      size="sm"
                      onClick={() => {
                        if (hasUnsavedChanges) {
                          const confirmed = confirm(
                            "You have unsaved changes. Are you sure you want to load this template?"
                          );
                          if (confirmed) {
                            useTemplate(template);
                          }
                        } else {
                          useTemplate(template);
                        }
                      }}
                      className="flex-1"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Use
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}