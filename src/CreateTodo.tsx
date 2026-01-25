import { useState } from "react";

export function CreateTodo({display, toggleDisplay, handleAddTodo, handleUpdate, titleParam = '', tagParam = '', sectionParam = 'todo'}) {

 const [title, setTitle] = useState(titleParam);
 const [tag, setTag] = useState(tagParam);
 const [section, setSection] = useState(sectionParam);



  return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity ${!display ? 'hidden' : ''}`}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 border border-gray-100 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">New Task</h2>
                  <button onClick={toggleDisplay} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                  </button>
              </div>
              
              <form className="p-6 space-y-4">
                  <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Title</label>
                      <input
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setTitle(event.target.value)}}
                            value={title}
                          type="text" 
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-all text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                          placeholder="e.g. Redesign homepage"
                      />
                  </div>


                <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Section</label>
                      <select value={section} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {setSection(event.target.value)}}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-all text-gray-800 dark:text-gray-100 placeholder-gray-400"
                      >
                          <option value="todo">TO DO</option>
                          <option value="inprogress">In Progress</option>
                          <option value="done">Done</option>
                      </select>
                  </div>
                  
                  <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tag</label>
                      <div className="flex flex-wrap gap-2">
                           {['Design', 'Research', 'Marketing', 'Backend', 'Bug', 'DevOps'].map((t) => (
                              <button 
                                type="button" 
                                key={t} 
                                onClick={() => setTag(t)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-all select-none
                                    ${tag === t 
                                        ? 'bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-500 dark:text-indigo-300' 
                                        : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 dark:hover:border-indigo-500 dark:hover:bg-indigo-900/20 dark:hover:text-indigo-300'}
                                `}
                              >
                                  {t}
                              </button>
                          ))}
                      </div>
                  </div>
              </form>
              
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
                  <button onClick={toggleDisplay} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      Cancel
                  </button>
                  <button onClick={() => handleAddTodo(title, tag || 'Design', section)} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg shadow-sm hover:shadow focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all">
                      Create Task
                  </button>
              </div>
          </div>
      </div>
  );
}