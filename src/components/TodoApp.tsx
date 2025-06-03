import React, { useState } from "react";


interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoInputProps {
  addTodo: (text: string) => void;
}

interface TodoFiltersProps {
  filter: "all" | "active" | "completed";
  setFilter: (filter: "all" | "active" | "completed") => void;
  clearCompleted: () => void;
  remaining: number;
}

const TodoInput: React.FC<TodoInputProps> = ({ addTodo }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      addTodo(text);
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={text} 
        onChange={(e) => setText(e.target.value)} 
        placeholder="What needs to be done?" 
      />
    </form>
  );
};

const TodoFilters: React.FC<TodoFiltersProps> = ({ 
  filter, 
  setFilter, 
  clearCompleted, 
  remaining 
}) => {
  return (
    <div className="filters-container">
      <span className="items-left">{remaining} items left</span>
      <div className="filter-buttons">
        <button 
          onClick={() => setFilter("all")} 
          className={`filter-button ${filter === "all" ? "active" : ""}`}
        >
          All
        </button>
        <button 
          onClick={() => setFilter("active")} 
          className={`filter-button ${filter === "active" ? "active" : ""}`}
        >
          Active
        </button>
        <button 
          onClick={() => setFilter("completed")} 
          className={`filter-button ${filter === "completed" ? "active" : ""}`}
        >
          Completed
        </button>
      </div>
      <button 
        onClick={clearCompleted} 
        className="clear-button"
      >
        Clear completed
      </button>
    </div>
  );
};


const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const addTodo = (text: string) => {
    const newTodo: Todo = { id: Date.now(), text, completed: false };
    setTodos([...todos, newTodo]);
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const filteredTodos = todos.filter(todo =>
    filter === "all" ? true : filter === "active" ? !todo.completed : todo.completed
  );

  return (
    <div className="todo-app">
      <h1>todos</h1>
      <TodoInput addTodo={addTodo} />
      <TodoList todos={filteredTodos} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
      <TodoFilters 
        filter={filter} 
        setFilter={setFilter} 
        clearCompleted={clearCompleted} 
        remaining={todos.filter(todo => !todo.completed).length} 
      />
    </div>
  );
};


interface TodoListProps {
  todos: Todo[];
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, toggleTodo, deleteTodo }) => {
  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <TodoItem 
          key={todo.id} 
          todo={todo} 
          toggleTodo={toggleTodo} 
          deleteTodo={deleteTodo} 
        />
      ))}
    </ul>
  );
};

interface TodoItemProps {
  todo: Todo;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, toggleTodo, deleteTodo }) => {
  return (
    <li className="todo-item">
      <span className={`todo-text ${todo.completed ? "completed" : ""}`}>
        {todo.text}
      </span>
      <div className="todo-controls">
        <input 
          type="checkbox" 
          checked={todo.completed} 
          onChange={() => toggleTodo(todo.id)} 
          className="todo-checkbox"
        />
        <button 
          onClick={() => deleteTodo(todo.id)} 
          className="delete-button"
        >
          ×
        </button>
      </div>
    </li>
  );
};

export default TodoApp;