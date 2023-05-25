import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { HomePage } from './pages/HomePage';
import { MoveablePage } from './pages/MovablePage';

import { DynamicProvider } from './context/DynamicContext';
import { ObjectProvider } from './context/ObjectContext';

const router = createBrowserRouter([
  {
    path: '/moveable',
    element: <MoveablePage />,
    children: [],
  },
  {
    path: '/',
    element: (
      <ObjectProvider>
        <DynamicProvider>
          <HomePage />
        </DynamicProvider>
      </ObjectProvider>
    ),
    children: [],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
