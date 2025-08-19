// import { render, screen } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
// import { describe, it, expect } from 'vitest';
// import { Provider } from 'react-redux';
// import { configureStore } from '@reduxjs/toolkit';
// import Counter from './Counter';

// const mockStore = configureStore({
//   reducer: {
//     counter: (state = { value: 0 }) => state
//   }
// });

// describe('Counter Component', () => {
//   it('displays initial count', () => {
//     const store = configureStore({
//       reducer: {
//         counter: () => ({ value: 5 })
//       }
//     });
    
//     render(
//       <Provider store={store}>
//         <Counter />
//       </Provider>
//     );
    
//     expect(screen.getByText('5')).toBeInTheDocument();
//   });
// });