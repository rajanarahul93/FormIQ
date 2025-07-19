import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useFormStore } from "@/store/form-store";
import { SortableFieldItem } from "./sortable-field-item";
import { cn } from "@/lib/utils";

export function FormCanvas() {
  const { currentForm, isDragging } = useFormStore();
  const { setNodeRef } = useDroppable({
    id: "form-canvas",
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex-1 p-6 overflow-y-auto transition-all duration-200",
        isDragging && "bg-accent/20"
      )}
    >
      <div
        className={cn(
          "min-h-full rounded-lg border-2 border-dashed transition-all duration-200",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25",
          currentForm.fields.length === 0 &&
            !isDragging &&
            "flex items-center justify-center"
        )}
      >
        {currentForm.fields.length === 0 && !isDragging ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">
              Start Building Your Form
            </h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop fields from the sidebar to begin
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg">
              <span className="text-sm text-primary font-medium">
                FormIQ Builder Ready ✨
              </span>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">{currentForm.title}</h2>
              {currentForm.description && (
                <p className="text-muted-foreground">
                  {currentForm.description}
                </p>
              )}
            </div>

            <SortableContext
              items={currentForm.fields.map((f) => f.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {currentForm.fields.map((field, index) => (
                  <SortableFieldItem
                    key={field.id}
                    field={field}
                    index={index}
                  />
                ))}
              </div>
            </SortableContext>
          </div>
        )}
      </div>
    </div>
  );
}