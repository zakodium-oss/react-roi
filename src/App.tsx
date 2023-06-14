import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { HomePage } from './pages/HomePage';

import { DynamicProvider } from './context/DynamicContext';
import { KbsProvider } from 'react-kbs';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <DynamicProvider>
        <KbsProvider>
          <HomePage />
        </KbsProvider>
      </DynamicProvider>
    ),
    children: [],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
