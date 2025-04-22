// src/context/KanbanContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const KanbanContext = createContext();

export const KanbanProvider = ({ children }) => {
  const [columns, setColumns] = useState({});
  const [tasks, setTasks] = useState({});
  const [newColumnName, setNewColumnName] = useState("");
  const [editingColumnId, setEditingColumnId] = useState(null);
  const [editingColumnName, setEditingColumnName] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskContent, setEditingTaskContent] = useState("");

  const handleDragEnd = ({ source, destination }) => {
    if (!destination) return;

    const sourceCol = columns[source.droppableId];
    const destCol = columns[destination.droppableId];
    const sourceItems = [...sourceCol.items];
    const destItems = [...destCol.items];
    const [movedItem] = sourceItems.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceItems.splice(destination.index, 0, movedItem);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceCol,
          items: sourceItems,
        },
      });
    } else {
      destItems.splice(destination.index, 0, movedItem);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceCol,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destCol,
          items: destItems,
        },
      });
    }
  };

  const handleTaskChange = (colId, value) => {
    setTasks({ ...tasks, [colId]: value });
  };

  const addTask = (colId) => {
    const taskContent = tasks[colId];
    if (!taskContent?.trim()) return;
    const newTask = { id: uuidv4(), content: taskContent, completed: false };
    setColumns({
      ...columns,
      [colId]: {
        ...columns[colId],
        items: [...columns[colId].items, newTask],
      },
    });
    setTasks({ ...tasks, [colId]: "" });
  };

  const addColumn = () => {
    if (!newColumnName.trim()) return;
    const id = uuidv4();
    setColumns({
      ...columns,
      [id]: {
        name: newColumnName,
        items: [],
      },
    });
    setNewColumnName("");
  };

  const deleteColumn = (colId) => {
    const updatedColumns = { ...columns };
    delete updatedColumns[colId];
    setColumns(updatedColumns);
    const updatedTasks = { ...tasks };
    delete updatedTasks[colId];
    setTasks(updatedTasks);
  };

  const startEditColumn = (colId, name) => {
    setEditingColumnId(colId);
    setEditingColumnName(name);
  };

  const renameColumn = (colId) => {
    if (!editingColumnName.trim()) return;
    setColumns((prevColumns) => ({
      ...prevColumns,
      [colId]: {
        ...prevColumns[colId],
        name: editingColumnName,
      },
    }));
    setEditingColumnId(null);
    setEditingColumnName("");
  };

  const toggleTaskComplete = (colId, taskId) => {
    const updatedItems = columns[colId].items.map((item) =>
      item.id === taskId ? { ...item, completed: !item.completed } : item
    );
    setColumns({
      ...columns,
      [colId]: { ...columns[colId], items: updatedItems },
    });
  };

  const deleteTask = (colId, taskId) => {
    const updatedItems = columns[colId].items.filter(
      (item) => item.id !== taskId
    );
    setColumns({
      ...columns,
      [colId]: { ...columns[colId], items: updatedItems },
    });
  };

  const startEditTask = (taskId, content) => {
    setEditingTaskId(taskId);
    setEditingTaskContent(content);
  };

  const updateTask = (colId, taskId) => {
    if (!editingTaskContent.trim()) return;
    setColumns((prevColumns) => ({
      ...prevColumns,
      [colId]: {
        ...prevColumns[colId],
        items: prevColumns[colId].items.map((item) =>
          item.id === taskId ? { ...item, content: editingTaskContent } : item
        ),
      },
    }));
    setEditingTaskId(null);
    setEditingTaskContent("");
  };

const editColumnTitle = (columnId, newTitle) => {
  const updatedColumns = {
    ...state.columns,
    [columnId]: {
      ...state.columns[columnId],
      title: newTitle,
    },
  };

  const newState = {
    ...state,
    columns: updatedColumns,
  };

  updateState(newState);
};

  useEffect(() => {
    const storedColumns = localStorage.getItem("kanban_columns");
    const storedTasks = localStorage.getItem("kanban_tasks");

    if (storedColumns) {
      setColumns(JSON.parse(storedColumns));
    }

    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("kanban_columns", JSON.stringify(columns));
  }, [columns]);

  useEffect(() => {
    localStorage.setItem("kanban_tasks", JSON.stringify(tasks));
  }, [tasks]);

  return (
    <KanbanContext.Provider
      value={{
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
        editColumnTitle,
      }}
    >
      {children}
    </KanbanContext.Provider>
  );
};

export const useKanban = () => useContext(KanbanContext);
