import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import UserProfile from './ProfilePage';

// Define your API handlers
const handlers = [
  http.get('/api/user', () => {
    return HttpResponse.json({
      name: 'Test User',
      email: 'test@example.com'
    });
  }),
];

const server = setupServer(...handlers);

describe('UserProfile Component', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('displays user data after API call', async () => {
    render(<UserProfile />);
    
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });
  });
});