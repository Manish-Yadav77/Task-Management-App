import React, { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { arrayMove } from "@dnd-kit/sortable";

const BoardContext = createContext();

const getInitialBoards = () => {
  const stored = localStorage.getItem("kanban_boards");
  return stored
    ? JSON.parse(stored)
    : [
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
      ];
};

export const BoardProvider = ({ children }) => {
  const [boards, setBoards] = useState(getInitialBoards);
  const [activeBoardId, setActiveBoardId] = useState(boards[0]?.id || null);
  const token = localStorage.getItem("token");

  // Fetch boards from backend
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/boards", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("Failed to fetch boards");
          return;
        }

        const result = await res.json();
        if (result?.boards) {
          setBoards(result.boards);
          setActiveBoardId(result.boards[0]?.id || null);
        }
      } catch (err) {
        console.error("Error fetching boards:", err);
      }
    };

    if (token) fetchBoards();
  }, [token]);

  // Save boards to backend
  useEffect(() => {
    const saveBoards = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/boards", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ boards }),
        });

        if (!res.ok) console.error("Failed to save boards");
      } catch (error) {
        console.error("Save error:", error);
      }
    };

    if (boards.length > 0 && token) saveBoards();
  }, [boards, token]);

  const activeBoard = boards.find((b) => b.id === activeBoardId);

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
