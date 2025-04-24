import React, { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { arrayMove } from "@dnd-kit/sortable";


const BoardContext = createContext();

const getInitialBoards = () => {
  const stored = localStorage.getItem("kanban_boards");
  return stored ? JSON.parse(stored) : [
    {
      id: uuidv4(),
      name: "My First Board",
      columns: [
        {
          id: uuidv4(),
          name: "To Do",
          tasks: [
            { id: uuidv4(), content: "My first task", completed: false }
          ]
        }
      ]
    }
  ];
};

export const BoardProvider = ({ children }) => {
  const [boards, setBoards] = useState(getInitialBoards);
  const [activeBoardId, setActiveBoardId] = useState(boards[0]?.id || null);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("kanban_boards", JSON.stringify(boards));
  }, [boards]);

  const activeBoard = boards.find(b => b.id === activeBoardId);

  // ===== BOARD FUNCTIONS =====
  const createBoard = (name) => {
    const newBoard = {
      id: uuidv4(),
      name,
      columns: []
    };
    setBoards([...boards, newBoard]);
    setActiveBoardId(newBoard.id);
  };

  const deleteBoard = (id) => {
    const updated = boards.filter(board => board.id !== id);
    setBoards(updated);
    if (activeBoardId === id && updated.length > 0) {
      setActiveBoardId(updated[0].id);
    }
  };

  const renameBoard = (id, newName) => {
    setBoards(boards.map(board =>
      board.id === id ? { ...board, name: newName } : board
    ));
  };

  // ===== COLUMN FUNCTIONS =====
  const addColumn = (boardId, columnName) => {
    const newColumn = {
      id: `col-${Date.now()}`, // unique ID
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

  // BoardContext.js or wherever your logic lives
const reorderColumns = (boardId, sourceIndex, destinationIndex) => {
  setBoards((prevBoards) =>
    prevBoards.map((board) => {
      if (board.id !== boardId) return board;

      const newColumns = Array.from(board.columns);
      const [movedColumn] = newColumns.splice(sourceIndex, 1);
      newColumns.splice(destinationIndex, 0, movedColumn);

      return {
        ...board,
        columns: newColumns,
      };
    })
  );
};


  // ===== TASK FUNCTIONS =====
  const addTask = (boardId, columnId, taskName) => {
    setBoards(prevBoards =>
      prevBoards.map(board => {
        if (board.id === boardId) {
          return {
            ...board,
            columns: board.columns.map(column => {
              if (column.id === columnId) {
                const newTask = {
                  id: uuidv4(),
                  name: taskName,
                  completed: false,
                };
                return {
                  ...column,
                  tasks: [...column.tasks, newTask],
                };
              }
              return column;
            }),
          };
        }
        return board;
      })
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

  const moveTask = (sourceColId, destColId, taskId) => {
    let taskToMove;
    const updatedBoards = boards.map(board => {
      if (board.id !== activeBoardId) return board;

      const sourceCol = board.columns.find(col => col.id === sourceColId);
      const destCol = board.columns.find(col => col.id === destColId);

      const updatedColumns = board.columns.map(col => {
        if (col.id === sourceColId) {
          taskToMove = col.tasks.find(t => t.id === taskId);
          return { ...col, tasks: col.tasks.filter(t => t.id !== taskId) };
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
                      tasks: arrayMove(column.tasks, sourceIndex, destinationIndex),
                    }
                  : column
              ),
            }
          : board
      )
    );
  };
  
  const moveTaskBetweenColumns = (boardId, sourceColumnId, destinationColumnId, taskId) => {
    setBoards((prevBoards) =>
      prevBoards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              columns: board.columns.map((column) => {
                if (column.id === sourceColumnId) {
                  const newTasks = column.tasks.filter((task) => task.id !== taskId);
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

        addTask,
        renameTask,
        deleteTask,
        moveTask,
        toggleCompleteTask,
        reorderTasks,
        reorderColumns,

        moveTaskBetweenColumns,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = () => useContext(BoardContext);
