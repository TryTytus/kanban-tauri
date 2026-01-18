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

export function Draggable({id, title, tag = 'Design', sectionId, onDelete}: DraggableProps) {

  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false);

  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: id,
    data: { id, title, tag } 
  });
  
  // Disable drag transform when deleting to let CSS animation take over
  const style = transform && !isDeleting ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'Design': return 'bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-600/20';
      case 'Research': return 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20';
      case 'Marketing': return 'bg-pink-50 text-pink-700 ring-1 ring-inset ring-pink-600/20';
      case 'Backend': return 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20';
      case 'Bug': return 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20';
      case 'DevOps': return 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20';
      default: return 'bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/20';
    }
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);
    // Wait for animation to finish before dispatching delete
    setTimeout(() => {
      console.log('Deleting story', { sectionId, storyId: id });
      dispatch(deleteStory({ sectionId, storyId: id }));
    }, 500); // Increased duration for the dramatic effect
  };

  return (
        <div 
          ref={setNodeRef} 
          {...listeners} 
          {...attributes} 
          style={style} 
          className={`
            group relative flex flex-col gap-3 bg-white p-5 rounded-2xl
            shadow-[0_3px_10px_rgb(0,0,0,0.02)] border border-gray-100
            hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-gray-200/60
            transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] 
            cursor-grab active:cursor-grabbing touch-none transform-gpu backface-hidden
            ${isDeleting 
                ? 'opacity-0 scale-75 -rotate-6 translate-y-12 blur-sm grayscale ring-4 ring-red-50 z-50' 
                : 'opacity-100 scale-100 hover:-translate-y-1'}
          `}
        >
        
        { (
          <button 
            onPointerDown={(e) => e.stopPropagation()}
            onClick={handleDelete}
            className="absolute top-3 right-3 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full shadow-sm bg-white border border-gray-100"
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
        
        <h3 className="font-semibold text-gray-900 text-[15px] leading-snug tracking-tight">{title}</h3>
        
        <div className="flex justify-between items-center pt-1">
        <div className="flex -space-x-2">

            {/* {task.members.map((member, i) => (
                <div key={i} className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold border-2 border-white ring-1 ring-gray-100" title={member}>
                {'member'}
                </div>
            ))} */}
        </div>
        </div>
    </div>
  )
}