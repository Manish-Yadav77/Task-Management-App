import React, { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { arrayMove } from "@dnd-kit/sortable";

const BoardContext = createContext();

export const BoardProvider = ({ children }) => {
  const token = localStorage.getItem("token");

  const getInitialBoardData = () => {
    try {
      const stored = localStorage.getItem("boardData");
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.error("Failed to parse boardData from localStorage", e);
      return null;
    }
  };

  const initialData = getInitialBoardData();
  const [boards, setBoards] = useState(
    initialData?.boards || [
      {
        id: uuidv4(),
        name: "My First Board",
        columns: [
          {
            id: uuidv4(),
            name: "To Do",
            tasks: [{ id: uuidv4(), name: "My first task", completed: false }],
          },
        ],
      },
    ]
  );
  const [activeBoardId, setActiveBoardId] = useState(
    initialData?.activeBoardId || initialData?.boards?.[0]?.id || null
  );
  const [hasLoadedBoards, setHasLoadedBoards] = useState(false);

  const setBoardData = (data) => {
    try {
      localStorage.setItem("boardData", JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
    }
  };

  const syncWithBackend = async (boards, activeBoardId) => {
    try {
      const res = await fetch("http://localhost:3000/api/saveBoards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ boards, activeBoardId }),
      });

      const data = await res.json();
      if (res.ok) {
        console.log("✅ Synced with backend:", data.message);
      } else {
        console.error("❌ Backend Error:", data.error);
      }
    } catch (err) {
      console.error("❌ Network Error:", err);
    }
  };

  const fetchBoardsFromBackend = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/boards", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setBoards(data.boards);
        setActiveBoardId(data.activeBoardId);
        setHasLoadedBoards(true);
      } else {
        console.error("❌ Error loading boards:", data.error);
      }
    } catch (err) {
      console.error("❌ Network Error:", err);
    }
  };

  useEffect(() => {
    fetchBoardsFromBackend();
  }, []);

  useEffect(() => {
    if (!hasLoadedBoards) return;
    if (boards.length > 0 || activeBoardId) {
      setBoardData({ boards, activeBoardId }); // localStorage
      syncWithBackend(boards, activeBoardId); // backend
    }
  }, [boards, activeBoardId, hasLoadedBoards]);

  const activeBoard = boards.find((b) => b.id === activeBoardId);

  // const activeBoard = boards.find((b) => b.id === activeBoardId);

  // ===== BOARD FUNCTIONS =====
  const createBoard = (name) => {
    const newBoard = { id: uuidv4(), name, columns: [] };
    setBoards([...boards, newBoard]);
    setActiveBoardId(newBoard.id);
  };

  const deleteBoard = (id) => {
    const updated = boards.filter((b) => b.id !== id);
    setBoards(updated);
    if (activeBoardId === id && updated.length > 0) {
      setActiveBoardId(updated[0].id);
    }
  };

  const renameBoard = (id, newName) => {
    setBoards((prev) =>
      prev.map((b) => (b.id === id ? { ...b, name: newName } : b))
    );
  };

  // ===== COLUMN FUNCTIONS =====
  const addColumn = (boardId, columnName) => {
    const newColumn = {
      id: `col-${uuidv4()}`,
      name: columnName,
      tasks: [],
    };
    setBoards((prev) =>
      prev.map((board) =>
        board.id === boardId
          ? { ...board, columns: [...board.columns, newColumn] }
          : board
      )
    );
  };

  const renameColumn = (boardId, columnId, newName) => {
    setBoards((prev) =>
      prev.map((board) =>
        board.id === boardId
          ? {
              ...board,
              columns: board.columns.map((col) =>
                col.id === columnId ? { ...col, name: newName } : col
              ),
            }
          : board
      )
    );
  };

  const deleteColumn = (boardId, columnId) => {
    setBoards((prev) =>
      prev.map((board) =>
        board.id === boardId
          ? {
              ...board,
              columns: board.columns.filter((col) => col.id !== columnId),
            }
          : board
      )
    );
  };

  const reorderColumns = (boardId, sourceIndex, destinationIndex) => {
    setBoards((prevBoards) =>
      prevBoards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              columns: arrayMove(board.columns, sourceIndex, destinationIndex),
            }
          : board
      )
    );
  };

  // ===== TASK FUNCTIONS =====
  const addTask = (boardId, columnId, taskName) => {
    setBoards((prev) =>
      prev.map((board) =>
        board.id === boardId
          ? {
              ...board,
              columns: board.columns.map((col) =>
                col.id === columnId
                  ? {
                      ...col,
                      tasks: [
                        ...col.tasks,
                        { id: uuidv4(), name: taskName, completed: false },
                      ],
                    }
                  : col
              ),
            }
          : board
      )
    );
  };

  const toggleCompleteTask = (boardId, columnId, taskId) => {
    setBoards((prev) =>
      prev.map((board) =>
        board.id === boardId
          ? {
              ...board,
              columns: board.columns.map((col) =>
                col.id === columnId
                  ? {
                      ...col,
                      tasks: col.tasks.map((task) =>
                        task.id === taskId
                          ? { ...task, completed: !task.completed }
                          : task
                      ),
                    }
                  : col
              ),
            }
          : board
      )
    );
  };

  const renameTask = (boardId, columnId, taskId, newName) => {
    setBoards((prev) =>
      prev.map((board) =>
        board.id === boardId
          ? {
              ...board,
              columns: board.columns.map((col) =>
                col.id === columnId
                  ? {
                      ...col,
                      tasks: col.tasks.map((task) =>
                        task.id === taskId ? { ...task, name: newName } : task
                      ),
                    }
                  : col
              ),
            }
          : board
      )
    );
  };

  const deleteTask = (boardId, columnId, taskId) => {
    setBoards((prev) =>
      prev.map((board) =>
        board.id === boardId
          ? {
              ...board,
              columns: board.columns.map((col) =>
                col.id === columnId
                  ? {
                      ...col,
                      tasks: col.tasks.filter((task) => task.id !== taskId),
                    }
                  : col
              ),
            }
          : board
      )
    );
  };

  const reorderTasks = (boardId, columnId, sourceIndex, destinationIndex) => {
    setBoards((prevBoards) =>
      prevBoards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              columns: board.columns.map((column) =>
                column.id === columnId
                  ? {
                      ...column,
                      tasks: arrayMove(
                        column.tasks,
                        sourceIndex,
                        destinationIndex
                      ),
                    }
                  : column
              ),
            }
          : board
      )
    );
  };

  const moveTask = (sourceColId, destColId, taskId) => {
    let taskToMove;
    const updatedBoards = boards.map((board) => {
      if (board.id !== activeBoardId) return board;

      const updatedColumns = board.columns.map((col) => {
        if (col.id === sourceColId) {
          taskToMove = col.tasks.find((t) => t.id === taskId);
          return { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) };
        }
        if (col.id === destColId && taskToMove) {
          return { ...col, tasks: [...col.tasks, taskToMove] };
        }
        return col;
      });

      return { ...board, columns: updatedColumns };
    });

    setBoards(updatedBoards);
  };

  const moveTaskBetweenColumns = (
    boardId,
    sourceColumnId,
    destinationColumnId,
    taskId
  ) => {
    setBoards((prevBoards) =>
      prevBoards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              columns: board.columns.map((column) => {
                if (column.id === sourceColumnId) {
                  const newTasks = column.tasks.filter(
                    (task) => task.id !== taskId
                  );
                  return { ...column, tasks: newTasks };
                } else if (column.id === destinationColumnId) {
                  const taskToMove = board.columns
                    .find((col) => col.id === sourceColumnId)
                    .tasks.find((task) => task.id === taskId);
                  return { ...column, tasks: [...column.tasks, taskToMove] };
                }
                return column;
              }),
            }
          : board
      )
    );
  };

  return (
    <BoardContext.Provider
      value={{
        boards,
        activeBoardId,
        setActiveBoardId,
        activeBoard,

        createBoard,
        deleteBoard,
        renameBoard,

        addColumn,
        renameColumn,
        deleteColumn,
        reorderColumns,

        addTask,
        renameTask,
        deleteTask,
        toggleCompleteTask,
        reorderTasks,
        moveTask,
        moveTaskBetweenColumns,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = () => useContext(BoardContext);
