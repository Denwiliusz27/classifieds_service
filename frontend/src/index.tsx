import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Error from "./pages/Error";
import UserHome from "./pages/UserHome";
import SearchSpecialists from "./pages/SearchSpecialists";
import CreateOffer from "./pages/CreateOffer";
import LoginRegister from "./pages/LoginRegister";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <Error />,
        children: [
            {index: true, element: <UserHome />},
            {
                path: "/wybor_konta",
                element: <LoginRegister />,
            },
            {
                path: "/wyszukaj",
                element: <SearchSpecialists />,
            },
            {
                path: "/klient/stworz_oferte",
                element: <CreateOffer />,
            },
        ]
    }
])

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

