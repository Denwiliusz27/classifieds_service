import React from "react";

function UserHomePage() {
    return(
        <div className="flex flex-col items-center m-4">
            <div className="w-2/3">
                <div className="flex flex-col text-center pt-8">
                    <div className="flex flex-row text-3xl font-bold mb-6 justify-center">
                        <h1 className="mx-2">Nasi specjaliści wyciągną do ciebie </h1>
                        <h1 className="text-amber-900">pomocną dłoń</h1>
                        <h1 >!</h1>
                    </div>
                    <p className="text-xl text-gray-500">Działamy na rynku już od 5 lat. Nasze grono specjalistów pomogło już niejednej
                        osobie, może ty będziesz następny?</p>
                </div>

                <div className="bg-amber-900 rounded-md h-1 my-6"></div>

                <div className="flex flex-col items-center">
                    <h1 className="font-bold text-2xl mb-8">Jak uzyskać pomoc?</h1>

                    <div className="flex flex-row items-center text-center text-gray-500">
                        <p className="text-amber-900 font-bold text-3xl">1.</p>

                        <div className="flex flex-col items-center w-1/5 mx-4">
                            <div className="w-24 h-24 mb-4">
                                <img src="https://pl.fotoomnia.com/zdjecia/0af5daa5857ff82c673a6295654b777e.jpg" alt="lupa"/>
                            </div>
                            <p>Korzystając z wyszukiwarki wybierz interesującą cię usługę </p>
                        </div>




                    </div>

                </div>



            </div>
        </div>
    )
}

export default UserHomePage;