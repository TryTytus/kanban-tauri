import React, { useState } from 'react';
import {useDraggable} from '@dnd-kit/core';

import { deleteStory } from '../store';
import { useDispatch } from 'react-redux';


type Section = 'todo' | 'inprogress' | 'done';
interface DraggableProps {
    id: string;
    title: string;
    tag?: string;
    sectionId: Section;
    onDelete?: () => void;
}

// Separate the UI component to be used in DragOverlay
interface DraggableCardProps extends DraggableProps {
  style?: React.CSSProperties;
  attributes?: any;
  listeners?: any;
  setNodeRef?: (node: HTMLElement | null) => void;
  isDragging?: boolean;
  isOverlay?: boolean;
}

export function DraggableCard({
  id, title, tag = 'Design', sectionId, 
  style, attributes, listeners, setNodeRef, isDragging, isOverlay
}: DraggableCardProps) {
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false);

  // If this is the original item being dragged (not the overlay), render a structural placeholder
  if (isDragging) {
    return (
      <div 
        ref={setNodeRef} 
        style={style}
        className="
          h-[100px] w-full rounded-2xl 
          bg-gray-50 dark:bg-gray-800/30 
          border-2 border-dashed border-gray-200 dark:border-gray-700
          opacity-50
        "
      />
    );
  }

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'Design': return 'bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-600/20 dark:bg-purple-900/20 dark:text-purple-300 dark:ring-purple-400/30';
      case 'Research': return 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-900/20 dark:text-blue-300 dark:ring-blue-400/30';
      case 'Marketing': return 'bg-pink-50 text-pink-700 ring-1 ring-inset ring-pink-600/20 dark:bg-pink-900/20 dark:text-pink-300 dark:ring-pink-400/30';
      case 'Backend': return 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-900/20 dark:text-amber-300 dark:ring-amber-400/30';
      case 'Bug': return 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20 dark:bg-red-900/20 dark:text-red-300 dark:ring-red-400/30';
      case 'DevOps': return 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-900/20 dark:text-emerald-300 dark:ring-emerald-400/30';
      default: return 'bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/20 dark:bg-gray-700/30 dark:text-gray-300 dark:ring-gray-400/30';
    }
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);
    setTimeout(() => {
      console.log('Deleting story', { sectionId, storyId: id });
      dispatch(deleteStory({ sectionId, storyId: id }));
    }, 500); 
  };

  return (
    <div 
      ref={setNodeRef} 
      {...listeners} 
      {...attributes} 
      style={style} 
      className={`
        group relative flex flex-col gap-3 bg-white dark:bg-gray-800 p-5 rounded-2xl
        border border-gray-100 dark:border-gray-700/60
        transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] 
        cursor-grab active:cursor-grabbing touch-none transform-gpu backface-hidden
        ${isDeleting 
            ? 'opacity-0 scale-75 -rotate-6 translate-y-12 blur-sm grayscale ring-4 ring-red-50 dark:ring-red-900/20 z-50' 
            : `opacity-100 scale-100 ${!isOverlay && 'hover:-translate-y-1'}`}
        ${isOverlay 
            ? 'shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] scale-105 rotate-3 cursor-grabbing z-[9999] ring-1 ring-indigo-500/30' 
            : 'shadow-[0_3px_10px_rgb(0,0,0,0.02)] dark:shadow-[0_3px_10px_rgb(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:border-gray-200/60 dark:hover:border-gray-600'}
      `}
    >
      
      { !isOverlay && (
        <button 
          onPointerDown={(e) => e.stopPropagation()}
          onClick={handleDelete}
          className="absolute top-3 right-3 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 p-2 text-gray-300 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full shadow-sm bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600"
          aria-label="Delete task"
          disabled={isDeleting}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          </svg>
        </button>
      )}

      <div className="flex items-start">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${getTagColor(tag)}`}>
          {tag}
          </span>
      </div>
      
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-[15px] leading-snug tracking-tight">{title}</h3>
      
      <div className="flex justify-between items-center pt-1">
        <div className="flex -space-x-2">
            {/* Members placeholder */}
        </div>
      </div>
    </div>
  )
}

export function Draggable(props: DraggableProps) {
  const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
    id: props.id,
    data: props
  });
  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;


  return (
    <DraggableCard 
      {...props}
      style={style}
      setNodeRef={setNodeRef}
      listeners={listeners}
      attributes={attributes}
      isDragging={isDragging}
    />
  );
}