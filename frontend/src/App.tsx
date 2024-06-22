import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Link, Outlet, useNavigate} from "react-router-dom";

export interface AuthContextType {
    jwtToken: string;
    setJwtToken: React.Dispatch<React.SetStateAction<string>>;
    userRole: string;
    setUserRole: React.Dispatch<React.SetStateAction<string>>;
    toggleRefresh: (status: boolean) => void;
    setName: React.Dispatch<React.SetStateAction<string>>;
}

function App() {
    const [jwtToken, setJwtToken] = useState("")
    const [userRole, setUserRole] = useState("")
    const [tickInterval, setTickInterval] = useState<any>()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [name, setName] = useState("")

    const navigate = useNavigate()
    const menuRef = useRef<HTMLDivElement | null>(null);

    const logout = () => {
        console.log("LOGOUT")
        fetch(`/logout`, {
            method: "GET",
            credentials: "include",
        })
            .catch((err) => {
                console.log("Error logging out user", err)
            })
            .finally(() => {
                setJwtToken("")
                setUserRole("")
                setIsMenuOpen(false)
                toggleRefresh(false)
                setName("")
                sessionStorage.removeItem(userRole)
                navigate("/wybor_konta")
            })
    }

    const toggleRefresh = useCallback((status: boolean) => {
        if (status) {
            let i = window.setInterval(() => {
                fetch(`/refresh_token`, {
                    method: "GET",
                    credentials: "include",
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.access_token) {
                            console.log("Refreshed Token")
                            setJwtToken(data.access_token)
                            setUserRole(data.user_role)
                        }
                    })
                    .catch((err) => {
                        console.log("user isn't logged")
                    })
            }, 600000)
            setTickInterval(i)
        } else {
            setTickInterval(null)
            clearInterval(tickInterval)
        }
    }, [tickInterval])

    useEffect(() => {
        console.log("Refreshing App")
        if (jwtToken === "") {
            fetch(`/refresh_token`, {
                method: "GET",
                credentials: 'include',
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.access_token) {
                        console.log("Successfully refreshed token: ", data.access_token)
                        setJwtToken(data.access_token)
                        setUserRole(data.user_role)
                        if (!name) {
                            const user = sessionStorage.getItem(data.user_role)
                            if (user) {
                                setName(JSON.parse(user).Name)
                            }
                        }
                        toggleRefresh(true)
                    }
                })
                .catch((err) => {
                    console.log("user isn't logged", err)
                })
        }
    }, [jwtToken, userRole, toggleRefresh, name])

    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setIsMenuOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            <div
                className="flex flex-row sticky top-0 h-20 justify-center items-center bg-amber-900 text-white text-2xl font-medium">

                {/* Logo */}
                <Link to="/" className="flex w-24 ml-10 justify-center items-center hover:cursor-pointer transition-all hover:tracking-widest duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                         stroke="currentColor" className="w-6 h-6 mx-1">
                        <path stroke-linecap="round" stroke-linejoin="round"
                              d="M10.05 4.575a1.575 1.575 0 1 0-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 0 1 3.15 0v1.5m-3.15 0 .075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 0 1 3.15 0V15M6.9 7.575a1.575 1.575 0 1 0-3.15 0v8.175a6.75 6.75 0 0 0 6.75 6.75h2.018a5.25 5.25 0 0 0 3.712-1.538l1.732-1.732a5.25 5.25 0 0 0 1.538-3.712l.003-2.024a.668.668 0 0 1 .198-.471 1.575 1.575 0 1 0-2.228-2.228 3.818 3.818 0 0 0-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0 1 16.35 15m.002 0h-.002"/>
                    </svg>
                    <p className="flex flex-col items-center text-xl font-serif w-16">
                        <h1 className="drop-shadow-lg">złota</h1>
                        <div className="w-14 bg-white rounded-md h-1"></div>
                        <h1 className="drop-shadow-lg">rączka</h1>
                    </p>
                </Link>

                {/* Middle links */}
                <div className="flex flex-1 justify-center items-center">
                    <div className="flex justify-center items-center space-x-4">

                        {userRole !== "specialist" &&
                            <Link to="/wyszukaj"
                                  className="flex items-center p-6 drop-shadow-lg transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-110 duration-300 ...">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     stroke-width="1.5"
                                     stroke="currentColor" className="w-6 h-6 mx-2">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
                                </svg>
                                <p className="drop-shadow-lg">wyszukaj usługę</p>
                            </Link>
                        }

                        {jwtToken !== "" && userRole === "client" &&
                            <>
                                <div className="w-1 bg-white rounded-md h-10"></div>

                                <Link to="/klient/stworz_oferte"
                                      className="flex items-center p-6 drop-shadow-lg transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-110 duration-300 ...">
                                    <p className="drop-shadow-lg">stwórz ofertę</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         stroke-width="1.5"
                                         stroke="currentColor" className="w-6 h-6 mx-2">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/>
                                    </svg>
                                </Link>
                            </>
                        }

                        {jwtToken !== "" && userRole === "specialist" &&
                            <>
                                <Link to="/specjalista/oferty"
                                      className="flex items-center p-6 drop-shadow-lg transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-110 duration-300 ...">
                                    <p className="drop-shadow-lg">przeglądaj oferty</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         stroke-width="1.5"
                                         stroke="currentColor" className="w-6 h-6 mx-2">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/>
                                    </svg>
                                </Link>
                            </>
                        }
                    </div>
                </div>

                {/* Login button */}
                {jwtToken === "" &&
                    <Link to="/wybor_konta" className="flex w-28 justify-center items-center mr-10">
                        <div
                            className="border-2 border-white w-full text-center rounded-2xl cursor-pointer p-2 transition ease-in-out delay-0 bg-amber-900 hover:bg-white hover:text-amber-900 duration-300 ...">
                            <span>zaloguj</span>
                        </div>
                    </Link>
                }

                {/* CLIENT MENU */}
                {jwtToken !== "" && userRole === "client" &&
                    <div className={`flex w-52 h-full justify-center items-center text-center ${isMenuOpen ? 'border-t-4 border-x-4 border-amber-950': ''}`} ref={menuRef}>
                        <div id="menu"
                             className="flex items-center justify-center mx-5 top-0 right-2 text-white rounded cursor-pointer p-2 transition ease-in-out delay-0 bg-amber-900 hover:bg-white hover:text-amber-900 duration-300 ..."
                             onClick={e => setIsMenuOpen(!isMenuOpen)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                            <p className="ml-2">{name? name : "Konto"}</p>
                        </div>
                        <div className={`absolute w-52 top-20 flex flex-col items-center bg-amber-900  border-x-4 border-amber-950 shadow-lg transition-max-height duration-300 ease-out overflow-hidden ${isMenuOpen ? 'border-b-4 max-h-[600px]' : 'max-h-0'}`}>
                            <div className="bg-white rounded-md h-1 mb-6 w-2/3"></div>

                            <div className="flex flex-col items-center justify-items-center">
                                <Link to="/klient/moje_oferty" onClick={e => setIsMenuOpen(false)}
                                      className="flex items-center justify-center p-6 drop-shadow-lg hover:bg-amber-800 w-full">
                                    <p className="drop-shadow-lg mr-2 ">moje oferty</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
                                    </svg>
                                </Link>

                                <Link to="/klient/rezerwacje" onClick={e => setIsMenuOpen(false)}
                                      className="flex items-center justify-center p-6 drop-shadow-lg hover:bg-amber-800 w-full">
                                    <p className="drop-shadow-lg mr-2 ">moje rezerwacje</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                                    </svg>
                                </Link>

                                <Link to="/klient/czaty" onClick={e => setIsMenuOpen(false)}
                                      className="flex items-center justify-center p-6 drop-shadow-lg hover:bg-amber-800 w-full">
                                    <p className="drop-shadow-lg mr-2 ">czaty</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                                    </svg>
                                </Link>

                                <Link to="/klient/profil" onClick={e => setIsMenuOpen(false)}
                                      className="flex items-center justify-center p-6 drop-shadow-lg hover:bg-amber-800 w-full">
                                    <p className="drop-shadow-lg mr-2 ">edytuj profil</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>
                                </Link>
                            </div>

                            <div className="bg-white rounded-md h-1 my-6 w-2/3"></div>

                            <div onClick={logout} className="flex w-52 justify-center items-center pb-4">
                                <div
                                    className="flex items-center justify-center w-32 top-0 right-2 text-white rounded cursor-pointer p-2 transition ease-in-out delay-0 bg-amber-900 hover:bg-white hover:text-amber-900 duration-300 ...">
                                    <span>wyloguj</span>
                                </div>
                            </div>
                        </div>
                    </div>
                }

                {/* SPECIALIST MENU */}
                {jwtToken !== "" && userRole === "specialist" &&
                    <div className={`flex w-52 h-full justify-center items-center text-center ${isMenuOpen ? 'border-t-4 border-x-4 border-amber-950': ''}`} ref={menuRef}>
                        <div id="menu"
                             className="flex items-center justify-center mx-5 top-0 right-2 text-white rounded cursor-pointer p-2 transition ease-in-out delay-0 bg-amber-900 hover:bg-white hover:text-amber-900 duration-300 ..."
                             onClick={e => setIsMenuOpen(!isMenuOpen)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                            <p className="ml-2">{name? name : "Konto"}</p>
                        </div>
                        <div className={`absolute w-52 top-20 flex flex-col items-center bg-amber-900  border-x-4 border-amber-950 shadow-lg transition-max-height duration-300 ease-out overflow-hidden ${isMenuOpen ? 'border-b-4 max-h-[600px]' : 'max-h-0'}`}>
                            <div className="bg-white rounded-md h-1 mb-6 w-2/3"></div>

                            <div className="flex flex-col items-center justify-items-center">
                                <Link to="/specjalista/rezerwacje" onClick={e => setIsMenuOpen(false)}
                                      className="flex items-center justify-center p-6 drop-shadow-lg hover:bg-amber-800 w-full">
                                    <p className="drop-shadow-lg mr-2 ">moje rezerwacje</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                                    </svg>
                                </Link>

                                <Link to="/specjalista/czaty" onClick={e => setIsMenuOpen(false)}
                                      className="flex items-center justify-center p-6 drop-shadow-lg hover:bg-amber-800 w-full">
                                    <p className="drop-shadow-lg mr-2 ">czaty</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                                    </svg>
                                </Link>

                                <Link to="/specjalista/profil" onClick={e => setIsMenuOpen(false)}
                                      className="flex items-center justify-center p-6 drop-shadow-lg hover:bg-amber-800 w-full">
                                    <p className="drop-shadow-lg mr-2 ">edytuj profil</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>
                                </Link>
                            </div>

                            <div className="bg-white rounded-md h-1 my-6 w-2/3"></div>

                            <div onClick={logout} className="flex w-52 justify-center items-center pb-4">
                                <div
                                    className="flex items-center justify-center w-32 top-0 right-2 text-white rounded cursor-pointer p-2 transition ease-in-out delay-0 bg-amber-900 hover:bg-white hover:text-amber-900 duration-300 ...">
                                    <span>wyloguj</span>
                                </div>
                            </div>
                        </div>
                    </div>
                }

            </div>

            <div>
                <Outlet context={{
                    jwtToken,
                    setJwtToken,
                    userRole,
                    setUserRole,
                    toggleRefresh,
                    setName,
                }}/>
            </div>
        </>
    );
}

export default App;
