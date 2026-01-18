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
    handleAddTodo: () => void;
}

function Droppable({id, title, children, count, handleAddTodo}: DroppableProps) {

  const {setNodeRef} = useDroppable({
    id: id,
  });
  
  return (
    <div className='h-full'>
        <div className="bg-gray-100/80 dark:bg-gray-900/50 backdrop-blur-sm p-4 rounded-xl h-full flex flex-col border border-transparent dark:border-gray-800 transition-colors duration-300">
            <div className="flex justify-between items-center mb-4 px-1">
              <h2 className="font-bold text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</h2>
              <span className="bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs px-2.5 py-1 rounded-full font-semibold min-w-[1.5rem] text-center">
                {count}
              </span>
            </div>
            
            <div ref={setNodeRef} className="flex flex-col gap-3 flex-grow min-h-[100px]">
                {children}
              
              <button 
                onClick={handleAddTodo} 
                className="mt-2 flex items-center justify-center w-full py-2.5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-800/50 rounded-xl transition-all duration-200 border border-dashed border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 text-sm font-medium group"
              >
                <span className="group-hover:scale-110 transition-transform duration-200 mr-2 text-lg leading-none">+</span> Add Task
              </button>
            </div>
          </div>
    </div>
  );
}

export function MultipleDroppables({handleAddTodo}: {handleAddTodo: () => void}) {
  const sections = useSelector((state: RootState) => state.kanban.sections);
  

  const map = new Map(); 
  map.set('todo', 'TO DO');
  map.set('inprogress', 'In Progress');
  map.set('done', 'Done');

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full p-8">
      {Object.entries(sections).map(([sectionId, stories]) => (
        <Droppable id={sectionId} key={sectionId} title={map.get(sectionId)} count={stories.length} handleAddTodo={handleAddTodo}>
            {stories.map(story => (
                <Draggable key={story.id} id={story.id} title={story.title} sectionId={sectionId as any} />
            ))}
        </Droppable>
      ))}
    </section>
  );
}

