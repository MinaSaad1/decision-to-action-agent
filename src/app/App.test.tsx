import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App', () => {
  it('states the proof in buyer language', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { name: /not another chatbot/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/synthetic demonstration data/i)).toBeInTheDocument();
  });
});
