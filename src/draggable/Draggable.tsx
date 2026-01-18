import React from 'react';
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
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: id,
    data: { id, title, tag } 
  });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'Design': return 'bg-purple-100 text-purple-800';
      case 'Research': return 'bg-blue-100 text-blue-800';
      case 'Marketing': return 'bg-pink-100 text-pink-800';
      case 'Backend': return 'bg-yellow-100 text-yellow-800';
      case 'Bug': return 'bg-red-100 text-red-800';
      case 'DevOps': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  return (
        <div ref={setNodeRef} {...listeners} {...attributes} style={style} className="group relative bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-default touch-none">
        
        { (
          <button 
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              console.log('Deleting story', { sectionId, storyId: id });
              dispatch(deleteStory({ sectionId, storyId: id }));
            }}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md cursor-pointer"
            aria-label="Delete task"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
          </button>
        )}

        <div className={`inline-block px-2 py-1 rounded text-xs font-medium mb-3 ${getTagColor(tag)}`}>
        {tag}
        </div>
        <h3 className="font-medium text-gray-800 mb-3">{title}</h3>
        <div className="flex justify-end items-center">
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