import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoApp from './TodoApp';

describe('TodoApp', () => {
  test('renders the app title', () => {
    render(<TodoApp />);
    expect(screen.getByText('todos')).toBeInTheDocument();
  });

  test('adds a new todo', async () => {
    render(<TodoApp />);
    const input = screen.getByPlaceholderText('What needs to be done?');
    const newTodoText = 'Test new todo';

    fireEvent.change(input, { target: { value: newTodoText } });
    fireEvent.submit(input);

    expect(await screen.findByText(newTodoText)).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  test('deletes a todo', async () => {
    render(<TodoApp />);
    const input = screen.getByPlaceholderText('What needs to be done?');
    const newTodoText = 'Todo to delete';

    fireEvent.change(input, { target: { value: newTodoText } });
    fireEvent.submit(input);

    const deleteButton = await screen.findByText('×');
    fireEvent.click(deleteButton);

    expect(screen.queryByText(newTodoText)).not.toBeInTheDocument();
  });

  test('filters todos correctly', async () => {
    render(<TodoApp />);
    const input = screen.getByPlaceholderText('What needs to be done?');

    fireEvent.change(input, { target: { value: 'Active todo 1' } });
    fireEvent.submit(input);
    
    fireEvent.change(input, { target: { value: 'Active todo 2' } });
    fireEvent.submit(input);
    
    fireEvent.change(input, { target: { value: 'Completed todo' } });
    fireEvent.submit(input);

    const checkboxes = await screen.findAllByRole('checkbox');
    fireEvent.click(checkboxes[2]);

    fireEvent.click(screen.getByText('Active'));
    expect(screen.getByText('Active todo 1')).toBeInTheDocument();
    expect(screen.getByText('Active todo 2')).toBeInTheDocument();
    expect(screen.queryByText('Completed todo')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Completed'));
    expect(screen.queryByText('Active todo 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Active todo 2')).not.toBeInTheDocument();
    expect(screen.getByText('Completed todo')).toBeInTheDocument();

    fireEvent.click(screen.getByText('All'));
    expect(screen.getByText('Active todo 1')).toBeInTheDocument();
    expect(screen.getByText('Active todo 2')).toBeInTheDocument();
    expect(screen.getByText('Completed todo')).toBeInTheDocument();
  });

  test('clears completed todos', async () => {
    render(<TodoApp />);
    const input = screen.getByPlaceholderText('What needs to be done?');

    fireEvent.change(input, { target: { value: 'Active todo' } });
    fireEvent.submit(input);
    
    fireEvent.change(input, { target: { value: 'Completed todo' } });
    fireEvent.submit(input);

    const checkboxes = await screen.findAllByRole('checkbox');
    fireEvent.click(checkboxes[1]);

    fireEvent.click(screen.getByText('Clear completed'));

    expect(screen.getByText('Active todo')).toBeInTheDocument();
    expect(screen.queryByText('Completed todo')).not.toBeInTheDocument();
  });
});