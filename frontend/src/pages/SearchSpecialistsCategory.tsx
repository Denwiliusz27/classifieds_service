import React, {useEffect, useState} from "react";
import {useNavigate, useOutletContext} from "react-router-dom";
import {AuthContextType} from "../App";
import {Specialization} from "../models/Specialization";
import ZoomingImageDiv from "../components/ZoomingImageDiv";

function SearchSpecialistsCategory() {
    const [specializations, setSpecializations] = useState<Specialization[]>([])

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

    useEffect(() => {
        const headers = new Headers()
        headers.append("Content-Type", "application/json")

        const requestOptions = {
            method: "GET",
            headers: headers
        }

        fetch(`http://localhost:8080/specializations`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setSpecializations(data)
            })
            .catch(err => {
                console.log("Error retrieving Specializations: ", err)
            })
    }, []);

    return (
        <div className="flex flex-col items-center m-4">
            <div className="w-2/3">
                <div className="flex flex-col text-center pt-8">
                    <div className="flex flex-row text-3xl font-bold mb-6 justify-center">
                        <h1> Wybierz <span className="text-amber-800 italic">specjalizację</span> i rozpocznij poszukiwania!</h1>
                    </div>
                    <p className="text-xl text-gray-500">Kliknij interesującą cię specjalizację aby wyświetlić listę specjalistów.</p>
                </div>

                <div className="bg-amber-900 rounded-md h-1 my-6"></div>

                <div className="flex flex-col py-6">
                    <div className="grid grid-cols-3 gap-3 justify-items-center">
                        {specializations.map((s) => {
                            return (
                                <div className="w-56 h-56">
                                    <ZoomingImageDiv
                                        key={s.id}
                                        path={"/wyszukaj/szczegóły"}
                                        img={s.img}
                                        text={s.name}
                                        txt_size={"3xl"}
                                        state={s.id}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchSpecialistsCategory;