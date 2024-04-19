import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import ErrorPage from "./components/ErrorPage";
import UserHomePage from "./components/UserHomePage";
import SearchSpecialistsPage from "./components/SearchSpecialistsPage";
import CreateOfferPage from "./components/CreateOfferPage";
import LoginRegisterPage from "./components/LoginRegisterPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {index: true, element: <UserHomePage />},
            {
                path: "/wybor_konta",
                element: <LoginRegisterPage />,
            },
            {
                path: "/wyszukaj",
                element: <SearchSpecialistsPage />,
            },
            {
                path: "/klient/stworz_oferte",
                element: <CreateOfferPage />,
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

