import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FormField } from "@/types/form";
import { useFormStore } from "@/store/form-store";
import { FieldRenderer } from "./field-renderer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { GripVertical, Edit3, Trash2, Copy } from "lucide-react";

interface SortableFieldItemProps {
  field: FormField;
  index: number;
}

export function SortableFieldItem({ field, index }: SortableFieldItemProps) {
  const { selectedFieldId, selectField, removeField } = useFormStore();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: field.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isSelected = selectedFieldId === field.id;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group transition-all duration-200",
        isSelected && "ring-2 ring-primary",
        isDragging && "opacity-50"
      )}
      onClick={() => selectField(field.id)}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-10"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Field Actions */}
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          onClick={(e) => {
            e.stopPropagation();
            selectField(field.id);
          }}
        >
          <Edit3 className="h-3 w-3" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          onClick={(e) => {
            e.stopPropagation();
            // TODO: Implement duplicate field
          }}
        >
          <Copy className="h-3 w-3" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-destructive hover:bg-destructive/10"
          onClick={(e) => {
            e.stopPropagation();
            removeField(field.id);
          }}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>

      <div className="p-4 pl-8">
        <FieldRenderer field={field} />
      </div>
    </Card>
  );
}