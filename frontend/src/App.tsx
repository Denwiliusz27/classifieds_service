import React from 'react';

function App() {
    return (
        <div className="flex flex-row h-20 justify-center items-center bg-yellow-400 text-white text-2xl font-medium">
            <div className="flex w-52 justify-center items-center">
                <h1 className="drop-shadow-lg">Złota rączka</h1>
            </div>
            <div className="flex flex-1 justify-center items-center">
                <div className="flex justify-center items-center space-x-4">
                    <div className="flex items-center p-6 drop-shadow-lg transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-110 duration-300 ...">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 mx-2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                        <a href="#!" className="drop-shadow-lg">wyszukaj</a>
                    </div>
                    <div className="w-1 bg-white rounded-md h-10"></div>
                    <div className="flex items-center p-6 drop-shadow-lg transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-110 duration-300 ...">
                        <a href="#!" className="drop-shadow-lg">stwórz ofertę</a>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 mx-2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                        </svg>
                    </div>
                </div>
            </div>
            <div className="flex w-52 justify-center items-center">
                <div>
                    <a href="#!"><span>Login</span></a>
                </div>
            </div>
        </div>
    );
}

export default App;
