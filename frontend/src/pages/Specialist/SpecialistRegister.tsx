import React, {useEffect, useState} from "react";
import Input from "../../components/form/Input";
import Select from "../../components/form/Select";
import {City} from "../../models/City";
import Swal from "sweetalert2";
import 'react-international-phone/style.css';
import {Service, Specialization} from "../../models/Specialization";
import {createPortal} from "react-dom";
import {Link, useNavigate, useOutletContext} from "react-router-dom";
import {SpecialistRequest, SpecialistServiceRequest} from "../../models/SpecialistRequest";
import {AuthContextType} from "../../App";


function SpecialistRegister() {
    const [specialist, setSpecialist] = useState<SpecialistRequest>({
        name: "",
        second_name: "",
        email: "",
        password: "",
        city_id: 0,
        phone_nr: "",
        specialization_id: 0,
        services: [],
        description: "",
    })

    const [errors, setErrors] = useState({
        name: "",
        second_name: "",
        email: "",
        password: "",
        city_id: "",
        phone_nr: "",
        specialization_id: "",
        services: "",
        description: "",
    })

    const [cities, setCities] = useState<City[]>([])
    const [specializations, setSpecializations] = useState<Specialization[]>([])
    const [services, setSetvices] = useState<Service[]>([])

    const [showErrorMsg, setShowErrorMsg] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")
    const [showSuccessMsg, setShowSuccessMsg] = useState(false)

    const {jwtToken, userRole} = useOutletContext<AuthContextType>();
    const navigate = useNavigate()

    useEffect(() => {
        if (jwtToken !== "") {
            if (userRole === "specialist") {
                navigate("/specjalista/strona_glowna")
                return
            } else if (userRole === "client") {
                navigate("/")
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
    }, [])

    const clearErrors = (name: string) => {
        setErrors({
            ...errors,
            [name]: ""
        })
    }

    const handleSpecialistChange = () => (event: React.FormEvent<HTMLInputElement>) => {
        let value = event.currentTarget.value
        let name = event.currentTarget.name

        setSpecialist({
            ...specialist,
            [name]: value,
        })

        clearErrors(name)
    }

    const handleSelectChange = (event: React.FormEvent<HTMLSelectElement>) => {
        let name = event.currentTarget.name

        if (name === "specialization_id" || name === "city_id") {
            setSpecialist({
                ...specialist,
                [name]: parseInt(event.currentTarget.value),
                services: [],
            })
        } else {
            setSpecialist({
                ...specialist,
                [name]: event.currentTarget.value,
            })
        }

        clearErrors(name)
    }

    const handleServiceChange = (event: React.ChangeEvent<HTMLInputElement>, serviceId: number) => {
        if (event.target.checked) {
            const newService: SpecialistServiceRequest = {service_id: serviceId, min_price: 0, max_price: 0}

            setSpecialist({
                ...specialist,
                services: [...specialist.services, newService]
            })
        } else {
            setSpecialist({
                ...specialist,
                services: specialist.services.filter(service => service.service_id !== serviceId)
            })
        }

        clearErrors("services")
    };

    const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>, serviceId: number, priceType: 'min' | 'max') => {
        const updatedServices = specialist.services.map(service => {
            if (service.service_id === serviceId) {
                return {
                    ...service,
                    [priceType === 'min' ? 'min_price' : 'max_price']: parseInt(event.target.value, 10)
                };
            }
            return service;
        });

        setSpecialist({
            ...specialist,
            services: updatedServices
        });

        clearErrors("services")
    };

    function checkForm() {
        const nameRegex = new RegExp('^[A-Za-ząĄćĆęĘłŁńŃóÓśŚźŹżŻ-]+$');
        const phoneRegex = new RegExp('^([0-9]{9})$');
        let nameError = ""
        let surnameError = ""
        let emailError = ""
        let passwordError = ""
        let cityError = ""
        let phoneError = ""
        let specializationError = ""
        let servicesError = ""
        let descriptionError = ""

        // name
        if (specialist.name.length === 0) {
            nameError = "Wprowadź swoje imie"
        } else if (!nameRegex.test(specialist.name)) {
            nameError = "Imie powinno składać się jedynie z liter"
        }

        // surname
        if (specialist.name.length === 0) {
            surnameError = "Wprowadź swoje nazwisko"
        } else if (!nameRegex.test(specialist.name)) {
            surnameError = "Nazwisko zawiera niewłaściwe znaki"
        }

        // email
        if (specialist.email.length === 0) {
            emailError = "Wprowadź adres email"
        }

        // password
        if (specialist.password.length === 0) {
            passwordError = "Wprowadź hasło do konta"
        }

        // city
        if (specialist.city_id === 0) {
            cityError = "Wybierz miasto z listy"
        }

        // phone
        if (specialist.phone_nr.length === 0) {
            phoneError = "Wprowadź numer telefonu"
        } else if (!phoneRegex.test(specialist.phone_nr)) {
            phoneError = "Podaj dokładnie 9 cyfr"
        }

        // specialization
        if (specialist.specialization_id === 0) {
            specializationError = "Wybierz specjalizację"
        }

        // services
        if (specialist.specialization_id !== 0) {
            if (specialist.services.length === 0) {
                servicesError = "Wybierz przynajmniej jedną usługę"
            } else {
                specialist.services.forEach(s => {
                    if (s.min_price === 0 || s.max_price === 0) {
                        servicesError = "Podaj cenę minimalną i maksymalną wybranych usług"
                    } else if (s.min_price < 0 || s.max_price < 0) {
                        servicesError = "Ceny powinny być liczbami dodatnimi"
                    } else if (s.min_price > s.max_price) {
                        servicesError = "Cena minimalna powinna być mniejsza od ceny maksymalnej"
                    }
                })
            }
        }

        // description
        if (specialist.description.length === 0) {
            descriptionError = "Wprowadź opis"
        }

        if (nameError === "" && surnameError === "" && emailError === "" && passwordError === "" && cityError === "" &&
            phoneError === "" && specializationError === "" && servicesError === "" && descriptionError === "") {
            let newName = specialist.name.toLowerCase()
            newName = newName.charAt(0).toUpperCase() + newName.slice(1)

            let newSurname = specialist.second_name.toLowerCase()
            newSurname = newSurname.charAt(0).toUpperCase() + newSurname.slice(1)

            setSpecialist({
                ...specialist,
                name: newName,
                second_name: newSurname,
                email: specialist.email.toLowerCase()
            });

            return true
        } else {
            setErrors({
                ...errors,
                name: nameError,
                second_name: surnameError,
                email: emailError,
                password: passwordError,
                city_id: cityError,
                phone_nr: phoneError,
                specialization_id: specializationError,
                services: servicesError,
                description: descriptionError
            })

            return false
        }
    }

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        let name = event.currentTarget.name

        setSpecialist({
            ...specialist,
            [name]: event.currentTarget.value,
        })

        clearErrors(name)
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (checkForm()) {
            const headers = new Headers()
            headers.append("Content-Type", "application/json")
            const method = "POST"
            let requestOptions = {
                body: JSON.stringify(specialist),
                method: method,
                headers: headers,
            }

            fetch(`/register_specialist`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    if (data.error) {
                        console.log("ERRORS")
                        setErrorMsg(data.message)

                        Swal.fire({
                            didOpen: () => setShowErrorMsg(true),
                            didClose: () => setShowErrorMsg(false),
                            showConfirmButton: false,
                        })
                    } else {
                        console.log("SUCCESSFULLY REGISTERED")
                        Swal.fire({
                            didOpen: () => setShowSuccessMsg(true),
                            didClose: () => setShowSuccessMsg(false),
                            showConfirmButton: false,
                        })
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        } else {
            console.log("ERRORS")
        }
    }

    return (
        <div
            className="overflow-hidden bg-no-repeat bg-contain text-center flex flex-col bg-left-top"
            style={{
                backgroundImage: `url(https://img.freepik.com/free-photo/portrait-smiling-worker-with-tools-planning-writing-note-isolated-white_186202-3014.jpg?t=st=1715252178~exp=1715255778~hmac=de15fa3b500c96cc5a0b600f8d13c890aad7ae6542b34526b60169167337cb04&w=740)`,
                height: '91.2vh',
                backgroundPositionX: '100px'
            }}>
            <div
                className="flex flex-col items-center left-0 right-0 top-0 w-full overflow-auto h-full bg-fixed"
                style={{backgroundColor: `rgba(255, 255, 255, 0.4)`}}>

                {/* Register elements*/}
                <div className="flex flex-col items-center my-4 py-8 w-[550px]">
                    <div className="w-96">
                        <h1 className="text-3xl font-bold">Załóż konto specjalisty</h1>

                        <div className="flex flex-col items-end w-full">
                            <div className="flex justify-self-end bg-amber-900 rounded-md h-1 mb-3 mx-10 w-32"></div>
                        </div>
                    </div>

                    <form className="flex flex-col items-center w-full my-8" onSubmit={handleSubmit}>
                        <Input
                            labelName="Imie*"
                            name="name"
                            onChange={handleSpecialistChange()}
                            placeholder="Imie"
                            type="text"
                            value={specialist.name}
                            error={errors["name"]}
                        />

                        <Input
                            labelName="Nazwisko*"
                            name="second_name"
                            onChange={handleSpecialistChange()}
                            placeholder="Nazwisko"
                            type="text"
                            value={specialist.second_name}
                            error={errors["second_name"]}
                        />

                        <Input
                            labelName="Email*"
                            name="email"
                            onChange={handleSpecialistChange()}
                            placeholder="Adres email"
                            type="email"
                            value={specialist.email}
                            error={errors["email"]}
                        />

                        <Input
                            labelName="Hasło*"
                            name="password"
                            onChange={handleSpecialistChange()}
                            placeholder="Hasło"
                            type="password"
                            value={specialist.password}
                            error={errors["password"]}
                        />

                        <div className="flex flex-row justify-items-center space-x-4">
                            <Select<City>
                                labelName="Miasto*"
                                name="city_id"
                                placeholder="Nazwa miasta"
                                onChange={handleSelectChange}
                                value={specialist.city_id}
                                options={cities}
                                error={errors["city_id"]}
                                disable={true}
                            />

                            <Input
                                labelName="Nr telefonu*"
                                name="phone_nr"
                                onChange={handleSpecialistChange()}
                                placeholder="Numer telefonu"
                                type="number"
                                value={specialist.phone_nr}
                                error={errors["phone_nr"]}
                            />
                        </div>

                        <Select<Specialization>
                            labelName="Specjalizacja*"
                            name="specialization_id"
                            placeholder="Nazwa specjalizacji"
                            onChange={handleSelectChange}
                            value={specialist.specialization_id}
                            options={specializations}
                            error={errors["specialization_id"]}
                            disable={true}
                        />

                        {specialist.specialization_id !== 0 &&
                            <div className="flex flex-col items-start mb-4 w-full">
                                <p className="font-bold text-2xl mx-6 mb-3">Usługi*</p>
                                <div
                                    className={`flex flex-col bg-white w-full drop-shadow-2xl border-2 ${errors.services ? 'border-red-500' : 'border-amber-900 mb-8'} focus:border-4 rounded-2xl text-2xl px-6 py-3`}>
                                    <div className="flex flex-row font-bold items-center">
                                        <p className="w-2/4">Usługa</p>
                                        <p className="w-1/4">Cena min</p>
                                        <p className="w-1/4">Cena max</p>
                                    </div>
                                    {services.filter(service => service.specialization_id === parseInt(String(specialist.specialization_id), 10))
                                        .map((service) => {
                                                const tempSpecialistService = specialist.services.find(s => s.service_id === service.id);

                                                return (
                                                    <div className="flex flex-row items-center my-3">
                                                        <div className="w-2/4 flex flex-row justify-evenly">
                                                            <input
                                                                type='checkbox'
                                                                name={service.name}
                                                                value={service.id}
                                                                checked={specialist.services.some(s => s.service_id === service.id)}
                                                                onChange={e => handleServiceChange(e, service.id)}
                                                                className="w-1/12"
                                                            />
                                                            {service.price_per === "" &&
                                                                <p className="w-11/12 text-center">{service.name}</p>
                                                            }
                                                            {service.price_per === "meter" &&
                                                                <p className="w-11/12 text-center">{service.name} (m<sup>2</sup>)
                                                                </p>
                                                            }
                                                            {service.price_per === "amount" &&
                                                                <p className="w-11/12 text-center">{service.name} (szt.)</p>
                                                            }

                                                        </div>

                                                        <input
                                                            type="number"
                                                            id="min_price"
                                                            name="min_price"
                                                            placeholder="Cena"
                                                            disabled={tempSpecialistService === undefined}
                                                            onChange={e => handlePriceChange(e, service.id, "min")}
                                                            value={tempSpecialistService?.min_price || 0}
                                                            className={`w-1/4 h-14 drop-shadow-2xl border-2 focus:border-4 rounded-2xl text-2xl px-6 border-amber-900 mr-1`}
                                                        />
                                                        <input
                                                            type="number"
                                                            id="max_price"
                                                            name="max_price"
                                                            placeholder="Cena"
                                                            disabled={tempSpecialistService === undefined}
                                                            onChange={e => handlePriceChange(e, service.id, "max")}
                                                            value={tempSpecialistService?.max_price || 0}
                                                            className={`w-1/4 h-14 drop-shadow-2xl border-2 focus:border-4 rounded-2xl text-2xl px-6 border-amber-900 ml-1`}
                                                        />
                                                    </div>
                                                )
                                            }
                                        )}
                                </div>

                                {errors.services && (
                                    <div
                                        className="italic text-red-500 drop-shadow-2xl font-bold text-lg text-center w-full h-7 mt-1 leading-none">
                                        <p>{errors.services}</p>
                                    </div>
                                )}
                            </div>
                        }

                        <div className="flex flex-col items-start mb-4 w-full">
                            <label className="font-bold text-2xl mx-6 mb-3">Opis*</label>
                            <textarea
                                id="description"
                                name="description"
                                placeholder="Pare słów o tobie"
                                value={specialist.description}
                                onChange={handleDescriptionChange}
                                rows={6}
                                cols={40}
                                className={`w-full drop-shadow-2xl border-2 focus:border-4 rounded-2xl text-2xl p-6 ${errors.description ? 'border-red-500' : 'border-amber-900 mb-8'}`}
                            />
                            {errors.description && (
                                <div
                                    className="italic text-red-500 drop-shadow-2xl font-bold text-lg text-center w-full h-7 mt-1 leading-none">
                                    <p>{errors.description}</p>
                                </div>
                            )}
                        </div>

                        <input
                            type="submit"
                            value="Zarejestruj"
                            className="flex flex-row justify-center cursor-pointer drop-shadow-xl bg-amber-900 text-white rounded-2xl w-40 h-14 text-xl font-bold  shadow-2xl transition-transform hover:-translate-y-2 duration-300"
                        />
                    </form>
                </div>
            </div>

            {showSuccessMsg &&
                createPortal(
                    <div className="flex flex-col items-center">
                        <h1 className="text-3xl font-bold my-4">Pomyślnie zarejestrowano!</h1>
                        <p className="text-xl my-2">Kliknij poniższy przycisk aby przejść do logowania</p>

                        <Link to="/specjalista/login" onClick={() => Swal.close()}
                              className="flex w-52 justify-center items-center mt-5">
                            <div
                                className="border-4 border-amber-900 text-white rounded-2xl cursor-pointer p-2 transition ease-in-out delay-0 bg-amber-900 hover:border-amber-900 hover:bg-white hover:text-amber-900 duration-300 ...">
                                <span className="mx-3 my-2 text-xl">zaloguj</span>
                            </div>
                        </Link>
                    </div>,
                    Swal.getHtmlContainer()!,
                )
            }

            {showErrorMsg &&
                createPortal(
                    <div className="flex flex-col items-center">
                        <h1 className="text-3xl font-bold my-4">BŁĄD</h1>
                        <p className="text-xl my-2">{errorMsg}</p>

                        <div className="flex w-52 justify-center items-center mt-5">
                            <div onClick={() => Swal.close()}
                                 className="border-4 border-amber-900 text-white rounded-2xl cursor-pointer p-2 transition ease-in-out delay-0 bg-amber-900 hover:border-amber-900 hover:bg-white hover:text-amber-900 duration-300 ...">
                                <span className="mx-3 my-2 text-xl">Ok</span>
                            </div>
                        </div>
                    </div>,
                    Swal.getHtmlContainer()!,
                )
            }
        </div>
    )
}

export default SpecialistRegister