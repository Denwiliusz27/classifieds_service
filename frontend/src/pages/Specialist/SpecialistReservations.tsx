import {useNavigate, useOutletContext} from "react-router-dom";
import {AuthContextType} from "../../App";
import React, {useEffect} from "react";

function SpecialistReservations() {
    const {jwtToken, userRole} = useOutletContext<AuthContextType>();
    const navigate = useNavigate()

    useEffect(() => {
        if (jwtToken === "" && userRole !== "specialist") {
            navigate("/wybor_konta")
            return
        }
    }, [jwtToken, userRole, navigate])

    return(
        <div className="flex flex-col items-center overflow-auto h-full bg-fixed fixed w-full pb-32">
            <div className="w-2/3">
                <div className="flex flex-col text-center pt-8">
                    <div className="flex flex-row text-3xl font-bold mb-6 justify-center">
                        <h1>Kalendarz rezerwacji usług</h1>
                    </div>

                    <p className="mb-6 text-2xl">
                        Poniżej znajduje się kalendarz usług zarezerwowanych przez klientów. Wizyty potwierdzone,
                        oraz te oczekujące na akcje zaznaczone są określonym kolorem (patrz legenda poniżej). Aby potwierdzić,
                        zmodyfikować lub odrzucić daną rezerwację, kliknij w nią i wypełnij formularz wyświetlony na ekranie.
                    </p>

                    <div className="bg-amber-900 rounded-md h-1 mb-3"></div>
                </div>

                <div>



                </div>
            </div>
        </div>
    )
}

export default SpecialistReservations