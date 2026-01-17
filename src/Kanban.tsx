interface Task {
  id: number;
  title: string;
  tag: string;
  members: string[];
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

import { useState } from 'react'

export function Kanban() {

      const [columns] = useState<Column[]>([
    {
      id: 'todo',
      title: 'To Do',
      tasks: [
        { id: 1, title: 'Design new landing page', tag: 'Design', members: ['JD'] },
        { id: 2, title: 'Research competitor analysis', tag: 'Research', members: ['AL', 'SK'] },
        { id: 3, title: 'Draft newsletter content', tag: 'Marketing', members: ['JD'] },
      ]
    },
    {
      id: 'inprogress',
      title: 'In Progress',
      tasks: [
        { id: 4, title: 'Implement authentication', tag: 'Backend', members: ['MW'] },
        { id: 5, title: 'Fix navigation bug', tag: 'Bug', members: ['SK'] },
      ]
    },
    {
      id: 'done',
      title: 'Done',
      tasks: [
        { id: 6, title: 'Set up project repository', tag: 'DevOps', members: ['MW', 'AL'] },
        { id: 7, title: 'Initial team meeting', tag: 'Meeting', members: ['All'] },
      ]
    }
  ])

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
        <>
            <div className="min-h-screen bg-gray-50 p-8 text-gray-900 font-sans">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Project Kanban</h1>
        <p className="text-gray-500 mt-2">Manage tasks and track progress</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <div key={column.id} className="bg-gray-100 p-4 rounded-xl h-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg text-gray-700">{column.title}</h2>
              <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
                {column.tasks.length}
              </span>
            </div>
            
            <div className="flex flex-col gap-3">
              {column.tasks.map((task) => (
                <div key={task.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-default">
                  <div className={`inline-block px-2 py-1 rounded text-xs font-medium mb-3 ${getTagColor(task.tag)}`}>
                    {task.tag}
                  </div>
                  <h3 className="font-medium text-gray-800 mb-3">{task.title}</h3>
                  <div className="flex justify-end items-center">
                    <div className="flex -space-x-2">
                        {task.members.map((member, i) => (
                          <div key={i} className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold border-2 border-white ring-1 ring-gray-100" title={member}>
                            {member}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
              
              <button className="mt-2 flex items-center justify-center w-full py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors border border-dashed border-gray-300 hover:border-gray-400 text-sm font-medium">
                + Add Task
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
        </>
    )
}