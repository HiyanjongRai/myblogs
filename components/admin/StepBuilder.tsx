"use client";

import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Plus, ChevronDown, ChevronUp } from "lucide-react";
import ImageUploader from "./ImageUploader";
import RichTextEditor from "./RichTextEditor";

export interface Step {
  id: string;
  order: number;
  text: string;
  images: string[];
}

function SortableStep({
  step,
  index,
  onUpdate,
  onDelete,
  collapsed,
  onToggleCollapse,
}: {
  step: Step;
  index: number;
  onUpdate: (id: string, changes: Partial<Step>) => void;
  onDelete: (id: string) => void;
  collapsed: boolean;
  onToggleCollapse: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={`step-card ${isDragging ? "step-dragging" : ""}`}>
      <div className="flex items-center gap-2 p-4 pb-0">
        <button
          className="text-gray-400 cursor-grab hover:text-gray-800"
          {...attributes}
          {...listeners}
          type="button"
          aria-label="Drag to reorder"
        >
          <GripVertical size={16} />
        </button>
        <span className="font-semibold text-sm text-gray-800">
          Step {index + 1} (drag & drop)
        </span>
        <div className="flex-1" />
        <button
          type="button"
          className="text-gray-400 hover:text-red-500 p-1"
          onClick={() => onDelete(step.id)}
          aria-label="Delete step"
        >
          <Trash2 size={15} />
        </button>
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-[1fr,220px] gap-6">
        <div className="flex flex-col">
          <RichTextEditor
            content={step.text}
            onChange={(val: string) => onUpdate(step.id, { text: val })}
            placeholder={`Enter Step ${index + 1} content here...`}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-800 mb-2">Upload Images</label>
          <ImageUploader
            images={step.images}
            onChange={(urls) => onUpdate(step.id, { images: urls })}
            max={4}
          />
        </div>
      </div>
    </div>
  );
}

export default function StepBuilder({
  steps,
  onChange,
}: {
  steps: Step[];
  onChange: (steps: Step[]) => void;
}) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = steps.findIndex((s) => s.id === active.id);
    const newIdx = steps.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(steps, oldIdx, newIdx).map((s, i) => ({ ...s, order: i + 1 }));
    onChange(reordered);
  }

  function addStep() {
    const newStep: Step = {
      id: `step-${Date.now()}`,
      order: steps.length + 1,
      text: "",
      images: [],
    };
    onChange([...steps, newStep]);
  }

  function updateStep(id: string, changes: Partial<Step>) {
    onChange(steps.map((s) => (s.id === id ? { ...s, ...changes } : s)));
  }

  function deleteStep(id: string) {
    onChange(steps.filter((s) => s.id !== id).map((s, i) => ({ ...s, order: i + 1 })));
  }

  function toggleCollapse(id: string) {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="step-builder">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={steps.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <div className="steps-list">
            {steps.length === 0 && (
              <div className="steps-empty">
                <p>No steps yet. Click &quot;Add Step&quot; to get started.</p>
              </div>
            )}
            {steps.map((step, idx) => (
              <SortableStep
                key={step.id}
                step={step}
                index={idx}
                onUpdate={updateStep}
                onDelete={deleteStep}
                collapsed={!!collapsed[step.id]}
                onToggleCollapse={toggleCollapse}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button type="button" className="add-step-btn" onClick={addStep}>
        <Plus size={16} /> Add Step
      </button>
    </div>
  );
}
