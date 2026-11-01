import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders title', () => {
  render(<App />);
  expect(screen.getByText(/NLT Coding Agent/i)).toBeInTheDocument();
});

test('rejects empty prompt', () => {
  render(<App />);
  const button = screen.getByRole('button', { name: /send/i });
  fireEvent.click(button);
  expect(screen.getByText(/Prompt cannot be empty/i)).toBeInTheDocument();
});
