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

                    <div className="flex flex-row">
                        <div className="flex flex-col w-1/2">
                            {/* profile info*/}
                            <div className="flex flex-row w-full bg-white drop-shadow-lg p-6 my-4 rounded-2xl text-2xl">
                                <div className="flex flex-col items-center w-2/3">
                                    <p className="font-bold">{specialist?.specialist.name} {specialist?.specialist.second_name}</p>

                                    <div className="">
                                        <div className="flex flex-row py-2 items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
                                            </svg>
                                            <p className="pl-3">{specialist?.specialist.specialization}</p>
                                        </div>

                                        <div className="flex flex-row items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                            </svg>
                                            <p className="pl-3">{specialist?.specialist.city}</p>
                                        </div>

                                        {/*<div className="flex flex-row py-2 items-center">*/}
                                        {/*    <svg xmlns="http://www.w3.org/2000/svg" fill="yellow" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">*/}
                                        {/*        <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />*/}
                                        {/*    </svg>*/}
                                        {/*    <p className="pl-3 text-lg text-gray-600">{specialist?.specialist.rating} ({s.reviews})</p>*/}
                                        {/*</div>*/}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col w-full bg-white drop-shadow-lg p-6 my-4 rounded-2xl text-2xl">
                                <p>Oferowane usługi</p>

                                <div className="flex flex-col">
                                    {specialist?.services !== null && specialist?.services.map((s) => {
                                        return(
                                            <div>
                                                <p>{s.name}</p>
                                            </div>
                                        )
                                    })}
                                </div>

                            </div>

                            {/* opinions */}
                            <div className="flex flex-col w-full bg-white drop-shadow-lg p-6 my-4 rounded-2xl text-2xl">
                                <p>Opinie</p>

                                <div className="flex flex-col">
                                    {specialist?.reviews !== null && specialist?.reviews.map((r) => {
                                        return(
                                            <div>
                                                <p>{r.description}</p>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* calendar */}
                        <div className="w-1/2 ml-8 flex flex-col bg-white drop-shadow-lg p-6 my-4 rounded-2xl text-2xl">
                            <p>Kalendarz</p>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}

export default SpecialistProfile