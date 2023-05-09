import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { DragProvider } from './context/DragContext';
import { HomePage } from './pages/HomePage';
import { MoveablePage } from './pages/MovablePage';

const router = createBrowserRouter([
  {
    path: '/movable',
    element: <MoveablePage />,
    children: [],
  },
  {
    path: '/',
    element: (
      <DragProvider>
        <HomePage />
      </DragProvider>
    ),
    children: [],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
