import React, {useEffect, useState} from "react";
import {useLocation, useNavigate, useOutletContext} from "react-router-dom";
import {AuthContextType} from "../../App";
import {SpecialistExtendedInfo} from "../../models/Specialist";

function SpecialistProfile() {
    const [specialistId, setSpecialistId] = useState(0)
    const [specialist, setSpecialist] = useState<SpecialistExtendedInfo>()

    const location = useLocation()
    const {jwtToken, userRole} = useOutletContext<AuthContextType>();
    const navigate = useNavigate()

    useEffect(() => {
        if (jwtToken !== "") {
            if (userRole === "specialist") {
                navigate("/specjalista/strona_glowna")
                return
            }
        }

        setSpecialistId(location.state.specialistId)

        const headers = new Headers()
        headers.append("Content-Type", "application/json")
        const requestOptions = {
            method: "GET",
            headers: headers,
        }

        fetch(`http://localhost:8080/specialist/detailed_info/${location.state.specialistId}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setSpecialist(data)
            })
            .catch(err => {
                console.log("Error retrieving Specialist: ", err)
            })

        console.log(specialist)

    }, [jwtToken, location.state.specialistId, navigate, userRole])


    return(
        <div className="flex flex-col items-center overflow-auto h-full bg-fixed fixed w-full pb-10">
            <div className="w-2/3 ">
                <div className="flex flex-col text-center pt-8">
                    <div className="flex flex-row text-3xl font-bold mb-6 justify-center">
                        <h1>Szczegóły profilu</h1>
                    </div>

                    <div></div>

                </div>
            </div>
        </div>
    )
}

export default SpecialistProfile