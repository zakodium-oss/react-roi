import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { HomePage } from './pages/HomePage';

import { DynamicProvider } from './context/DynamicContext';
import { ObjectProvider } from './context/ObjectContext';

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
