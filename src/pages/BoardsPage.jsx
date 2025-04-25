import React, { useState } from "react";
import { useBoard } from "../context/BoardContext";
import { useNavigate } from "react-router-dom";

const BoardsPage = () => {
  const {
    boards,
    activeBoardId,
    setActiveBoardId,
    createBoard,
    deleteBoard,
    renameBoard,
  } = useBoard();

  const [bName, setBName] = useState("");
  const [editingBoardId, setEditingBoardId] = useState(null);
  const [editingBoardName, setEditingBoardName] = useState("");

  const navigate = useNavigate();

  const handleCreateBoard = () => {
    if (bName.trim()) {
      createBoard(bName.trim());
      setBName("");
    }
  };

  const handleBoardClick = (id) => {
    setActiveBoardId(id);
    navigate(`/board/${id}`);
  };

  const handleRenameBoard = (id, currentName) => {
    setEditingBoardId(id);
    setEditingBoardName(currentName);
  };

  const handleRenameSave = (id) => {
    if (editingBoardName.trim()) {
      renameBoard(id, editingBoardName.trim());
    }
    setEditingBoardId(null);
    setEditingBoardName("");
  };

  const isAuthenticated = localStorage.getItem("token");

  if (!isAuthenticated) {
    return (
    <div>Loading...</div>
    )      
  }
  
  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-100 to-blue-100">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">📋 All Boards</h2>
      
      <div className="space-y-4">
        {boards.map((board) => (
          <div
          key={board.id}
          className={`p-4 rounded-2xl shadow-sm transition-all duration-200 w-8/12 border flex items-center justify-center ${
            activeBoardId === board.id
              ? "bg-blue-50 border-blue-400 shadow-md"
              : "bg-white hover:shadow-md"
          } mx-auto md:mx-auto`}
        >
            <div className="flex justify-between items-center gap-10">
              {editingBoardId === board.id ? (
                <input
                  type="text"
                  className="border border-gray-300 rounded-lg px-3 py-1 w-full outline-blue-400"
                  value={editingBoardName}
                  onChange={(e) => setEditingBoardName(e.target.value)}
                  onBlur={() => handleRenameSave(board.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleRenameSave(board.id);
                    }
                  }}
                  autoFocus
                />
              ) : (
                <button
                  onClick={() => handleBoardClick(board.id)}
                  className="text-left text-lg font-medium text-gray-700 hover:text-blue-600 transition"
                >
                  {board.name}
                </button>
              )}

              <div className="space-x-2 flex-shrink-0">
                <button
                  onClick={() => handleRenameBoard(board.id, board.name)}
                  title="Rename"
                  className="text-yellow-500 hover:text-yellow-600 transition"
                >
                  ✏️
                </button>
                <button
                  onClick={() => deleteBoard(board.id)}
                  title="Delete"
                  className="text-red-500 hover:text-red-600 transition"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-white rounded-xl p-6 shadow-lg w-full max-w-md mx-auto">
        <input
          type="text"
          placeholder="Enter New Board Name"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          value={bName}
          onChange={(e) => setBName(e.target.value)}
        />
        <button
          className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl transition"
          onClick={handleCreateBoard}
        >
          ➕ Add New Board
        </button>
      </div>
    </div>
  );
};

export default BoardsPage;
