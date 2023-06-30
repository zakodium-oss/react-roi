import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { DynamicProvider } from './context/DynamicContext';
import { HomePage } from './pages/HomePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <DynamicProvider>
        <HomePage />
      </DynamicProvider>
    ),
    children: [],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
