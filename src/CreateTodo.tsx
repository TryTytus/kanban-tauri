import { useState } from "react";

export function CreateTodo({display, toggleDisplay, handleAddTodo}) {

 const [title, setTitle] = useState("");
 const [tag, setTag] = useState("");
 const [section, setSection] = useState("todo");

  return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity ${!display ? 'hidden' : ''}`}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h2 className="text-lg font-semibold text-gray-800">New Task</h2>
                  <button onClick={toggleDisplay} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                  </button>
              </div>
              
              <form className="p-6 space-y-4">
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
                      <input
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setTitle(event.target.value)}}
                            value={title}
                          type="text" 
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-gray-800 placeholder-gray-400"
                          placeholder="e.g. Redesign homepage"
                      />
                  </div>


                <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Section</label>
                      <select value={section} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {setSection(event.target.value)}}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-gray-800 placeholder-gray-400"
                      >
                          <option value="todo">TO DO</option>
                          <option value="inprogress">In Progress</option>
                          <option value="done">Done</option>
                      </select>
                  </div>
                  
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tag</label>
                      <div className="flex flex-wrap gap-2">
                           {['Design', 'Research', 'Marketing', 'Backend', 'Bug', 'DevOps'].map((tag) => (
                              <button type="button" key={tag} className="px-3 py-1.5 text-xs font-medium rounded-md border border-gray-200 text-gray-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-all select-none">
                                  {tag}
                              </button>
                          ))}
                      </div>
                  </div>
              </form>
              
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                  <button onClick={toggleDisplay} className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                      Cancel
                  </button>
                  <button onClick={() => handleAddTodo(title, tag, section)} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm hover:shadow focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all">
                      Create Task
                  </button>
              </div>
          </div>
      </div>
  );
}