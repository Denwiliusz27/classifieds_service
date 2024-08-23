import React, {useEffect} from "react";
import Arrow from "../../components/Arrow";
import HomepageOptionElement from "../../components/HomepageOptionElement";
import {useNavigate, useOutletContext} from "react-router-dom";
import {AuthContextType} from "../../App";

function SpecialistHome() {
    const {jwtToken, userRole} = useOutletContext<AuthContextType>();

    const navigate = useNavigate()

    useEffect(() => {
        if (jwtToken === "" && userRole !== "specialist") {
            navigate("/wybor_konta")
            return
        }
    }, [jwtToken, userRole, navigate])

    return (
        <div className="flex flex-col items-center m-4">
            <div className="w-2/3">

                {/* Header with general info */}
                <div className="flex flex-col text-center pt-8">
                    <div className="flex flex-row text-3xl font-bold mb-6 justify-center">
                        <h1 className="mx-2">Z nami będziesz miał pełne
                            <span className="text-amber-900"> ręce</span> roboty!</h1>
                    </div>
                    <p className="text-xl text-gray-500">Działamy na rynku już od 5 lat. Nasze grono specjalistów
                        pomogło niejednej osobie, może ty będziesz jednym z nich?</p>
                </div>

                <div className="bg-amber-900 rounded-md h-1 my-6"></div>

                <div className="flex flex-col items-center my-20">
                    <h1 className="font-bold text-2xl mb-8">Jak zaoferować pomoc?</h1>

                    {/* First option - accept reservations */}
                    <div className="flex flex-row items-center  justify-center text-center text-gray-500 my-6">
                        {/* First element with magnifier */}
                        <HomepageOptionElement
                            img="https://logowik.com/content/uploads/images/calendar5662.jpg"
                            alt="calendar"
                            text="Edytuj kalendarz z terminami swojej dostępności"
                        />

                        {/* Arrow */}
                        <Arrow/>

                        {/* Second element answering to reservations */}
                        <HomepageOptionElement
                            img="https://icon-library.com/images/icon-form/icon-form-20.jpg"
                            alt="reservations"
                            text="Odpowiedz na rezerwacje wysłane przez klientów"
                        />

                        {/* Arrow */}
                        <Arrow/>

                        {/* Third element with calendar */}
                        <HomepageOptionElement
                            img="https://icon-library.com/images/handshake-icon/handshake-icon-3.jpg"
                            alt="handshake1"
                            text="Dogadaj szczegóły z klientem i zaakceptuj wykonanie usługi"
                            h={24}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SpecialistHome;