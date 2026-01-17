import {DndContext} from '@dnd-kit/core';
import type {DragEndEvent} from '@dnd-kit/core';
import {MultipleDroppables} from './draggable/Droppable';
import { useDispatch, useSelector } from 'react-redux';
import { addToSections, moveStory } from './store';
import type { RootState } from './store';
import { CreateTodo } from './CreateTodo';
import { useState, useEffect } from 'react';

function App() {
  const [popupVisible, setPopupVisible] = useState(false); // You can replace this with actual state management for popup visibility
  const sections = useSelector((state: RootState) => state.kanban.sections);
  const kanbanState = useSelector((state: RootState) => state.kanban);
  const dispatch = useDispatch();
  
  useEffect(() => {
    window.localStorage.setItem('kanbanState', JSON.stringify(kanbanState));
  }, [kanbanState]);

  console.log(JSON.parse(window.localStorage.getItem('kanbanState') || '{}'))

  function togglePopup() {
    setPopupVisible(!popupVisible);
  }

  return (
    <>
    <DndContext onDragEnd={handleDragEnd}>
      <MultipleDroppables handleAddTodo={setPopupVisible} />
      <CreateTodo toggleDisplay={() => setPopupVisible(false)} display={popupVisible} handleAddTodo={handleAddTodo} />
    </DndContext>
    </>
  );
  
  function handleDragEnd(event: DragEndEvent) {
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
  
}

export default App;