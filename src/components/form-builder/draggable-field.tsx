import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { FieldType } from "@/types/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Type,
  Mail,
  Phone,
  Lock,
  Calendar,
  ChevronDown,
  CheckSquare,
  CircleDot,
  Hash,
  AlignLeft,
} from "lucide-react";

const fieldIcons = {
  text: Type,
  email: Mail,
  phone: Phone,
  password: Lock,
  date: Calendar,
  select: ChevronDown,
  checkbox: CheckSquare,
  radio: CircleDot,
  number: Hash,
  textarea: AlignLeft,
};

interface DraggableFieldProps {
  type: FieldType;
  label: string;
}

export function DraggableField({ type, label }: DraggableFieldProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `draggable-${type}`,
      data: {
        type: "field",
        fieldType: type,
      },
    });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const Icon = fieldIcons[type];

  return (
    <Button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      variant="ghost"
      className={cn(
        "justify-start h-auto p-3 hover:bg-accent/50 cursor-grab active:cursor-grabbing",
        isDragging && "opacity-50"
      )}
    >
      <Icon className="h-4 w-4 mr-3" />
      <span className="text-sm">{label}</span>
    </Button>
  );
}
