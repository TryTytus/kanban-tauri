import {DndContext, DragOverlay} from '@dnd-kit/core';
import type {DragEndEvent, DragStartEvent} from '@dnd-kit/core';
import {MultipleDroppables} from './draggable/Droppable';
import { CompactView } from './draggable/CompactView'; // Import new view
import { DraggableCard } from './draggable/Draggable'; 
import { CompactTaskRow } from './draggable/CompactDraggable'; // Import compact UI
import { useDispatch, useSelector } from 'react-redux';
import { addToSections, moveStory } from './store';
import type { RootState } from './store';
import { CreateTodo } from './CreateTodo';
import { useState, useEffect } from 'react';

function App() {
  const [popupVisible, setPopupVisible] = useState(false);
  const [activeStory, setActiveStory] = useState<any>(null); 
  const [viewMode, setViewMode] = useState<'board' | 'compact'>('board'); // New state

  // Initialize theme from localStorage or system preference
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  const sections = useSelector((state: RootState) => state.kanban.sections);
  const kanbanState = useSelector((state: RootState) => state.kanban);
  const dispatch = useDispatch();
  
  useEffect(() => {
    window.localStorage.setItem('kanbanState', JSON.stringify(kanbanState));
  }, [kanbanState]);

  // Handle Theme Change
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  function toggleTheme() {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }

  console.log(JSON.parse(window.localStorage.getItem('kanbanState') || '{}'))

  function togglePopup() {
    setPopupVisible(!popupVisible);
  }

  function toggleViewMode() {
    setViewMode(prev => prev === 'board' ? 'compact' : 'board');
  }

  function handleDragStart(event: DragStartEvent) {
    const {active} = event;
    const activeId = active.id;
    
    // Find the story data to render in overlay
    for (const [sectionId, stories] of Object.entries(sections)) {
      const story = stories.find(s => s.id === activeId);
      if (story) {
        setActiveStory({ ...story, sectionId });
        break;
      }
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveStory(null);
    const {active, over} = event;
    
    if (!over) return;
    
    const storyId = active.id as string;
    const toSectionId = over.id as string;
    
    let fromSectionId: string | undefined;
    for (const [key, stories] of Object.entries(sections)) {
      if (stories.find(s => s.id === storyId)) {
        fromSectionId = key;
        break;
      }
    }
    
    if (fromSectionId && toSectionId && fromSectionId !== toSectionId) {
      const fromKey = fromSectionId as keyof RootState['kanban']['sections'];
      const toKey = toSectionId as keyof RootState['kanban']['sections'];
      
      dispatch(moveStory({ 
        fromSectionId: fromKey, 
        toSectionId: toKey, 
        storyId 
      }));
    }
  }


  function handleAddTodo(title: string, tag: string, section: keyof RootState['kanban']['sections']) {
    console.log({ title, tag, section });

    dispatch(addToSections({
      sectionId: section,
      story: { id: `story-${Date.now() }`, title, tag }
    }))

    setPopupVisible(false);
  }
  
  return (
    <div className="min-h-screen transition-colors duration-300 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 relative">
      <div className="fixed top-2 right-2 z-50 flex gap-2">
        {/* View Mode Toggle */}
        <button 
          onClick={toggleViewMode}
          className="p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:scale-105 active:scale-95 transition-all duration-200"
          title={viewMode === 'board' ? 'Switch to List View' : 'Switch to Board View'}
        >
          {viewMode === 'board' ? (
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
          ) : (
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
          )}
        </button>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-yellow-400 hover:scale-110 active:scale-95 transition-all duration-300 group cursor-pointer"
          aria-label="Toggle Dark Mode"
        >
          {theme === 'light' ? (
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-rotate-12 transition-transform duration-500">
             <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
           </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-90 transition-transform duration-500">
            <circle cx="12" cy="12" r="5"></circle>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
          </svg>
          )} 
        </button>
      </div>

      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {viewMode === 'board' ? (
           <MultipleDroppables handleAddTodo={() => setPopupVisible(true)} />
        ) : (
           <CompactView handleAddTodo={() => setPopupVisible(true)} />
        )}
        
        <CreateTodo toggleDisplay={() => setPopupVisible(false)} display={popupVisible} handleAddTodo={handleAddTodo} />
        
        <DragOverlay dropAnimation={{
          duration: 250,
          easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
        }}>
          {activeStory ? (
            viewMode === 'board' ? (
              <DraggableCard 
                id={activeStory.id}
                title={activeStory.title}
                tag={activeStory.tag}
                sectionId={activeStory.sectionId}
                isOverlay={true}
              />
            ) : (
              <CompactTaskRow
                id={activeStory.id}
                title={activeStory.title}
                tag={activeStory.tag}
                sectionId={activeStory.sectionId}
                isOverlay={true}
              />
            )
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
  
}

export default App;