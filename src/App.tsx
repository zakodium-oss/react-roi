import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { DataProvider } from './context/DataContext';
import { HomePage } from './pages/HomePage';
import { MoveablePage } from './pages/MovablePage';

const router = createBrowserRouter([
  {
    path: '/moveable',
    element: <MoveablePage />,
    children: [],
  },
  {
    path: '/',
    element: (
      <DataProvider>
        <HomePage />
      </DataProvider>
    ),
    children: [],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
