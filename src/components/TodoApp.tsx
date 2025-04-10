import React, { useState } from "react";




interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

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
      <TodoFilters filter={filter} setFilter={setFilter} clearCompleted={clearCompleted} remaining={todos.filter(todo => !todo.completed).length} />
    </div>
  );
};

interface TodoInputProps {
  addTodo: (text: string) => void;
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
      <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="What needs to be done?" />
    </form>
  );
};

interface TodoListProps {
  todos: Todo[];
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, toggleTodo, deleteTodo }) => {
  return (
    <ul>
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
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
    <li>
      <input type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo.id)} />
      <span style={{ textDecoration: todo.completed ? "line-through" : "none" }}>{todo.text}</span>
      <button onClick={() => deleteTodo(todo.id)}>X</button>
    </li>
  );
};

interface TodoFiltersProps {
  filter: "all" | "active" | "completed";
  setFilter: (filter: "all" | "active" | "completed") => void;
  clearCompleted: () => void;
  remaining: number;
}

const TodoFilters: React.FC<TodoFiltersProps> = ({ filter, setFilter, clearCompleted, remaining }) => {
  return (
    <div>
      <span>{remaining} items left</span>
      <button onClick={() => setFilter("all")} className={filter === "all" ? "active" : ""}>All</button>
      <button onClick={() => setFilter("active")} className={filter === "active" ? "active" : ""}>Active</button>
      <button onClick={() => setFilter("completed")} className={filter === "completed" ? "active" : ""}>Completed</button>
      <button onClick={clearCompleted}>Clear completed</button>
    </div>
  );
};

export default TodoApp;
