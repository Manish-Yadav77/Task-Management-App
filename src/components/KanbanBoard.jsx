import React, { useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useKanban } from "../context/KanbanContext";

function KanbanBoard() {
  const {
    columns,
    tasks,
    newColumnName,
    editingColumnId,
    editingColumnName,
    editingTaskId,
    editingTaskContent,
    setNewColumnName,
    handleDragEnd,
    handleTaskChange,
    addTask,
    addColumn,
    deleteColumn,
    startEditColumn,
    renameColumn,
    toggleTaskComplete,
    deleteTask,
    startEditTask,
    updateTask,
    setEditingTaskContent,
    setEditingColumnName,
  } = useKanban();

  const [newBoardName, setNewBoardName] = React.useState("");
const [screens, setScreens] = React.useState(["Task Manager"]);

const addNewBoard = () => {
  if (newBoardName.trim()) {
    setScreens((prev) => [...prev, newBoardName]);
    setNewBoardName("");
  }
};

useEffect(() => {
    const kanban_board = localStorage.getItem("kanban_board");

    if (kanban_board) {
      setNewBoardName(JSON.parse(kanban_board));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("kanban_board", JSON.stringify(newBoardName));
  }, [newBoardName]);


  return (
    <div className="p-6 bg-gradient-to-r from-yellow-100 to-orange-200 min-h-screen text-black ">
    

      <h1 className="text-4xl font-bold mb-6 text-center text-yellow-700">
        🚀 Task Manager
      </h1>

      <div className="flex justify-center gap-4 mb-8">
        <input
          value={newColumnName}
          onChange={(e) => setNewColumnName(e.target.value)}
          placeholder="Add new Task Board"
          className="px-4 py-2 rounded text-black"
        />
        <button
          onClick={addColumn}
          className="bg-yellow-500 hover:bg-yellow-400 px-4 py-2 rounded font-semibold"
        >
          + Add New Board
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-6 flex-wrap items-center justify-center overflow-x-auto">
          {Object.entries(columns).map(([colId, col]) => (
            <div
              key={colId}
              className="bg-white rounded-lg p-4 shadow-lg min-w-[280px]"
            >
              <div className="flex items-center justify-between mb-4">
                {editingColumnId === colId ? (
                  <>
                    {/* Input for renaming the column */}
                    <input
                      value={editingColumnName}
                      onChange={(e) => setEditingColumnName(e.target.value)}
                      className="px-2 py-1 rounded text-black"
                    />
                    <button
                      onClick={() => {
                        if (editingColumnName.trim()) {
                          renameColumn(colId);
                        }
                      }}
                      title="Save"
                      className=" hover:bg-green-400 px-2 py-1 rounded text-white"
                    >
                      💾
                    </button>
                  </>
                ) : (
                  <>
                    {/* Display column name */}
                    <h2 className="text-xl font-bold text-yellow-700">
                      {col.name}
                    </h2>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditColumn(colId, col.name)}
                        title="Rename"
                        className=" hover:bg-blue-100 px-2 py-1 rounded text-white"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => deleteColumn(colId)}
                        title="Delete Column"
                        className=" hover:bg-red-100 px-2 py-1 rounded text-white"
                      >
                        ❌
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-2 mb-4">
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

              <Droppable droppableId={colId}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[100px] p-2 rounded transition-all space-y-2 ${
                      snapshot.isDraggingOver
                        ? "bg-yellow-100"
                        : "bg-orange-100"
                    }`}
                  >
                    {col.items.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-3 rounded shadow-md flex justify-between items-center ${
                              snapshot.isDragging
                                ? "scale-105 bg-yellow-300"
                                : "bg-white"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={item.completed}
                                onChange={() =>
                                  toggleTaskComplete(colId, item.id)
                                }
                                className="hover:cursor-pointer"
                              />
                              {editingTaskId === item.id ? (
                                <input
                                  value={editingTaskContent}
                                  onChange={(e) =>
                                    setEditingTaskContent(e.target.value)
                                  }
                                  className="px-2 py-1 rounded text-black"
                                />
                              ) : (
                                <span
                                  className={
                                    item.completed
                                      ? "line-through text-green-600"
                                      : ""
                                  }
                                >
                                  {item.content}
                                </span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              {editingTaskId === item.id ? (
                                <button
                                  onClick={() => updateTask(colId, item.id)}
                                  title="Save"
                                  className=" hover:bg-green-400 px-2 py-1 rounded text-white"
                                >
                                  💾
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    startEditTask(item.id, item.content)
                                  }
                                  title="Edit"
                                  className=" hover:bg-blue-100 px-2 py-1 rounded text-white"
                                >
                                  ✏️
                                </button>
                              )}
                              <button
                                onClick={() => deleteTask(colId, item.id)}
                                title="Delete"
                                className=" hover:bg-red-100 px-2 py-1 rounded text-white"
                              >
                                ❌
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

export default KanbanBoard;
