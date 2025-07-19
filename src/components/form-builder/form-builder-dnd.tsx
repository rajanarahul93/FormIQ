import {
  DndContext,
  DragOverlay,
  closestCenter,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
} from "@dnd-kit/sortable";
import { useFormStore } from "@/store/form-store";
import { FieldType } from "@/types/form";
import { useState } from "react";

interface FormBuilderDndProps {
  children: React.ReactNode;
}

export function FormBuilderDnd({ children }: FormBuilderDndProps) {
  const { currentForm, addField, reorderFields, setDragging } = useFormStore();
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setDragging(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setDragging(false);

    if (!over) return;

    // Handle dropping a new field from sidebar
    if (active.data.current?.type === "field" && over.id === "form-canvas") {
      const fieldType = active.data.current.fieldType as FieldType;

      const defaultLabels = {
        text: "Text Input",
        email: "Email Address",
        phone: "Phone Number",
        password: "Password",
        date: "Date",
        number: "Number",
        textarea: "Message",
        select: "Select Option",
        checkbox: "Checkbox Options",
        radio: "Radio Options",
      };

      const defaultOptions = ["Option 1", "Option 2", "Option 3"];

      addField({
        type: fieldType,
        label: defaultLabels[fieldType],
        placeholder: `Enter ${defaultLabels[fieldType].toLowerCase()}`,
        required: false,
        options: ["select", "checkbox", "radio"].includes(fieldType)
          ? defaultOptions
          : undefined,
      });
      return;
    }

    // Handle reordering existing fields
    if (active.id !== over.id) {
      const oldIndex = currentForm.fields.findIndex((f) => f.id === active.id);
      const newIndex = currentForm.fields.findIndex((f) => f.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        reorderFields(oldIndex, newIndex);
      }
    }
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {children}
      <DragOverlay>
        {activeId && activeId.startsWith("draggable-") ? (
          <div className="bg-card border rounded-md p-3 shadow-lg">
            <span className="text-sm">Drag to add field</span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}