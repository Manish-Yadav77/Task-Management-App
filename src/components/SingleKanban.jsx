import React from "react";
import { useParams } from "react-router-dom";
import { useKanban } from "../context/KanbanContext";

function SingleKanban() {
  const { id: colId } = useParams();
  const {
    columns,
    tasks,
    handleTaskChange,
    addTask,
    deleteTask,
    toggleTaskComplete,
    startEditTask,
    updateTask,
    editingTaskId,
    editingTaskContent,
    setEditingTaskContent,
  } = useKanban();

  const col = columns[colId];

  if (!col) {
    return (
      <div className="p-6 text-center text-red-500">Column not found!</div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-r from-yellow-100 to-orange-200 min-h-screen text-black flex">
      <h1 className="text-3xl font-bold text-yellow-700 mb-6 lg:text-center">
        {col.name}
      </h1>

      <div className="flex gap-2 mb-4 h-20 lg:mt-50">
        <input
          value={tasks[colId] || ""}
          onChange={(e) => handleTaskChange(colId, e.target.value)}
          placeholder="Add task"
          className="flex-1 px-2 py-1 rounded text-black"
        />
        <button
          onClick={() => addTask(colId)}
          className="bg-yellow-500 hover:bg-yellow-400 px-3 py-1 rounded"
        >
          ➕
        </button>
      </div>

      <div className="w-full sm:w-[90%] md:w-[80%] lg:w-full max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-4 my-4 transition-all duration-300">
        {col.items.map((item) => (
          <div
            key={item.id}
            className="p-3 rounded shadow-md flex justify-between items-center bg-white mb-2"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => toggleTaskComplete(colId, item.id)}
              />
              {editingTaskId === item.id ? (
                <input
                  value={editingTaskContent}
                  onChange={(e) => setEditingTaskContent(e.target.value)}
                  className="px-2 py-1 rounded text-black"
                />
              ) : (
                <span className={item.completed ? "line-through" : ""}>
                  {item.content}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {editingTaskId === item.id ? (
                <button
                  onClick={() => updateTask(colId, item.id)}
                  className="hover:bg-green-100 px-2 py-1 rounded text-white"
                >
                  💾
                </button>
              ) : (
                <button
                  onClick={() => startEditTask(item.id, item.content)}
                  className="hover:bg-blue-100 px-2 py-1 rounded text-white"
                >
                  ✏️
                </button>
              )}
              <button
                onClick={() => deleteTask(colId, item.id)}
                className="hover:bg-red-100 px-2 py-1 rounded text-white"
              >
                ❌
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SingleKanban;
