import React from "react";
import Arrow from "../components/Arrow";
import HomepageOptionElement from "../components/HomepageOptionElement";

function SpecialistHome() {
    return (
        <div className="flex flex-col items-center m-4">
            <div className="w-2/3">

                {/* Header with general info */}
                <div className="flex flex-col text-center pt-8">
                    <div className="flex flex-row text-3xl font-bold mb-6 justify-center">
                        <h1 className="mx-2">Z nami będziesz miał pełne </h1>
                        <h1 className="text-amber-900">ręce</h1>
                        <h1 className="ml-2">roboty!</h1>
                    </div>
                    <p className="text-xl text-gray-500">Działamy na rynku już od 5 lat. Nasze grono specjalistów
                        pomogło niejednej osobie, może ty będziesz jednym z nich?</p>
                </div>

                <div className="bg-amber-900 rounded-md h-1 my-6"></div>

                <div className="flex flex-col items-center">
                    <h1 className="font-bold text-2xl mb-8">Jak zaoferować pomoc?</h1>

                    {/* First option - accept reservations */}
                    <div className="flex flex-row items-center  justify-center text-center text-gray-500 my-6">
                        <p className="text-amber-900 font-bold text-3xl">1.</p>

                        {/* First element with magnifier */}
                        <HomepageOptionElement
                            img="https://logowik.com/content/uploads/images/calendar5662.jpg"
                            alt="calendar"
                            text="Edytuj kalendarz z terminami swojej dostępności"
                            w={36}
                        />

                        {/* Arrow */}
                        <Arrow/>

                        {/* Second element answering to reservations */}
                        <HomepageOptionElement
                            img="https://icon-library.com/images/icon-form/icon-form-20.jpg"
                            alt="reservations"
                            text="Odpowiedz na rezerwacje wysłane przez klientów"
                            w={28}
                            h={24}
                        />

                        {/* Arrow */}
                        <Arrow/>

                        {/* Third element with calendar */}
                        <HomepageOptionElement
                            img="https://icon-library.com/images/handshake-icon/handshake-icon-3.jpg"
                            alt="handshake1"
                            text="Dogadaj szczegóły z klientem i zaakceptuj wykonanie usługi"
                            w={32}
                            h={24}
                        />
                    </div>

                    {/* Second option - creating offer */}
                    <div className="flex flex-row items-center  justify-center text-center text-gray-500 my-6">
                        <p className="text-amber-900 font-bold text-3xl">2.</p>

                        {/* First element with searching offers */}
                        <HomepageOptionElement
                            img="https://icon-library.com/images/free-icon-list/free-icon-list-27.jpg"
                            alt="list"
                            text="Sprawdź listę dostępnych ofert utworzonych przez użytkowników"
                        />

                        {/* Arrow */}
                        <Arrow/>

                        {/* Second element with auction */}
                        <HomepageOptionElement
                            img="https://icon-library.com/images/hammer-icon-png/hammer-icon-png-5.jpg"
                            alt="action"
                            text="Złóż propozycję ceny i terminu wykonania usługi"
                            w={36}
                            h={32}
                        />

                        {/* Arrow */}
                        <Arrow/>

                        {/* Third element with handshake */}
                        <HomepageOptionElement
                            img="https://icon-library.com/images/handshake-icon/handshake-icon-3.jpg"
                            alt="handshake"
                            text="Dogadaj szczegóły z klientem"
                            w={32}
                            h={24}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SpecialistHome;