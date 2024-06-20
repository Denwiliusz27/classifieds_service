import React, {useEffect, useState} from "react";
import {Link, useLocation, useNavigate, useOutletContext} from "react-router-dom";
import {AuthContextType} from "../App";
import {Service, Specialization} from "../models/Specialization";
import {City} from "../models/City";
import Select from "../components/form/Select";
import ZoomingImageDiv from "../components/ZoomingImageDiv";
import {Specialist} from "../models/Specialist";

function SearchSpecialistsDetails() {
    const [specializations, setSpecializations] = useState<Specialization[]>([])
    const [services, setSetvices] = useState<Service[]>([])
    const [cities, setCities] = useState<City[]>([])
    const [city, setCity] = useState(0)
    const [specialization, setSpecialization] = useState(0)
    const [specialists, setSpecialists] = useState<Specialist[]>([])

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

        setSpecialization(location.state.specializationId)


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
        setCity(parseInt(event.currentTarget.value))
    }

    const handleSpecializationChange = (event: React.FormEvent<HTMLSelectElement>) => {
        setSpecialization(parseInt(event.currentTarget.value))
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        console.log("SEARCH")
    }

    return (
        <div className="flex flex-col items-center m-4">
            <div className="w-2/3">
                <div className="flex flex-col text-center pt-8">
                    <div className="flex flex-row text-3xl font-bold mb-6 justify-center">
                        <h1>Wybierz <span className="text-amber-800 italic">specjalizację</span>,
                            <span className="text-amber-800 italic"> miasto</span> oraz <span className="text-amber-800 italic"> usługę</span>.</h1>
                    </div>
                    <p className="text-xl text-gray-500">Skorzystaj z filtrów i wyszukaj specjalistów zgodnie z podanymi kryteriami.</p>
                </div>

                <div className="bg-amber-900 rounded-md h-1 my-6"></div>

                <div className="flex flex-col">
                    {/* FILTERS */}
                    <form className="flex flex-row justify-center items-center gap-2" onSubmit={handleSubmit}>
                        <div className="w-1/3">
                            <Select<City>
                                labelName="Miasto"
                                name="city"
                                placeholder="Nazwa miasta"
                                onChange={handleCityChange}
                                value={city}
                                options={cities}
                            />
                        </div>

                        <div className="w-1/3">
                            <Select<City>
                                labelName="Specjalizacja"
                                name="specialization"
                                placeholder="Nazwa specjalizacji"
                                onChange={handleSpecializationChange}
                                value={specialization}
                                options={specializations}
                            />
                        </div>

                        <input
                            type="submit"
                            value="Szukaj"
                            className="flex flex-row justify-center cursor-pointer drop-shadow-xl bg-amber-900 text-white rounded-2xl w-40 h-14 text-xl font-bold  shadow-2xl transition-transform hover:-translate-y-2 duration-300"
                        />
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SearchSpecialistsDetails;