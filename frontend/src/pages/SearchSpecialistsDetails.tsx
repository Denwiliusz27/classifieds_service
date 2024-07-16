import React, {useEffect, useState} from "react";
import {Link, useLocation, useNavigate, useOutletContext} from "react-router-dom";
import {AuthContextType} from "../App";
import {Service, Specialization} from "../models/Specialization";
import {City} from "../models/City";
import Select from "../components/form/Select";
import {Specialist, SpecialistGeneralInfo} from "../models/Specialist";
import {TimeOff} from "../models/TimeOff";

function SearchSpecialistsDetails() {
    const [specializations, setSpecializations] = useState<Specialization[]>([])
    const [services, setSetvices] = useState<Service[]>([])
    const [cities, setCities] = useState<City[]>([])
    const [cityId, setCityId] = useState(0)
    const [specializationId, setSpecializationId] = useState(0)
    const [serviceId, setServiceId] = useState(0)
    const [specialists, setSpecialists] = useState<SpecialistGeneralInfo[]>([])

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

        setSpecializationId(location.state.specializationId)

        const headers = new Headers()
        headers.append("Content-Type", "application/json")
        const requestOptions = {
            method: "GET",
            headers: headers,
        }

        fetch(`http://localhost:8080/specialists/${location.state.specializationId}/${cityId}/${serviceId}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setSpecialists(data)
            })
            .catch(err => {
                console.log("Error retrieving Specialists: ", err)
            })

    }, [jwtToken, userRole, navigate, location.state.specializationId])

    useEffect(() => {
        const headers = new Headers()
        headers.append("Content-Type", "application/json")

        const requestOptions = {
            method: "GET",
            headers: headers
        }

        fetch(`http://localhost:8080/cities`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setCities(data)
            })
            .catch(err => {
                console.log("Error retrieving Cities: ", err)
            })

        fetch(`http://localhost:8080/specializations`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setSpecializations(data)
            })
            .catch(err => {
                console.log("Error retrieving Specializations: ", err)
            })

        fetch(`http://localhost:8080/services`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setSetvices(data)
            })
            .catch(err => {
                console.log("Error retrieving Services: ", err)
            })
    }, []);

    const handleCityChange = (event: React.FormEvent<HTMLSelectElement>) => {
        if (event.currentTarget.value === "") {
            setCityId(0)
        } else {
            setCityId(parseInt(event.currentTarget.value))
        }
    }

    const handleSpecializationChange = (event: React.FormEvent<HTMLSelectElement>) => {
        if (event.currentTarget.value === "") {
            setSpecializationId(0)
        } else {
            setSpecializationId(parseInt(event.currentTarget.value))
        }
    }

    const handleServiceChange = (event: React.FormEvent<HTMLSelectElement>) => {
        if (event.currentTarget.value === "") {
            setServiceId(0)
        } else {
            setServiceId(parseInt(event.currentTarget.value))
        }
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const headers = new Headers()
        headers.append("Content-Type", "application/json")
        const requestOptions = {
            method: "GET",
            headers: headers,
        }

        fetch(`http://localhost:8080/specialists/${specializationId}/${cityId}/${serviceId}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setSpecialists(data)
            })
            .catch(err => {
                console.log("Error retrieving Specialists: ", err)
            })
    }

    return (
        <div className="flex flex-col items-center overflow-auto h-full bg-fixed fixed w-full pb-10">
            <div className="w-2/3 ">
                <div className="flex flex-col text-center pt-8">
                    <div className="flex flex-row text-3xl font-bold mb-6 justify-center">
                        <h1>Wybierz <span className="text-amber-800 italic">specjalizację</span>,
                            <span className="text-amber-800 italic"> miasto</span> oraz <span className="text-amber-800 italic"> usługę</span>.</h1>
                    </div>
                    <p className="text-xl text-gray-500">Skorzystaj z filtrów i wyszukaj specjalistów zgodnie z podanymi kryteriami.</p>
                </div>

                <div className="bg-amber-900 rounded-md h-1 my-6"></div>

                <div className="flex flex-col pb-6">
                    {/* FILTERS */}
                    <form className="flex flex-row justify-center items-center gap-2" onSubmit={handleSubmit}>
                        <div className="w-1/3">
                            <Select<City>
                                labelName="Miasto"
                                name="city"
                                placeholder="Wszystkie"
                                onChange={handleCityChange}
                                value={cityId}
                                options={cities}
                            />
                        </div>

                        <div className="w-1/3">
                            <Select<Specialization>
                                labelName="Specjalizacja"
                                name="specialization"
                                placeholder="Wszystkie"
                                onChange={handleSpecializationChange}
                                value={specializationId}
                                options={specializations}
                                disable={false}
                            />
                        </div>

                        <div className="w-1/3">
                            <Select<Service>
                                labelName="Usługa"
                                name="service"
                                placeholder="Wszystkie"
                                onChange={handleServiceChange}
                                value={serviceId}
                                options={specializationId !== 0 ? services.filter(service => service.specialization_id === parseInt(String(specializationId))) : services}
                            />
                        </div>

                        <input
                            type="submit"
                            value="Szukaj"
                            className="flex flex-row justify-center cursor-pointer drop-shadow-xl bg-amber-900 text-white rounded-2xl w-40 h-14 text-xl font-bold  shadow-2xl transition-transform hover:-translate-y-2 duration-300"
                        />
                    </form>

                    <div className="flex flex-col items-center w-full pb-6">
                        {specialists !== null && specialists.map((s) => {
                            return (
                                <div className="flex flex-row w-2/3 bg-white drop-shadow-lg p-6 my-4 rounded-2xl text-2xl transition-transform hover:-translate-y-1 duration-300">
                                    <div className="flex flex-col items-center w-2/3">
                                        <p className="font-bold">{s.name} {s.second_name}</p>

                                        <div className="">
                                            <div className="flex flex-row py-2 items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
                                                </svg>
                                                <p className="pl-3">{s.specialization}</p>
                                            </div>

                                            <div className="flex flex-row items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                                </svg>
                                                <p className="pl-3">{s.city}</p>
                                            </div>

                                            <div className="flex flex-row py-2 items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="yellow" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                                </svg>
                                                <p className="pl-3 text-lg text-gray-600">{s.rating} ({s.reviews})</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col justify-center w-1/3">
                                        <Link to="/specjalista/szczegóły" state={{specialistId: s.id}} className="flex h-20 text-lg font-bold justify-items-center justify-center items-center border-2 border-white text-center text-white rounded-2xl cursor-pointer p-2 transition ease-in-out delay-0 bg-amber-900 hover:bg-white hover:text-amber-900 hover:border-amber-900 duration-300 ...">
                                            <span>odwiedź profil</span>
                                        </Link>
                                    </div>
                                </div>
                            )
                        })}

                        {specialists === null &&
                            <p className="text-xl">Brak specjalistów spełniających dane kryteria</p>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchSpecialistsDetails;