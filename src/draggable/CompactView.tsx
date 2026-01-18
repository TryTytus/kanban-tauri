import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { CompactDraggable } from './CompactDraggable';

interface CompactSectionProps {
    id: string;
    title: string;
    count: number;
    children: React.ReactNode;
    handleAddTodo: () => void;
}

function CompactSection({ id, title, count, children, handleAddTodo }: CompactSectionProps) {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div className="flex flex-col mb-8">
            {/* Section Header */}
            <div className="flex items-center pb-2 border-b border-gray-200 dark:border-gray-800 mb-0">
                <div className={`w-3 h-3 rounded-sm mr-3 ${
                    title === 'todo' ? 'bg-pink-500' : 
                    title === 'inprogress' ? 'bg-indigo-500' : 'bg-emerald-500'
                }`}></div>
                <h2 className="font-bold text-sm uppercase tracking-wide text-gray-700 dark:text-gray-300 flex-grow">
                    {title}
                </h2>
                <span className="text-xs text-gray-400 font-mono mr-4">{count} tasks</span>
                
                <button 
                    onClick={handleAddTodo}
                    className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
            </div>

            {/* Droppable Area */}
            <div ref={setNodeRef} className="flex flex-col min-h-[50px] relative">
                {/* Background lines for emptiness */}
                {React.Children.count(children) === 0 && (
                     <div className="absolute inset-0 border-b border-dashed border-gray-100 dark:border-gray-800 flex items-center justify-center text-xs text-gray-400">
                        Drop tasks here
                     </div>
                )}
                {children}
            </div>
        </div>
    );
}

export function CompactView({ handleAddTodo }: { handleAddTodo: () => void }) {
    const sections = useSelector((state: RootState) => state.kanban.sections);

    return (
        <section className="flex flex-col h-full p-8 max-w-5xl mx-auto w-full">
            {Object.entries(sections).map(([sectionId, stories]) => (
                <CompactSection 
                    key={sectionId} 
                    id={sectionId} 
                    title={sectionId} 
                    count={stories.length} 
                    handleAddTodo={handleAddTodo}
                >
                    {stories.map(story => (
                        <CompactDraggable 
                            key={story.id} 
                            id={story.id} 
                            title={story.title} 
                            tag={story.tag}
                            sectionId={sectionId as any} 
                        />
                    ))}
                </CompactSection>
            ))}
        </section>
    );
}
