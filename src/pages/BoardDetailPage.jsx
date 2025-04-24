import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { DragOverlay } from "@dnd-kit/core";
import {
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
  useSortable,
  SortableContext,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useBoard } from "../context/BoardContext";

const SortableItem = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

const SortableTaskItem = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

const BoardDetailPage = () => {
  const { boardId } = useParams();
  const [newColumnName, setNewColumnName] = useState("");
  const [editingColumnId, setEditingColumnId] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [columnEdits, setColumnEdits] = useState({});
  const [taskEdits, setTaskEdits] = useState({});
  const [taskInputs, setTaskInputs] = useState({});

  const {
    boards,
    updateTask,
    deleteTask,
    toggleCompleteTask,
    deleteColumn,
    renameColumn,
    addColumn,
    addTask,
    renameTask,
    reorderTasks,
    reorderColumns,
    moveTaskBetweenColumns,
  } = useBoard();

  const board = boards.find((b) => b.id === boardId);
  if (!board) return <p className="text-center mt-10">Board not found.</p>;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeColumn = board.columns.find(col => col.id.toString() === active.id);
    const overColumn = board.columns.find(col => col.id.toString() === over.id);

    if (activeColumn && overColumn) {
      const oldIndex = board.columns.findIndex(col => col.id.toString() === active.id);
      const newIndex = board.columns.findIndex(col => col.id.toString() === over.id);
      if (oldIndex !== newIndex) {
        reorderColumns(board.id, oldIndex, newIndex);
        return;
      }
    }

    const sourceCol = board.columns.find((col) =>
      col.tasks.some((task) => task.id.toString() === active.id)
    );
    const destinationCol = board.columns.find((col) =>
      col.tasks.some((task) => task.id.toString() === over.id)
    );

    if (sourceCol && destinationCol) {
      const sourceTaskIndex = sourceCol.tasks.findIndex((task) => task.id.toString() === active.id);
      const destinationTaskIndex = destinationCol.tasks.findIndex((task) => task.id.toString() === over.id);

      if (sourceCol.id === destinationCol.id) {
        reorderTasks(board.id, sourceCol.id, sourceTaskIndex, destinationTaskIndex);
      } else {
        moveTaskBetweenColumns(board.id, sourceCol.id, destinationCol.id, active.id);
      }
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-[#fffbe6] to-[#ffe2cc] min-h-screen text-gray-800">
      <h2 className="text-3xl font-bold mb-6 text-center text-orange-600 drop-shadow">{board.name}</h2>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={board.columns.map((col) => col.id.toString())} strategy={horizontalListSortingStrategy}>
          <div className="flex gap-6 flex-wrap overflow-auto pb-4">
            {board.columns.map((column) => (
              <SortableItem key={column.id} id={column.id.toString()}>
                <div className="bg-white shadow-md p-4 rounded-2xl w-72 shrink-0 transition-transform hover:scale-[1.02]">
                  <div className="flex justify-between items-center mb-2">
                    {editingColumnId === column.id ? (
                      <input
                        value={columnEdits[column.id] ?? column.name}
                        onChange={(e) => setColumnEdits((prev) => ({ ...prev, [column.id]: e.target.value }))}
                        className="font-bold bg-yellow-50 p-2 rounded w-full outline-none border border-yellow-300"
                      />
                    ) : (
                      <span className="font-bold text-lg text-yellow-700">{column.name}</span>
                    )}
                    <div className="flex gap-1 ml-2">
                      {editingColumnId === column.id ? (
                        <>
                          <button onClick={() => { renameColumn(board.id, column.id, columnEdits[column.id]); setEditingColumnId(null); }} className="text-green-600 text-sm hover:scale-110">✅</button>
                          <button onClick={() => { setEditingColumnId(null); setColumnEdits((prev) => { const { [column.id]: _, ...rest } = prev; return rest; }); }} className="text-gray-500 text-sm hover:scale-110">❌</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => { setEditingColumnId(column.id); setColumnEdits({ ...columnEdits, [column.id]: column.name }); }} className="text-sm hover:text-yellow-600">✏️</button>
                          <button onClick={() => deleteColumn(board.id, column.id)} className="text-sm hover:text-red-600">❌</button>
                        </>
                      )}
                    </div>
                  </div>

                  <SortableContext items={column.tasks.map((task) => task.id.toString())} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                      {column.tasks.map((task) => (
                        <SortableTaskItem key={task.id} id={task.id.toString()}>
                          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-xl shadow-sm">
                            {editingTaskId === task.id ? (
                              <>
                                <input
                                  value={taskEdits[task.id] ?? task.name}
                                  onChange={(e) => setTaskEdits((prev) => ({ ...prev, [task.id]: e.target.value }))}
                                  className="w-full bg-white p-1 rounded border border-yellow-300"
                                />
                                <div className="flex justify-between mt-1 text-sm">
                                  <button onClick={() => { renameTask(board.id, column.id, task.id, taskEdits[task.id]); setEditingTaskId(null); }} className="text-green-600">✅ Save</button>
                                  <button onClick={() => { setEditingTaskId(null); setTaskEdits((prev) => { const { [task.id]: _, ...rest } = prev; return rest; }); }} className="text-gray-500">❌ Cancel</button>
                                </div>
                              </>
                            ) : (
                              <div className="flex justify-between items-center">
                                <span className={task.completed ? "line-through text-gray-400" : ""}>{task.name}</span>
                                <div className="flex gap-1 text-sm">
                                  <button onClick={() => toggleCompleteTask(board.id, column.id, task.id)} className="hover:text-green-600">✅</button>
                                  <button onClick={() => { setEditingTaskId(task.id); setTaskEdits((prev) => ({ ...prev, [task.id]: task.name })); }} className="hover:text-yellow-600">✏️</button>
                                  <button onClick={() => deleteTask(board.id, column.id, task.id)} className="hover:text-red-600">❌</button>
                                </div>
                              </div>
                            )}
                          </div>
                        </SortableTaskItem>
                      ))}
                    </div>
                  </SortableContext>

                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="New task"
                      value={taskInputs[column.id] || ""}
                      onChange={(e) => setTaskInputs((prev) => ({ ...prev, [column.id]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && taskInputs[column.id]) {
                          addTask(board.id, column.id, taskInputs[column.id]);
                          setTaskInputs((prev) => ({ ...prev, [column.id]: "" }));
                        }
                      }}
                      className="w-full p-1 border border-yellow-200 rounded bg-yellow-50 text-sm"
                    />
                  </div>
                </div>
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="mt-6 flex gap-2">
        <input
          type="text"
          placeholder="New column name"
          value={newColumnName}
          onChange={(e) => setNewColumnName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && newColumnName.trim()) {
              addColumn(board.id, newColumnName);
              setNewColumnName("");
            }
          }}
          className="p-2 border border-yellow-300 rounded w-60 bg-white"
        />
        <button
          onClick={() => {
            if (newColumnName.trim()) {
              addColumn(board.id, newColumnName);
              setNewColumnName("");
            }
          }}
          className="px-4 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition"
        >
          Add Column
        </button>
      </div>
    </div>
  );
};

export default BoardDetailPage;
