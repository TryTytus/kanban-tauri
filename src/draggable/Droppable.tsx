import React from 'react';
import {useDroppable} from '@dnd-kit/core';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { Draggable } from './Draggable';

interface DroppableProps {
    id: string;
    title: string;
    children: React.ReactNode;
    count: number;
    handleAddTodo: (title: string, tag: string, section: string) => void;
}

function Droppable({id, title, children, count, handleAddTodo}: DroppableProps) {

  const {setNodeRef} = useDroppable({
    id: id,
  });
  
  return (
    <div className='h-full'>
        <div className="bg-gray-100 p-4 rounded-xl h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg text-gray-700 uppercase">{title}</h2>
              <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
                {count}
              </span>
            </div>
            
            <div ref={setNodeRef} className="flex flex-col gap-3 flex-grow min-h-[100px]">
                {children}
              
              <button onClick={handleAddTodo} className="mt-2 flex items-center justify-center w-full py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors border border-dashed border-gray-300 hover:border-gray-400 text-sm font-medium">
                + Add Task
              </button>
            </div>
          </div>
    </div>
  );
}

export function MultipleDroppables({handleAddTodo}) {
  const sections = useSelector((state: RootState) => state.kanban.sections);
  
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full p-8">
      {Object.entries(sections).map(([sectionId, stories]) => (
        <Droppable id={sectionId} key={sectionId} title={sectionId} count={stories.length} handleAddTodo={handleAddTodo}>
            {stories.map(story => (
                <Draggable key={story.id} id={story.id} title={story.title} />
            ))}
        </Droppable>
      ))}
    </section>
  );
}

