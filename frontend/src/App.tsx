import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Link, Outlet, useNavigate} from "react-router-dom";
import {Notification} from "./models/Notification";

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
    const [notifications, setNotifications] = useState<Notification[]>()
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
    const [fill, setFill] = useState(false)
    const [unread, setUnread] = useState(false)

    const navigate = useNavigate()
    const menuRef = useRef<HTMLDivElement | null>(null);
    const notificationsRef = useRef<HTMLDivElement | null>(null);

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
                setNotifications([])
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
                            getNotifications()
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
                                setName(JSON.parse(user).name)
                            }
                        }
                        toggleRefresh(true)
                    }
                })
                .catch((err) => {
                    console.log("user isn't logged", err)
                })
        } else {
            getNotifications()
        }
    }, [jwtToken, userRole, toggleRefresh])

    const getNotifications = () => {
        const user = sessionStorage.getItem(userRole)

        const headers = new Headers()
        headers.append("Content-Type", "application/json")
        headers.append("Authorization", "Bearer " + jwtToken)

        if (userRole === 'client' && user) {
            fetch(`/client/notifications/${JSON.parse(user!).id}`, {
                method: "GET",
                headers: headers,
                credentials: 'include'
            }).then((response) => response.json())
                .then((data) => {
                    const tmp: Notification[] = []

                    if(data) {
                        data.forEach((n: Notification) => {
                            n.created_at = new Date(n.created_at)
                            tmp.push(n)
                        })
                    }

                    setNotifications(tmp)
                })
                .catch((err) => {
                    console.log("cannot retrieve Notifications for client: ", err)
                })

        } else if (userRole === 'specialist' && user) {
            fetch(`/specialist/notifications/${JSON.parse(user!).id}`, {
                method: "GET",
                headers: headers,
                credentials: 'include'
            }).then((response) => response.json())
                .then((data) => {
                    const tmp: Notification[] = []

                    if(data) {
                        data.forEach((n: Notification) => {
                            n.created_at = new Date(n.created_at)
                            tmp.push(n)
                        })
                    }

                    setNotifications(tmp)
                })
                .catch((err) => {
                    console.log("cannot retrieve Notifications for specialist: ", err)
                })
        }
    }

    useEffect(() => {
        notifications?.forEach((n: Notification) => {
            if(!n.read) {
                setUnread(true)
            }
        })
    }, [notifications]);

    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setIsMenuOpen(false);
        }

        if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
            setIsNotificationsOpen(false)
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    function navigateToClientVisit(id: number) {
        const headers = new Headers()
        headers.append("Content-Type", "application/json")
        headers.append("Authorization", "Bearer " + jwtToken)
        const method = "PATCH"

        fetch(`/client/notifications/update/${id}`, {
            method: method,
            headers: headers,
            credentials: 'include'
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.log("ERRORS")
                } else {
                    console.log("SUCCESSFULLY UPDATED NOTIFICATIONS")
                    getNotifications()
                }
            })
            .catch((err) => {
                console.log(err)
            })

        navigate('/klient/rezerwacje', { state: { visitId: id }});
    }

    function navigateToSpecialistVisit(id: number) {
        const headers = new Headers()
        headers.append("Content-Type", "application/json")
        headers.append("Authorization", "Bearer " + jwtToken)
        const method = "PATCH"

        fetch(`/specialist/notifications/update/${id}`, {
            method: method,
            headers: headers,
            credentials: 'include'
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.log("ERRORS")
                } else {
                    console.log("SUCCESSFULLY UPDATED NOTIFICATIONS")
                    getNotifications()
                }
            })
            .catch((err) => {
                console.log(err)
            })

        navigate('/specjalista/rezerwacje', { state: { visitId: id }});
    }

    return (
        <>
            <div
                className="flex flex-row sticky top-0 h-20 justify-center items-center bg-amber-900 text-white text-2xl font-medium z-40">

                {/* Logo */}
                <Link to="/"
                      className="flex w-24 ml-10 justify-center items-center hover:cursor-pointer transition-all hover:tracking-widest duration-300">
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

                {/* NOTIFICATIONS*/}
                {jwtToken && userRole === 'client' && notifications &&
                    <div className={`flex h-full justify-center items-center text-center`}
                         ref={notificationsRef}>
                        <div className="w-16" id="notifications">
                            <div className="h-18 flex flex-row h-full justify-center items-center hover:cursor-pointer"
                                 onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                 onMouseEnter={() => setFill(true)}
                                 onMouseLeave={() => setFill(false)}
                            >
                                <div className="w-7">
                                    <svg data-slot="icon" fill={fill || isNotificationsOpen ? "white" : "none"}
                                         stroke-width="1.5"
                                         stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                                         aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                              d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"></path>
                                    </svg>
                                </div>
                                {notifications.find(n => !n.read) &&
                                    <>
                                        <span className="relative flex h-3 w-3 mb-8">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                                        </span>
                                    </>
                                }
                            </div>
                        </div>

                        <div
                            className={`absolute w-[450px] top-20 right-[20px] flex flex-col items-center bg-amber-900 rounded-b-2xl  border-x-4 border-amber-950 shadow-lg transition-max-height duration-300 ease-out overflow-hidden ${isNotificationsOpen ? 'border-b-4 max-h-[600px]' : 'max-h-0'}`}>
                            {notifications && notifications?.length === 0 ?
                                <div>
                                    <p className="my-5">Brak powiadomień</p>
                                </div>
                                :
                                <div className="w-full overflow-auto">
                                    {
                                        notifications!.map((n) => {
                                            return (
                                                <div onClick={e => {
                                                          setIsNotificationsOpen(false)
                                                          navigateToClientVisit(n.visit.id)
                                                      }}
                                                    className={`w-full flex flex-row items-center drop-shadow-lg bg-amber-900 my-1 p-2 ${n.read ? 'font-normal' : 'font-bold'} hover:cursor-pointer `}>
                                                    {!n.read &&
                                                        <div className="w-10 flex items-center justify-center">
                                                            <div className="w-3 h-3 bg-red-600 rounded-3xl"></div>
                                                        </div>
                                                    }
                                                    <div className={`flex flex-col w-full text-left text-xl mr-5 ${n.read ? 'ml-12' : 'ml-2'}`}>
                                                        {n.type === 'declined' &&
                                                            <p>{n.specialist.name} {n.specialist.second_name} ({n.specialist.specialization}) odrzucił realizację usługi "{n.visit.service}"</p>
                                                        }
                                                        {n.type === 'accepted' &&
                                                            <p>{n.specialist.name} {n.specialist.second_name} ({n.specialist.specialization}) zaakceptował realizację usługi "{n.visit.service}"</p>
                                                        }
                                                        {n.type === 'modified' &&
                                                            <p>{n.specialist.name} {n.specialist.second_name} ({n.specialist.specialization}) zmodyfikował rezerwację usługi "{n.visit.service}"</p>
                                                        }
                                                        {n.type === 'modified_price' &&
                                                            <p>{n.specialist.name} {n.specialist.second_name} ({n.specialist.specialization}) zmodyfikował cenę usługi "{n.visit.service}"</p>
                                                        }
                                                        {n.type === 'modified_date' &&
                                                            <p>{n.specialist.name} {n.specialist.second_name} ({n.specialist.specialization}) zmodyfikował datę realizacji usługi "{n.visit.service}"</p>
                                                        }
                                                        <p className="text-left text-base font-light text-white mt-2">
                                                            {n.created_at.getHours().toString()[0] === '0' ? '0' : '' }{n.created_at.getHours()}:{n.created_at.getMinutes().toString().length === 1 ? '0' : ''}{n.created_at.getMinutes()} {n.created_at.toLocaleDateString()}
                                                        </p>
                                                    </div>

                                                </div>
                                            )
                                        })}
                                </div>
                            }
                        </div>
                    </div>
                }

                {jwtToken && userRole === 'specialist' && notifications &&
                    <div className={`flex h-full justify-center items-center text-center`}
                         ref={notificationsRef}>
                        <div className="w-16" id="notifications">
                            <div className="h-18 flex flex-row h-full justify-center items-center hover:cursor-pointer"
                                 onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                 onMouseEnter={() => setFill(true)}
                                 onMouseLeave={() => setFill(false)}
                            >
                                <div className="w-7">
                                    <svg data-slot="icon" fill={fill || isNotificationsOpen ? "white" : "none"}
                                         stroke-width="1.5"
                                         stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                                         aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                              d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"></path>
                                    </svg>
                                </div>
                                {notifications.find(n => !n.read) &&
                                    <>
                                        <span className="relative flex h-3 w-3 mb-8">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                                        </span>
                                    </>
                                }
                            </div>
                        </div>

                        <div
                            className={`absolute w-[450px] top-20 right-[20px] flex flex-col items-center bg-amber-900 rounded-b-2xl  border-x-4 border-amber-950 shadow-lg transition-max-height duration-300 ease-out overflow-hidden ${isNotificationsOpen ? 'border-b-4 max-h-[600px]' : 'max-h-0'}`}>
                            {notifications && notifications?.length === 0 ?
                                <div>
                                    <p className="my-5">Brak powiadomień</p>
                                </div>
                                :
                                <div className="w-full overflow-auto">
                                    {
                                        notifications!.map((n) => {
                                            return (
                                                <div onClick={e => {
                                                    setIsNotificationsOpen(false)
                                                    navigateToSpecialistVisit(n.visit.id)
                                                }}
                                                     className={`w-full flex flex-row items-center drop-shadow-lg bg-amber-900 my-1 p-2 ${n.read ? 'font-normal' : 'font-bold'} hover:cursor-pointer `}>
                                                    {!n.read &&
                                                        <div className="w-10 flex items-center justify-center">
                                                            <div className="w-3 h-3 bg-red-600 rounded-3xl"></div>
                                                        </div>
                                                    }
                                                    <div className={`flex flex-col w-full text-left text-xl mr-5 ${n.read ? 'ml-12' : 'ml-2'}`}>
                                                        {n.type === 'created' &&
                                                            <p>{n.client.name} {n.client.second_name[0]}. utworzył nową rezerwację usługi "{n.visit.service}"</p>
                                                        }
                                                        {n.type === 'declined' &&
                                                            <p>{n.client.name} {n.client.second_name[0]}. odrzucił realizację usługi "{n.visit.service}"</p>
                                                        }
                                                        {n.type === 'accepted' &&
                                                            <p>{n.client.name} {n.client.second_name[0]}. zaakceptował realizację usługi "{n.visit.service}"</p>
                                                        }
                                                        {n.type === 'modified' &&
                                                            <p>{n.client.name} {n.client.second_name[0]}. zmodyfikował realizację usługi "{n.visit.service}"</p>
                                                        }
                                                        {n.type === 'modified_address' &&
                                                            <p>{n.client.name} {n.client.second_name[0]}. zmodyfikował adres zarezerwowanej usługi "{n.visit.service}"</p>
                                                        }
                                                        {n.type === 'modified_date' &&
                                                            <p>{n.client.name} {n.client.second_name[0]}. zmodyfikował datę realizacji usługi "{n.visit.service}"</p>
                                                        }
                                                        {n.type === 'modified_description' &&
                                                            <p>{n.client.name} {n.client.second_name[0]}. zmodyfikował opis zarezerwowanej usługi "{n.visit.service}"</p>
                                                        }
                                                        <p className="text-left text-base font-light text-white mt-2">
                                                            {n.created_at.getHours()}:{n.created_at.getMinutes().toString().length === 1 ? '0' : ''}{n.created_at.getMinutes()} {n.created_at.toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                </div>
                            }
                        </div>
                    </div>
                }

                {/* CLIENT MENU */}
                {jwtToken !== "" && userRole === "client" &&
                    <div
                        className={`flex w-52 h-full justify-center items-center text-center ${isMenuOpen ? 'border-t-4 rounded-t-2xl border-x-4 border-amber-950' : ''}`}
                        ref={menuRef}>
                        <div id="menu"
                             className="flex items-center justify-center mx-5 top-0 right-2 text-white rounded cursor-pointer p-2 transition ease-in-out delay-0 bg-amber-900 hover:bg-white hover:text-amber-900 duration-300 ..."
                             onClick={e => setIsMenuOpen(!isMenuOpen)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                 stroke="currentColor" className="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                            </svg>
                            <p className="ml-2">{name ? name : "Konto"}</p>
                        </div>
                        <div
                            className={`absolute w-52 top-20 flex flex-col items-center bg-amber-900 rounded-b-2xl border-x-4 border-amber-950 shadow-lg transition-max-height duration-300 ease-out overflow-hidden ${isMenuOpen ? 'border-b-4 max-h-[600px]' : 'max-h-0'}`}>
                            <div className="bg-white rounded-md h-1 mb-6 w-2/3"></div>

                            <div className="flex flex-col items-center justify-items-center">
                                <Link to="/klient/rezerwacje" onClick={e => setIsMenuOpen(false)}
                                      className="flex items-center justify-center p-6 drop-shadow-lg hover:bg-amber-800 w-full">
                                    <p className="drop-shadow-lg mr-2 ">moje rezerwacje</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         stroke-width="1.5" stroke="currentColor" className="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"/>
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
                    <div
                        className={`flex w-52 h-full justify-center items-center text-center ${isMenuOpen ? 'border-t-4 rounded-t-2xl border-x-4 border-amber-950' : ''}`}
                        ref={menuRef}>
                        <div id="menu"
                             className="flex items-center justify-center mx-5 top-0 right-2 text-white rounded cursor-pointer p-2 transition ease-in-out delay-0 bg-amber-900 hover:bg-white hover:text-amber-900 duration-300 ..."
                             onClick={e => setIsMenuOpen(!isMenuOpen)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                 stroke="currentColor" className="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                            </svg>
                            <p className="ml-2">{name ? name : "Konto"}</p>
                        </div>
                        <div
                            className={`absolute w-52 top-20 flex flex-col items-center bg-amber-900  border-x-4 rounded-b-2xl border-amber-950 shadow-lg transition-max-height duration-300 ease-out overflow-hidden ${isMenuOpen ? 'border-b-4 max-h-[600px]' : 'max-h-0'}`}>
                            <div className="bg-white rounded-md h-1 mb-6 w-2/3"></div>

                            <div className="flex flex-col items-center justify-items-center">
                                <Link to="/specjalista/rezerwacje" onClick={e => setIsMenuOpen(false)}
                                      className="flex items-center justify-center p-6 drop-shadow-lg hover:bg-amber-800 w-full">
                                    <p className="drop-shadow-lg mr-2 ">moje rezerwacje</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         stroke-width="1.5" stroke="currentColor" className="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"/>
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
                <Outlet
                    context={{
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
