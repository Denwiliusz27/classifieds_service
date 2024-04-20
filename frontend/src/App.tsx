import React from 'react';
import {Link, Outlet} from "react-router-dom";

function App() {
    return (
        <>
            <div className="flex flex-row sticky top-0 h-20 justify-center items-center bg-amber-900 text-white text-2xl font-medium">

                {/* Logo */}
                <Link to="/" className="flex w-52 justify-center items-center hover:cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                         stroke="currentColor" className="w-6 h-6 mx-1">
                        <path stroke-linecap="round" stroke-linejoin="round"
                              d="M10.05 4.575a1.575 1.575 0 1 0-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 0 1 3.15 0v1.5m-3.15 0 .075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 0 1 3.15 0V15M6.9 7.575a1.575 1.575 0 1 0-3.15 0v8.175a6.75 6.75 0 0 0 6.75 6.75h2.018a5.25 5.25 0 0 0 3.712-1.538l1.732-1.732a5.25 5.25 0 0 0 1.538-3.712l.003-2.024a.668.668 0 0 1 .198-.471 1.575 1.575 0 1 0-2.228-2.228 3.818 3.818 0 0 0-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0 1 16.35 15m.002 0h-.002"/>
                    </svg>
                    <p className="flex flex-col items-center text-xl font-serif ">
                        <h1 className="drop-shadow-lg">złota</h1>
                        <div className="w-14 bg-white rounded-md h-1"></div>
                        <h1 className="drop-shadow-lg">rączka</h1>
                    </p>
                </Link>

                {/* Middle links */}
                <div className="flex flex-1 justify-center items-center">
                    <div className="flex justify-center items-center space-x-4">
                        <Link to="/wyszukaj"
                            className="flex items-center p-6 drop-shadow-lg transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-110 duration-300 ...">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                 stroke="currentColor" className="w-6 h-6 mx-2">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
                            </svg>
                            <p className="drop-shadow-lg">wyszukaj</p>
                        </Link>

                        <div className="w-1 bg-white rounded-md h-10"></div>

                        <Link to="/klient/stworz_oferte"
                            className="flex items-center p-6 drop-shadow-lg transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-110 duration-300 ...">
                            <p className="drop-shadow-lg">stwórz ofertę</p>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                 stroke="currentColor" className="w-6 h-6 mx-2">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/>
                            </svg>
                        </Link>
                    </div>
                </div>

                {/* Login/Logout button */}
                <Link to="/wybor_konta" className="flex w-52 justify-center items-center">
                    <div className="border-2 border-white rounded-2xl cursor-pointer p-2 transition ease-in-out delay-0 bg-amber-900 hover:bg-white hover:text-amber-900 duration-300 ...">
                        <span>zaloguj</span>
                    </div>
                </Link>
            </div>

            <div>
                <Outlet />
            </div>
        </>

    );
}

export default App;
