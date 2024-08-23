import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Error from "./pages/Error";
import ClientHome from "./pages/Client/ClientHome";
import SearchSpecialistsCategory from "./pages/SearchSpecialistsCategory";
import LoginRegister from "./pages/LoginRegister";
import SpecialistHome from "./pages/Specialist/SpecialistHome";
import ClientLogin from "./pages/Client/ClientLogin";
import ClientRegister from "./pages/Client/ClientRegister";
import SpecialistLogin from "./pages/Specialist/SpecialistLogin";
import SpecialistRegister from "./pages/Specialist/SpecialistRegister";
import ClientReservations from "./pages/Client/ClientReservations";
import SpecialistReservations from "./pages/Specialist/SpecialistReservations";
import SearchSpecialistsDetails from "./pages/SearchSpecialistsDetails";
import SpecialistProfile from "./pages/Specialist/SpecialistProfile";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <Error />,
        children: [
            {index: true, element: <ClientHome />},
            {
                path: "/wybor_konta",
                element: <LoginRegister />,
            },
            {
                path: "/wyszukaj",
                element: <SearchSpecialistsCategory />,
            },
            {
                path: "/wyszukaj/szczegóły",
                element: <SearchSpecialistsDetails />,
            },

            /// ------------ CLIENT ------------
            {
                path: "/klient/login",
                element: <ClientLogin />,
            },
            {
                path: "/klient/rejestracja",
                element: <ClientRegister />,
            },
            {
                path: "/klient/rezerwacje",
                element: <ClientReservations/>,
            },

            /// ------------ SPECIALIST ------------
            {
                path: "/specjalista/login",
                element: <SpecialistLogin />,
            },
            {
                path: "/specjalista/rejestracja",
                element: <SpecialistRegister />,
            },
            {
                path: "/specjalista/strona_glowna",
                element: <SpecialistHome />,
            },
            {
                path: "/specjalista/rezerwacje",
                element: <SpecialistReservations />,
            },
            {
                path: "/specjalista/szczegóły",
                element: <SpecialistProfile />,
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

