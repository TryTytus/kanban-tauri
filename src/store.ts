import { configureStore, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface Story {
  id: string;
  title: string;
  tag:  string;
}

interface KanbanState {
  dropId: string;
  sections: {
    todo: Array<Story>;
    inprogress: Array<Story>;
    done: Array<Story>;
  };
}

const savedState = window.localStorage.getItem('kanbanState');

const initialState: KanbanState = savedState ? JSON.parse(savedState) : {
  dropId: '1',
  sections: {
    todo: [],
    inprogress: [],
    done: []
  }
};

window.localStorage.setItem('kanbanState', JSON.stringify(initialState))

const kanbanSlice = createSlice({
  name: 'kanban',
  initialState,
  reducers: {
    setDropId: (state, action: PayloadAction<string>) => {
      state.dropId = action.payload;
    },
    addToSections: (state, action: PayloadAction<{ sectionId: keyof KanbanState['sections']; story: Story }>) => {
      const { sectionId, story } = action.payload;
      state.sections[sectionId].push(story);
    },
    moveStory: (state, action: PayloadAction<{ fromSectionId: keyof KanbanState['sections']; toSectionId: keyof KanbanState['sections']; storyId: string }>) => {
      const { fromSectionId, toSectionId, storyId } = action.payload;
      if (fromSectionId === toSectionId) return;
      
      const sourceList = state.sections[fromSectionId];
      const storyIndex = sourceList.findIndex(s => s.id === storyId);
      
      if (storyIndex !== -1) {
        const [movedStory] = sourceList.splice(storyIndex, 1);
        state.sections[toSectionId].push(movedStory);
      }
    },
    deleteStory: (state, action: PayloadAction<{ sectionId: keyof KanbanState['sections']; storyId: string }>) => {
      const { sectionId, storyId } = action.payload;
      const section = state.sections[sectionId]
      state.sections[sectionId] = section.filter(story => story.id !== storyId)
    }

  },
});

export const { setDropId, addToSections, moveStory, deleteStory } = kanbanSlice.actions;

export const store = configureStore({
  reducer: {
    kanban: kanbanSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;