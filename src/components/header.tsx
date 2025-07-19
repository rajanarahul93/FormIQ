import { useState } from "react";
import { FormIQLogo } from "@/components/formiq-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFormStore } from "@/store/form-store";
import { useHistoryStore } from "@/store/history-store";
import { useToast } from "@/hooks/use-toast";
import { FieldRenderer } from "@/components/form-builder/field-renderer";
import {
  Play,
  Download,
  Undo,
  Redo,
  Upload,
  FileJson,
  FileText,
  Code2,
  Eye,
  ChevronDown,
} from "lucide-react";

export function Header() {
  const { undo, redo, currentForm } = useFormStore();
  const { canUndo, canRedo } = useHistoryStore();
  const { toast } = useToast();
  const [formData, setFormData] = useState<Record<string, string | number | boolean | undefined>>({});
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const json = e.target?.result as string;
            useFormStore.getState().importForm(json);
            toast({
              title: "Form imported successfully",
              description: "Your form has been loaded from the JSON file.",
            });
          } catch {
            toast({
              title: "Import failed",
              description: "Failed to import form. Please check the file format.",
              variant: "destructive"
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handlePreview = () => {
    if (currentForm.fields.length === 0) {
      toast({
        title: "No fields to preview",
        description: "Add some fields to your form first.",
        variant: "destructive"
      });
      return;
    }
    setIsPreviewOpen(true);
  };

  const handleFieldChange = (
    fieldId: string,
    value: string | number | boolean | undefined
  ) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handlePreviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Preview Form Data:', formData);
    toast({
      title: "Form submitted (Preview Mode)",
      description: "Form data has been logged to console.",
    });
  };

  // Export Functions
  const exportFormJSON = () => {
    const formData = {
      ...currentForm,
      exportedAt: new Date().toISOString(),
      version: "1.0",
    };

    const blob = new Blob([JSON.stringify(formData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentForm.title
      .replace(/\s+/g, "-")
      .toLowerCase()}-form.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Form exported as JSON",
      description: "JSON file has been downloaded successfully.",
    });
  };

  const exportFormHTML = () => {
    if (currentForm.fields.length === 0) {
      toast({
        title: "No fields to export",
        description: "Add some fields to your form first.",
        variant: "destructive"
      });
      return;
    }

    let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${currentForm.title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 min-h-screen py-8">
    <div class="max-w-2xl mx-auto">
        <form class="bg-white p-8 rounded-lg shadow-md" onsubmit="handleSubmit(event)">
            <h2 class="text-3xl font-bold mb-2 text-gray-800">${currentForm.title}</h2>`;

    if (currentForm.description) {
      html += `
            <p class="text-gray-600 mb-6">${currentForm.description}</p>`;
    }

    currentForm.fields.forEach((field) => {
      html += `
            <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2" for="${field.id}">
                    ${field.label}${field.required ? ' <span class="text-red-500">*</span>' : ""}
                </label>`;

      switch (field.type) {
        case "textarea":
          html += `
                <textarea id="${field.id}" name="${field.id}" 
                    class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    ${field.required ? "required" : ""} 
                    placeholder="${field.placeholder || ""}" 
                    rows="4">${field.defaultValue || ""}</textarea>`;
          break;
        case "select":
          html += `
                <select id="${field.id}" name="${field.id}" 
                    class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    ${field.required ? "required" : ""}>
                    <option value="">${field.placeholder || "Select an option"}</option>`;
          field.options?.forEach((option) => {
            html += `
                    <option value="${option}" ${field.defaultValue === option ? "selected" : ""}>${option}</option>`;
          });
          html += `
                </select>`;
          break;
        case "checkbox":
          html += `
                <div class="space-y-2">`;
          field.options?.forEach((option) => {
            html += `
                    <label class="flex items-center space-x-2">
                        <input type="checkbox" name="${field.id}" value="${option}" 
                            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                        <span class="text-sm">${option}</span>
                    </label>`;
          });
          html += `
                </div>`;
          break;
        case "radio":
          html += `
                <div class="space-y-2">`;
          field.options?.forEach((option) => {
            html += `
                    <label class="flex items-center space-x-2">
                        <input type="radio" name="${field.id}" value="${option}" 
                            class="border-gray-300 text-blue-600 focus:ring-blue-500">
                        <span class="text-sm">${option}</span>
                    </label>`;
          });
          html += `
                </div>`;
          break;
        default:
          html += `
                <input type="${field.type}" id="${field.id}" name="${field.id}" 
                    class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    ${field.required ? "required" : ""} 
                    placeholder="${field.placeholder || ""}" 
                    value="${field.defaultValue || ""}">`;
      }

      html += `
            </div>`;
    });

    html += `
            <button type="submit" 
                class="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 font-medium">
                Submit Form
            </button>
        </form>
    </div>

    <script>
        function handleSubmit(event) {
            event.preventDefault();
            const formData = new FormData(event.target);
            const data = {};
            for (let [key, value] of formData.entries()) {
                if (data[key]) {
                    if (Array.isArray(data[key])) {
                        data[key].push(value);
                    } else {
                        data[key] = [data[key], value];
                    }
                } else {
                    data[key] = value;
                }
            }
            console.log('Form Data:', data);
            alert('Form submitted! Check console for data.');
        }
    </script>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentForm.title
      .replace(/\s+/g, "-")
      .toLowerCase()}-form.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Form exported as HTML",
      description: "Complete HTML file has been downloaded successfully.",
    });
  };

  const exportReactComponent = () => {
    if (currentForm.fields.length === 0) {
      toast({
        title: "No fields to export",
        description: "Add some fields to your form first.",
        variant: "destructive"
      });
      return;
    }

    let reactCode = `import React, { useState } from 'react';\n\n`;
    reactCode += `export function ${currentForm.title.replace(/\s+/g, '')}Form() {\n`;
    reactCode += `  const [formData, setFormData] = useState({\n`;
    
    currentForm.fields.forEach((field, index) => {
      const comma = index < currentForm.fields.length - 1 ? ',' : '';
      reactCode += `    ${field.id}: '${field.defaultValue || ''}'${comma}\n`;
    });
    
    reactCode += `  });\n\n`;
    reactCode += `  const handleChange = (e) => {\n`;
    reactCode += `    const { name, value, type, checked } = e.target;\n`;
    reactCode += `    setFormData(prev => ({\n`;
    reactCode += `      ...prev,\n`;
    reactCode += `      [name]: type === 'checkbox' ? checked : value\n`;
    reactCode += `    }));\n`;
    reactCode += `  };\n\n`;
    reactCode += `  const handleSubmit = (e) => {\n`;
    reactCode += `    e.preventDefault();\n`;
    reactCode += `    console.log('Form submitted:', formData);\n`;
    reactCode += `    // Add your form submission logic here\n`;
    reactCode += `  };\n\n`;
    reactCode += `  return (\n`;
    reactCode += `    <div className="max-w-2xl mx-auto p-6">\n`;
    reactCode += `      <form onSubmit={handleSubmit} className="space-y-6">\n`;
    reactCode += `        <div>\n`;
    reactCode += `          <h2 className="text-3xl font-bold text-gray-900">${currentForm.title}</h2>\n`;
    
    if (currentForm.description) {
      reactCode += `          <p className="mt-1 text-sm text-gray-600">${currentForm.description}</p>\n`;
    }
    
    reactCode += `        </div>\n\n`;

    currentForm.fields.forEach(field => {
      reactCode += `        <div>\n`;
      reactCode += `          <label htmlFor="${field.id}" className="block text-sm font-medium text-gray-700">\n`;
      reactCode += `            ${field.label}${field.required ? ' *' : ''}\n`;
      reactCode += `          </label>\n`;
      
      if (field.type === 'textarea') {
        reactCode += `          <textarea\n`;
        reactCode += `            id="${field.id}"\n`;
        reactCode += `            name="${field.id}"\n`;
        reactCode += `            value={formData.${field.id}}\n`;
        reactCode += `            onChange={handleChange}\n`;
        reactCode += `            placeholder="${field.placeholder || ''}"\n`;
        reactCode += `            ${field.required ? 'required' : ''}\n`;
        reactCode += `            rows={4}\n`;
        reactCode += `            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"\n`;
        reactCode += `          />\n`;
      } else if (field.type === 'select') {
        reactCode += `          <select\n`;
        reactCode += `            id="${field.id}"\n`;
        reactCode += `            name="${field.id}"\n`;
        reactCode += `            value={formData.${field.id}}\n`;
        reactCode += `            onChange={handleChange}\n`;
        reactCode += `            ${field.required ? 'required' : ''}\n`;
        reactCode += `            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"\n`;
        reactCode += `          >\n`;
        reactCode += `            <option value="">${field.placeholder || 'Select an option'}</option>\n`;
        field.options?.forEach(option => {
          reactCode += `            <option value="${option}">${option}</option>\n`;
        });
        reactCode += `          </select>\n`;
      } else {
        reactCode += `          <input\n`;
        reactCode += `            type="${field.type}"\n`;
        reactCode += `            id="${field.id}"\n`;
        reactCode += `            name="${field.id}"\n`;
        reactCode += `            value={formData.${field.id}}\n`;
        reactCode += `            onChange={handleChange}\n`;
        reactCode += `            placeholder="${field.placeholder || ''}"\n`;
        reactCode += `            ${field.required ? 'required' : ''}\n`;
        reactCode += `            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"\n`;
        reactCode += `          />\n`;
      }
      
      reactCode += `        </div>\n\n`;
    });

    reactCode += `        <button\n`;
    reactCode += `          type="submit"\n`;
    reactCode += `          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"\n`;
    reactCode += `        >\n`;
    reactCode += `          Submit\n`;
    reactCode += `        </button>\n`;
    reactCode += `      </form>\n`;
    reactCode += `    </div>\n`;
    reactCode += `  );\n`;
    reactCode += `}\n`;

    const blob = new Blob([reactCode], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentForm.title.replace(/\s+/g, '')}-form-component.jsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "React component exported",
      description: "Complete React component has been downloaded as JSX file.",
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <FormIQLogo />
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">FormIQ</h1>
            <Badge variant="secondary" className="text-xs">
              Pro
            </Badge>
          </div>
        </div>

        <Separator orientation="vertical" className="mx-6 h-6" />

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={undo}
            disabled={!canUndo}
          >
            <Undo className="h-4 w-4 mr-2" />
            Undo
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={redo}
            disabled={!canRedo}
          >
            <Redo className="h-4 w-4 mr-2" />
            Redo
          </Button>
          <Button variant="outline" size="sm" onClick={handleImport}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
        </div>

        <Separator orientation="vertical" className="mx-6 h-6" />

        {/* Preview and Export */}
        <div className="flex items-center gap-2">
          {/* Preview Button with Dialog */}
          <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
            <DialogTrigger asChild>
              <Button variant="default" size="sm" onClick={handlePreview}>
                <Play className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Form Preview
                </DialogTitle>
                <DialogDescription>
                  This is how your form will look to users
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[70vh]">
                <form onSubmit={handlePreviewSubmit} className="space-y-4 p-1">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{currentForm.title}</h3>
                    {currentForm.description && (
                      <p className="text-muted-foreground text-sm">{currentForm.description}</p>
                    )}
                  </div>
                  
                  {currentForm.fields.map((field) => (
                    <FieldRenderer
                      key={field.id}
                      field={field}
                      value={formData[field.id]}
                      onChange={(value) => handleFieldChange(field.id, value)}
                      preview={true}
                    />
                  ))}
                  
                  <Button type="submit" className="w-full">
                    Submit Form
                  </Button>
                </form>
              </ScrollArea>
            </DialogContent>
          </Dialog>

          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={exportFormJSON}>
                <FileJson className="h-4 w-4 mr-2" />
                Export as JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportFormHTML}>
                <FileText className="h-4 w-4 mr-2" />
                Export as HTML
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportReactComponent}>
                <Code2 className="h-4 w-4 mr-2" />
                Export as React
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Right side - Theme toggle and settings */}
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}