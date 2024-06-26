import {Link, Outlet, useNavigate, useOutletContext} from "react-router-dom";
import React, {useEffect} from "react";
import {AuthContextType} from "../App";
import ZoomingImageDiv from "../components/ZoomingImageDiv";

function LoginRegister() {
    const { jwtToken, userRole, setJwtToken } = useOutletContext<AuthContextType>();

    const navigate = useNavigate()

    useEffect(() => {
        if (jwtToken !== "") {
            if (userRole === "specialist") {
                navigate("/specjalista/strona_glowna")
                return
            } else if (userRole === "client") {
                navigate("/")
                return
            }
        }
    }, [jwtToken, userRole, navigate])

    return (
        <div
            className="overflow-hidden bg-cover bg-no-repeat text-center flex flex-col "
            style={{
                backgroundImage: `url(https://www.dfdhouseplans.com/blog/wp-content/uploads/2022/11/Blueprint-1024x678.jpg)`,
                height: '91vh',
            }}>
            <div
                className="flex flex-col  items-center left-0 right-0 top-0 w-full overflow-hidden h-full bg-fixed"
                style={{backgroundColor: `rgba(255, 255, 255, 0.7)`}}>

                {/* Login elements*/}
                <div className="flex flex-col items-center m-4 pt-8 w-2/3">
                    <h1 className="text-3xl font-bold">Zaloguj się jako</h1>

                    <div className="flex flex-row my-10 space-x-10 ">
                        {/* Login for client*/}
                        <div className="w-80 h-80">
                            <ZoomingImageDiv
                                path={"/klient/login"}
                                img={"https://i0.wp.com/gamjobs.com/wp-content/uploads/2023/06/139328-using-girl-laptop-png-file-hd.png?resize=259%2C300&ssl=1"}
                                text={"Klient"}
                                txt_size={"5xl"}
                            />
                        </div>

                        {/* Login for specialist*/}
                        <div className="w-80 h-80">
                            <ZoomingImageDiv
                                path={"/specjalista/login"}
                                img={"https://spower.com.sg/wp-content/uploads/2022/03/industrail-workers-and-engineers-transparent-33121-optimized.png"}
                                text={"Specjalista"}
                                txt_size={"5xl"}
                            />
                        </div>
                    </div>
                </div>

                {/* Register buttons */}
                <div className="flex flex-col items-center m-0 pt-8 w-2/3  ">
                    <h1 className="text-3xl font-bold">Nie masz jeszcze konta? Zarejestruj się!</h1>

                    <div className="flex flex-row my-10 space-x-10 ">
                        {/* Register for client */}
                        <Link to="/klient/rejestracja"
                            className="flex flex-row items-center justify-center bg-amber-900 text-white rounded-2xl w-80 h-20 text-xl font-bold overflow-hidden shadow-2xl transition-transform hover:-translate-y-2 duration-300">
                            <div className="flex flex-row items-center w-full justify-center">
                                <div className="w-1/4 flex flex-row items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         stroke-width="1.5" stroke="currentColor" className="w-10 h-10 mx-4">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/>
                                    </svg>
                                </div>

                                <p className="w-3/4 text-2xl drop-shadow-xl">Jako klient</p>
                            </div>
                        </Link>

                        {/* Register for specialist */}
                        <Link to="/specjalista/rejestracja"
                            className="flex flex-row items-center justify-center bg-amber-900 text-white rounded-2xl w-80 h-20 text-xl font-bold overflow-hidden shadow-2xl transition-transform hover:-translate-y-2 duration-300">
                            <div className="flex flex-row items-center w-full justify-center">
                                <div className="w-1/4 flex flex-row items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         stroke-width="1.5" stroke="currentColor" className="w-10 h-10">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                              d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z"/>
                                    </svg>

                                </div>

                                <p className="w-3/4 text-2xl drop-shadow-xl">Jako specjalista</p>
                            </div>
                        </Link>
                    </div>

                </div>
            </div>

            <div>
                <Outlet context={{
                    jwtToken, setJwtToken,
                }}/>
            </div>
        </div>

    )
}

export default LoginRegister;