import React, {useEffect} from "react";
import Arrow from "../../components/Arrow";
import HomepageOptionElement from "../../components/HomepageOptionElement";
import {useNavigate, useOutletContext} from "react-router-dom";
import {AuthContextType} from "../../App";

function ClientHome() {
    const {jwtToken, userRole} = useOutletContext<AuthContextType>();
    const navigate = useNavigate()

    useEffect(() => {
        if (jwtToken !== "") {
            if (userRole === "specialist") {
                navigate("/specjalista/strona_glowna")
                return
            }
        }
    }, [jwtToken, userRole, navigate])

    return (
        <div className="flex flex-col items-center m-4">
            <div className="w-2/3">

                {/* Header with general info */}
                <div className="flex flex-col text-center pt-8">
                    <div className="flex flex-row text-3xl font-bold mb-6 justify-center">
                        <h1 className="mx-2">Nasi specjaliści wyciągną do ciebie
                            <span className="text-amber-900"> pomocną dłoń </span>!</h1>
                    </div>
                    <p className="text-xl text-gray-500">Działamy na rynku już od 5 lat. Nasze grono specjalistów
                        pomogło już niejednej
                        osobie, może ty będziesz następny?</p>
                </div>

                <div className="bg-amber-900 rounded-md h-1 my-6"></div>

                <div className="flex flex-col items-center">
                    <h1 className="font-bold text-2xl mb-8">Jak uzyskać pomoc?</h1>

                    {/* First option - searching for specialists */}
                    <div className="flex flex-row items-center  justify-center text-center text-gray-500 my-6">
                        <p className="text-amber-900 font-bold text-3xl">1.</p>

                        {/* First element with magnifier */}
                        <HomepageOptionElement
                            img="https://pl.fotoomnia.com/zdjecia/0af5daa5857ff82c673a6295654b777e.jpg"
                            alt="lupa"
                            text="Korzystając z wyszukiwarki wybierz lokalizację i interesującą cię usługę"
                        />

                        {/* Arrow */}
                        <Arrow/>

                        {/* Second element with people */}
                        <HomepageOptionElement
                            img="https://icon-library.com/images/icon-group-people/icon-group-people-23.jpg"
                            alt="people"
                            text="Z list specjalistów wybierz tego, który spełnia twoje wymagania"
                        />

                        {/* Arrow */}
                        <Arrow/>

                        {/* Third element with calendar */}
                        <HomepageOptionElement
                            img="https://logowik.com/content/uploads/images/calendar5662.jpg"
                            alt="calendar"
                            text="Wybierz usługę oraz dogodny dla siebie termin i zarezerwuj wizytę"
                        />
                    </div>

                    {/* Second option - creating offer */}
                    <div className="flex flex-row items-center  justify-center text-center text-gray-500 my-6">
                        <p className="text-amber-900 font-bold text-3xl">2.</p>

                        {/* First element with document */}
                        <HomepageOptionElement
                            img="https://icon-library.com/images/create-document-icon/create-document-icon-22.jpg"
                            alt="doc"
                            text="Utwórz nową ofertę, dodaj opis i szczegóły"
                        />

                        {/* Arrow */}
                        <Arrow/>

                        {/* Second element with auction */}
                        <HomepageOptionElement
                            img="https://icon-library.com/images/hammer-icon-png/hammer-icon-png-5.jpg"
                            alt="action"
                            text="Zainteresowani specjaliści wyślą ci swoją ofertę z proponowaną ceną i terminem
                                realizacji"
                            // h={32}
                        />

                        {/* Arrow */}
                        <Arrow/>

                        {/* Third element with handshake */}
                        <HomepageOptionElement
                            img="https://icon-library.com/images/handshake-icon/handshake-icon-3.jpg"
                            alt="handshake"
                            text="Wybierz najlepszą ofertę i zarezerwuj usługę"
                            h={32}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ClientHome;