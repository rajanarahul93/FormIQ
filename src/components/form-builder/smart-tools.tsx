import { useFormStore } from "@/store/form-store";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Zap, Download, Copy, Trash, FileJson, FileSpreadsheet, Code2 } from "lucide-react";

export function SmartTools() {
  const { currentForm, resetForm} = useFormStore();
  const { toast } = useToast();

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
      title: "Form exported",
      description: "JSON file has been downloaded successfully.",
    });
  };

  const copyFormJSON = () => {
    const formData = {
      ...currentForm,
      exportedAt: new Date().toISOString(),
      version: "1.0",
    };

    navigator.clipboard.writeText(JSON.stringify(formData, null, 2));

    toast({
      title: "Copied to clipboard",
      description: "Form JSON has been copied to your clipboard.",
    });
  };

  const generateFormHTML = () => {
    let html = `<form class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
  <h2 class="text-2xl font-bold mb-4">${currentForm.title}</h2>`;

    if (currentForm.description) {
      html += `
  <p class="text-gray-600 mb-6">${currentForm.description}</p>`;
    }

    currentForm.fields.forEach((field) => {
      html += `
  <div class="mb-4">
    <label class="block text-sm font-medium text-gray-700 mb-2" for="${
      field.id
    }">
      ${field.label}${
        field.required ? ' <span class="text-red-500">*</span>' : ""
      }
    </label>`;

      switch (field.type) {
        case "textarea":
          html += `
    <textarea id="${field.id}" name="${
            field.id
          }" class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" ${
            field.required ? "required" : ""
          } placeholder="${field.placeholder || ""}">${
            field.defaultValue || ""
          }</textarea>`;
          break;
        case "select":
          html += `
    <select id="${field.id}" name="${
            field.id
          }" class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" ${
            field.required ? "required" : ""
          }>
      <option value="">${field.placeholder || "Select an option"}</option>`;
          field.options?.forEach((option) => {
            html += `
      <option value="${option}" ${
              field.defaultValue === option ? "selected" : ""
            }>${option}</option>`;
          });
          html += `
    </select>`;
          break;
        case "checkbox":
          html += `<div class="space-y-2">`;
          field.options?.forEach((option) => {
            html += `
      <label class="flex items-center space-x-2">
        <input type="checkbox" name="${field.id}" value="${option}" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
        <span class="text-sm">${option}</span>
      </label>`;
          });
          html += `</div>`;
          break;
        case "radio":
          html += `<div class="space-y-2">`;
          field.options?.forEach((option) => {
            html += `
      <label class="flex items-center space-x-2">
        <input type="radio" name="${field.id}" value="${option}" class="border-gray-300 text-blue-600 focus:ring-blue-500">
        <span class="text-sm">${option}</span>
      </label>`;
          });
          html += `</div>`;
          break;
        default:
          html += `
    <input type="${field.type}" id="${field.id}" name="${
            field.id
          }" class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" ${
            field.required ? "required" : ""
          } placeholder="${field.placeholder || ""}" value="${
            field.defaultValue || ""
          }">`;
      }

      html += `
  </div>`;
    });

    html += `
  <button type="submit" class="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200">
    Submit
  </button>
</form>`;

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
      title: "HTML exported",
      description: "HTML file has been downloaded successfully.",
    });
  };

  // Export as CSV function
  const exportAsCSV = () => {
    if (currentForm.fields.length === 0) {
      toast({
        title: "No fields to export",
        description: "Add some fields to your form first.",
        variant: "destructive"
      });
      return;
    }

    const headers = currentForm.fields.map(field => field.label);
    const csvContent = `${headers.join(',')}\n`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentForm.title.replace(/\s+/g, '-').toLowerCase()}-structure.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "CSV exported",
      description: "Form structure has been exported as CSV.",
    });
  };

  // Generate schema function
  const generateSchema = () => {
    if (currentForm.fields.length === 0) {
      toast({
        title: "No fields to generate schema",
        description: "Add some fields to your form first.",
        variant: "destructive"
      });
      return;
    }

    const schema: {
      type: string;
      title: string;
      description?: string;
      properties: { [key: string]: {
        type: string;
        title: string;
        description?: string;
        enum?: string[];
        minLength?: number;
        maxLength?: number;
        pattern?: string;
      }};
      required: string[];
    } = {
      type: "object",
      title: currentForm.title,
      description: currentForm.description,
      properties: {},
      required: []
    };

    currentForm.fields.forEach(field => {
      schema.properties[field.id] = {
        type: field.type === 'number' ? 'number' : 'string',
        title: field.label,
        description: field.placeholder || "",
      };

      if (field.required) {
        schema.required.push(field.id);
      }

      if (field.options) {
        schema.properties[field.id].enum = field.options;
      }

      if (field.validation) {
        if (field.validation.minLength) {
          schema.properties[field.id].minLength = field.validation.minLength;
        }
        if (field.validation.maxLength) {
          schema.properties[field.id].maxLength = field.validation.maxLength;
        }
        if (field.validation.pattern) {
          schema.properties[field.id].pattern = field.validation.pattern;
        }
      }
    });

    const schemaJSON = JSON.stringify(schema, null, 2);
    navigator.clipboard.writeText(schemaJSON);

    toast({
      title: "JSON Schema generated",
      description: "Schema has been copied to your clipboard.",
    });
  };

  // Copy as React code function
  const copyAsReactCode = () => {
    if (currentForm.fields.length === 0) {
      toast({
        title: "No fields to generate code",
        description: "Add some fields to your form first.",
        variant: "destructive"
      });
      return;
    }

    let reactCode = `import React, { useState } from 'react';\n\n`;
    reactCode += `function ${currentForm.title.replace(/\s+/g, '')}Form() {\n`;
    reactCode += `  const [formData, setFormData] = useState({\n`;
    
    currentForm.fields.forEach((field, index) => {
      const comma = index < currentForm.fields.length - 1 ? ',' : '';
      reactCode += `    ${field.id}: '${field.defaultValue || ''}'${comma}\n`;
    });
    
    reactCode += `  });\n\n`;
    reactCode += `  const handleChange = (e) => {\n`;
    reactCode += `    setFormData({ ...formData, [e.target.name]: e.target.value });\n`;
    reactCode += `  };\n\n`;
    reactCode += `  const handleSubmit = (e) => {\n`;
    reactCode += `    e.preventDefault();\n`;
    reactCode += `    console.log(formData);\n`;
    reactCode += `  };\n\n`;
    reactCode += `  return (\n`;
    reactCode += `    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">\n`;
    reactCode += `      <h2 className="text-2xl font-bold mb-4">${currentForm.title}</h2>\n`;
    
    if (currentForm.description) {
      reactCode += `      <p className="text-gray-600 mb-6">${currentForm.description}</p>\n`;
    }

    currentForm.fields.forEach(field => {
      reactCode += `      <div className="mb-4">\n`;
      reactCode += `        <label className="block text-sm font-medium text-gray-700 mb-2">${field.label}${field.required ? ' *' : ''}</label>\n`;
      
      if (field.type === 'textarea') {
        reactCode += `        <textarea\n`;
        reactCode += `          name="${field.id}"\n`;
        reactCode += `          value={formData.${field.id}}\n`;
        reactCode += `          onChange={handleChange}\n`;
        reactCode += `          placeholder="${field.placeholder || ''}"\n`;
        reactCode += `          ${field.required ? 'required' : ''}\n`;
        reactCode += `          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"\n`;
        reactCode += `        />\n`;
      } else if (field.type === 'select') {
        reactCode += `        <select\n`;
        reactCode += `          name="${field.id}"\n`;
        reactCode += `          value={formData.${field.id}}\n`;
        reactCode += `          onChange={handleChange}\n`;
        reactCode += `          ${field.required ? 'required' : ''}\n`;
        reactCode += `          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"\n`;
        reactCode += `        >\n`;
        reactCode += `          <option value="">${field.placeholder || 'Select an option'}</option>\n`;
        field.options?.forEach(option => {
          reactCode += `          <option value="${option}">${option}</option>\n`;
        });
        reactCode += `        </select>\n`;
      } else {
        reactCode += `        <input\n`;
        reactCode += `          type="${field.type}"\n`;
        reactCode += `          name="${field.id}"\n`;
        reactCode += `          value={formData.${field.id}}\n`;
        reactCode += `          onChange={handleChange}\n`;
        reactCode += `          placeholder="${field.placeholder || ''}"\n`;
        reactCode += `          ${field.required ? 'required' : ''}\n`;
        reactCode += `          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"\n`;
        reactCode += `        />\n`;
      }
      
      reactCode += `      </div>\n`;
    });

    reactCode += `      <button type="submit" className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 transition duration-200">\n`;
    reactCode += `        Submit\n`;
    reactCode += `      </button>\n`;
    reactCode += `    </form>\n`;
    reactCode += `  );\n`;
    reactCode += `}\n\n`;
    reactCode += `export default ${currentForm.title.replace(/\s+/g, '')}Form;`;

    navigator.clipboard.writeText(reactCode);

    toast({
      title: "React code generated",
      description: "Complete React component has been copied to your clipboard.",
    });
  };

  // Calculate dynamic height based on content
  const contentHeight = Math.min(600, Math.max(300, currentForm.fields.length * 40 + 400));

  return (
    <div className={`h-[${contentHeight}px] border rounded-lg bg-card text-card-foreground shadow-sm flex flex-col`} style={{ height: `${contentHeight}px` }}>
      {/* Fixed Header */}
      <div className="flex items-center gap-2 p-6 pb-4 border-b flex-shrink-0">
        <Zap className="h-5 w-5" />
        <h3 className="text-lg font-semibold leading-none tracking-tight">Smart Tools</h3>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground/20">
        <div className="p-6 pt-4 space-y-4">
          {/* Export Options */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Export Form</h4>
            <div className="grid gap-2">
              <Button
                variant="outline"
                onClick={exportFormJSON}
                className="justify-start"
              >
                <Download className="h-4 w-4 mr-2" />
                Download JSON
              </Button>
              <Button
                variant="outline"
                onClick={copyFormJSON}
                className="justify-start"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy JSON
              </Button>
              <Button
                variant="outline"
                onClick={generateFormHTML}
                className="justify-start"
              >
                <FileJson className="h-4 w-4 mr-2" />
                Export HTML
              </Button>
            </div>
          </div>

          <Separator />

          {/* Form Stats */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Form Statistics</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center p-3 bg-muted rounded-md">
                <div className="text-2xl font-bold">
                  {currentForm.fields.length}
                </div>
                <div className="text-xs text-muted-foreground">Fields</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-md">
                <div className="text-2xl font-bold">
                  {currentForm.fields.filter((f) => f.required).length}
                </div>
                <div className="text-xs text-muted-foreground">Required</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* More Tools */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Advanced Tools</h4>
            <div className="grid gap-2">
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={exportAsCSV}
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export as CSV
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={generateSchema}
              >
                <FileJson className="h-4 w-4 mr-2" />
                Generate Schema
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={copyAsReactCode}
              >
                <Code2 className="h-4 w-4 mr-2" />
                Copy as React Code
              </Button>
            </div>
          </div>

          <Separator />

          {/* Reset Form */}
          <div className="pb-6">
            <Button
              variant="destructive"
              onClick={resetForm}
              className="w-full"
            >
              <Trash className="h-4 w-4 mr-2" />
              Reset Form
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}