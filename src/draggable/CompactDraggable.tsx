import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { useDispatch } from 'react-redux';
import { deleteStory } from '../store';

type Section = 'todo' | 'inprogress' | 'done';

interface CompactDraggableProps {
    id: string;
    title: string;
    tag?: string;
    sectionId: Section;
    style?: React.CSSProperties;
    attributes?: any;
    listeners?: any;
    setNodeRef?: (node: HTMLElement | null) => void;
    isDragging?: boolean;
    isOverlay?: boolean;
}

export function CompactTaskRow({
    id, title, tag = 'Design', sectionId,
    style, attributes, listeners, setNodeRef, isDragging, isOverlay
}: CompactDraggableProps) {
    const dispatch = useDispatch();
    const [isDeleting, setIsDeleting] = useState(false);

    // Placeholder when dragging
    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="w-full h-[50px] bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 opacity-50"
            />
        );
    }

    const getTagColor = (tag: string) => {
        // Simplified colors for compact view
        switch (tag) {
            case 'Design': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300';
            case 'Research': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300';
            case 'Marketing': return 'text-pink-600 bg-pink-100 dark:bg-pink-900/30 dark:text-pink-300';
            case 'Backend': return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300';
            case 'Bug': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-300';
            case 'DevOps': return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300';
            default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300';
        }
    }

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsDeleting(true);
        setTimeout(() => {
            dispatch(deleteStory({ sectionId, storyId: id }));
        }, 300);
    };

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={style}
            className={`
                group flex items-center w-full h-[50px] px-4 bg-white dark:bg-gray-900 
                border-b border-gray-100 dark:border-gray-800
                hover:bg-gray-50 dark:hover:bg-gray-800/60
                transition-all duration-200 cursor-grab relative
                ${isDeleting ? 'opacity-0 -translate-x-full' : 'opacity-100'}
                ${isOverlay ? 'shadow-xl ring-1 ring-indigo-500/20 z-[9999] rounded-lg' : ''}
            `}
        >
            {/* Drag Handle Indicator */}
            <div className="mr-3 text-gray-300 dark:text-gray-600 cursor-grab active:cursor-grabbing">
                <svg width="6" height="10" viewBox="0 0 6 10" fill="currentColor">
                    <circle cx="1" cy="1" r="1" /><circle cx="1" cy="5" r="1" /><circle cx="1" cy="9" r="1" />
                    <circle cx="5" cy="1" r="1" /><circle cx="5" cy="5" r="1" /><circle cx="5" cy="9" r="1" />
                </svg>
            </div>

            {/* Checkbox imitation */}
            <div className="mr-4 w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600 group-hover:border-indigo-500 transition-colors"></div>

            {/* Title */}
            <div className="flex-grow font-medium text-sm text-gray-800 dark:text-gray-200 truncate pr-4">
                {title}
            </div>

            {/* Tag */}
            <div className={`mr-12 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${getTagColor(tag)}`}>
                {tag}
            </div>

            {/* Delete/Actions */}
            { !isOverlay && (
                <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                    <button
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={handleDelete}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                    </button>
                </div>
            )}
        </div>
    );
}

export function CompactDraggable(props: Omit<CompactDraggableProps, 'isDragging' | 'isOverlay' | 'setNodeRef' | 'attributes' | 'listeners'>) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: props.id,
        data: props
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: isDragging ? 999 : 'auto',
    } : undefined;

    return (
        <CompactTaskRow
            {...props}
            style={style}
            setNodeRef={setNodeRef}
            listeners={listeners}
            attributes={attributes}
            isDragging={isDragging}
        />
    );
}
