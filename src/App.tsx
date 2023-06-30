import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { RoiProvider } from './context/RoiContext';
import { HomePage } from './pages/HomePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <RoiProvider>
        <HomePage />
      </RoiProvider>
    ),
    children: [],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
