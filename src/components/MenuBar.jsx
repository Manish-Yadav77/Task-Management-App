import React, { useState } from "react";
import { useKanban } from "../context/KanbanContext";

function MenuBar() {
  const { boards, currentBoard, setCurrentBoard, addBoard } = useKanban();
  const [newBoardName, setNewBoardName] = useState("");

  const handleAddBoard = () => {
    if (!newBoardName.trim()) return;
    addBoard(newBoardName);
    setNewBoardName("");
  };

  return (
    <menu className="absolute left-4 top-30 border-1 border-yellow-400 p-4 rounded-2xl w-60 bg-amber-100 shadow-lg flex flex-col gap-4">
      <h3 className="font-bold text-xl text-center text-yellow-800">📋 Menu Bar</h3>

      <div className="flex flex-col gap-2">
        <label className="font-medium">Add New Screen</label>
        <input
          type="text"
          placeholder="New Board Name"
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
          className="border px-3 py-1 rounded text-sm font-medium"
        />
        <button
          onClick={handleAddBoard}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 rounded hover:cursor-pointer"
        >
          ➕ Add Screen
        </button>
      </div>

      <select
        value={currentBoard}
        onChange={(e) => setCurrentBoard(e.target.value)}
        className="border px-2 py-1 rounded text-sm hover:cursor-pointer"
      >
        {Object.keys(boards).map((boardName) => (
          <option key={boardName} value={boardName} className="hover:cursor-pointer">
            {boardName}
          </option>
        ))}
      </select>
    </menu>
  );
}

export default MenuBar;
