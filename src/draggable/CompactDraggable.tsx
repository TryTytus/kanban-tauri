import React, { useEffect, useMemo, useState } from 'react';
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

    const [running, setRunning] = useState(false);
    const [seconds, setSeconds] = useState(0);

    function toggleRunning() {
        setRunning((prev) => !prev);
    }


    useEffect(() => {
        if (!running) return;

        const interval = setInterval(() => {
            setSeconds((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [running]);


    function formatTime(sec: number) {
        const hrs = Math.floor(sec / 3600);
        const mins = Math.floor((sec % 3600) / 60);
        const secs = sec % 60;
        return `${hrs > 0 ? hrs + 'h ' : ''}${mins > 0 ? mins + 'm ' : ''}${secs}s`;
    }

    const formattedTime = useMemo(() => formatTime(seconds), [seconds]);



    // Placeholder for time measurement logic

    // Placeholder when dragging
    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="w-full h-[56px] rounded-xl bg-gray-50 dark:bg-gray-800/30 border-2 border-dashed border-gray-200 dark:border-gray-700 opacity-50 my-1"
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
                group flex items-center w-full min-h-[56px] px-4 py-2 my-1
                bg-white dark:bg-gray-800 
                rounded-xl border border-gray-100 dark:border-gray-700/60
                shadow-[0_2px_8px_rgba(0,0,0,0.02)]
                hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)] dark:hover:shadow-[0_4px_16px_rgba(0,0,0,0.3)]
                hover:border-gray-200/60 dark:hover:border-gray-600
                transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-grab relative
                ${isDeleting ? 'opacity-0 -translate-x-full' : 'opacity-100'}
                ${isOverlay ? 'shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] scale-105 z-[9999] ring-1 ring-indigo-500/30' : ''}
            `}
        >
            {/* Drag Handle Indicator */}
            <div className="mr-3 text-gray-300 dark:text-gray-600 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity">
                <svg width="6" height="10" viewBox="0 0 6 10" fill="currentColor">
                    <circle cx="1" cy="1" r="1" /><circle cx="1" cy="5" r="1" /><circle cx="1" cy="9" r="1" />
                    <circle cx="5" cy="1" r="1" /><circle cx="5" cy="5" r="1" /><circle cx="5" cy="9" r="1" />
                </svg>
            </div>

            {/* Checkbox imitation */}
            <div className="mr-4 w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600 group-hover:border-indigo-500 transition-colors flex-shrink-0"></div>

            {/* Title */}
            <div className="flex-grow font-semibold text-sm text-gray-800 dark:text-gray-100 truncate pr-4">
                {title}
            </div>

            {/* Tag */}
            <div className="mr-8 flex-shrink-0">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${getTagColor(tag)}`}>
                    {tag}
                </span>
            </div>

            {/* Delete/Actions */}
            { !isOverlay && (
                <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                    <button
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={handleDelete}
                        className="p-1.5 text-gray-300 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                    </button>
                </div>
            )}

            {formattedTime}

            <button className='ml-2 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors'
                onPointerDown={(e) => e.stopPropagation()}
                onClick={toggleRunning}
            >

                measure time
            </button>
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
