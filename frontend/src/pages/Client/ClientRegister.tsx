import React, {useEffect, useState} from "react";
import Input from "../../components/form/Input";
import Select from "../../components/form/Select";
import {City} from "../../models/City";
import Swal from "sweetalert2";
import {createPortal} from "react-dom";
import {Link} from "react-router-dom";

function ClientRegister() {
    const [client, setClient] = useState({
        name: "",
        surname: "",
        email: "",
        password: "",
        city: 0,
        street: "",
        buildingNr: 0,
        flatNr: 0
    })

    const [errors, setErrors] = useState({
        name: "",
        surname: "",
        email: "",
        password: "",
        city: "",
        street: "",
        buildingNr: "",
        flatNr: "",
    })

    const [cities, setCities] = useState([])

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
    }, [])

    const handleClientChange = () => (event: React.FormEvent<HTMLInputElement>) => {
        let value = event.currentTarget.value
        let name = event.currentTarget.name
        setClient({
            ...client,
            [name]: value,
        })

        setErrors({
            ...errors,
            [name]: ""
        })
    }

    const handleCityChange = (event: React.FormEvent<HTMLSelectElement>) => {
        let name = event.currentTarget.name

        setClient({
            ...client,
            [name]: event.currentTarget.value,
        })

        setErrors({
            ...errors,
            [name]: ""
        })
    }

    function checkForm() {
        const nameRegex = new RegExp('^[a-zA-Z]+$');
        const streetRegex = new RegExp('^[a-zA-Z0-9\\s-]+$');
        let nameError = ""
        let surnameError = ""
        let emailError = ""
        let passwordError = ""
        let cityError = ""
        let streetError = ""
        let buildingNrError = ""

        // name
        if (client.name.length === 0) {
            nameError = "Wprowadź swoje imie"
        } else if (!nameRegex.test(client.name)) {
            nameError = "Imie powinno składać się jedynie z liter"
        }

        // surname
        if (client.name.length === 0) {
            surnameError = "Wprowadź swoje nazwisko"
        } else if (!nameRegex.test(client.name)) {
            surnameError = "Nazwisko powinno składać się jedynie z liter"
        }

        // email
        if (client.email.length === 0) {
            emailError = "Wprowadź adres email"
        }

        // password
        if (client.password.length === 0) {
            passwordError = "Wprowadź hasło do konta"
        }

        // city
        if (client.city === 0) {
            cityError = "Wybierz miasto z listy"
        }

        // street
        if (client.street === "") {
            streetError = "Wprowadź nazwę ulicy"
        } else if (!streetRegex.test(client.street)) {
            streetError = "Nazwa ulicy powinna składać się jedynie z liter i cyfr"
        }

        // buildingNr
        if (client.buildingNr === 0) {
            buildingNrError = "Wprowadź numer budynku"
        } else if (client.buildingNr < 0) {
            buildingNrError = "Numer budynku powinien być liczbą dodatnią"
        }

        if (nameError === "" && surnameError === "" && emailError === "" && passwordError === "" && cityError === "" && streetError === "" && buildingNrError === "") {
            let newName = client.name.toLowerCase()
            newName = newName.charAt(0).toUpperCase() + newName.slice(1)

            let newSurname = client.surname.toLowerCase()
            newSurname = newSurname.charAt(0).toUpperCase() + newSurname.slice(1)

            setClient({
                ...client,
                name: newName,
                surname: newSurname,
                email: client.email.toLowerCase()
            });

            return true
        } else {
            setErrors({
                ...errors,
                name: nameError,
                surname: surnameError,
                email: emailError,
                password: passwordError,
                city: cityError,
                street: streetError,
                buildingNr: buildingNrError
            })

            return false
        }
    }

    const [showSuccessMsg, setShowSuccessMsg] = useState(false)

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (checkForm()) {
            console.log("zalogowano pomyślnie!")
            Swal.fire({
                didOpen: () => setShowSuccessMsg(true),
                didClose: () => setShowSuccessMsg(false),
                showConfirmButton: false,
            })
        } else {
            console.log("ERRORS")
        }

        console.log(client)
        console.log(errors)
    }

    return (
        <div
            className="overflow-hidden bg-no-repeat bg-contain text-center flex flex-col bg-right-top"
            style={{
                backgroundImage: `url(https://img.freepik.com/free-psd/tender-moments-elder-couple_23-2151191201.jpg?t=st=1714318739~exp=1714322339~hmac=214edabd04b388a13bbfef1350298a5b3017baf862fe272a5fd65248d3499efc&w=1380)`,
                height: '91.2vh',
            }}>
            <div
                className="flex flex-col items-center left-0 right-0 top-0 w-full overflow-auto h-full bg-fixed"
                style={{backgroundColor: `rgba(255, 255, 255, 0.4)`}}>

                {/* Login elements*/}
                <div className="flex flex-col items-center my-4 py-8 w-[550px]">
                    <div className="w-96">
                        <h1 className="text-3xl font-bold">Załóż konto klienta</h1>

                        <div className="flex flex-col items-end w-full">
                            <div className="flex justify-self-end bg-amber-900 rounded-md h-1 mb-3 mx-16 w-20"></div>
                        </div>
                    </div>

                    <form className="flex flex-col items-center w-full my-8" onSubmit={handleSubmit}>
                        <Input
                            labelName="Imie*"
                            name="name"
                            onChange={handleClientChange()}
                            placeholder="Imie"
                            type="text"
                            value={client.name}
                            error={errors["name"]}
                        />

                        <Input
                            labelName="Nazwisko*"
                            name="surname"
                            onChange={handleClientChange()}
                            placeholder="Nazwisko"
                            type="text"
                            value={client.surname}
                            error={errors["surname"]}
                        />

                        <Input
                            labelName="Email*"
                            name="email"
                            onChange={handleClientChange()}
                            placeholder="Adres email"
                            type="email"
                            value={client.email}
                            error={errors["email"]}
                        />

                        <Input
                            labelName="Hasło*"
                            name="password"
                            onChange={handleClientChange()}
                            placeholder="Hasło"
                            type="password"
                            value={client.password}
                            error={errors["password"]}
                        />

                        <div className="flex flex-row justify-items-center space-x-4">
                            <Select<City>
                                labelName="Miasto*"
                                name="city"
                                placeholder="Nazwa miasta"
                                onChange={handleCityChange}
                                value={client.city}
                                options={cities}
                                error={errors["city"]}
                            />

                            <Input
                                labelName="Ulica*"
                                name="street"
                                onChange={handleClientChange()}
                                placeholder="Nazwa ulicy"
                                type="text"
                                value={client.street}
                                error={errors["street"]}
                            />
                        </div>

                        <div className="flex flex-row justify-items-center space-x-4">
                            <Input
                                labelName="Nr budynku*"
                                name="buildingNr"
                                onChange={handleClientChange()}
                                placeholder="Numer budynku"
                                type="number"
                                value={client.buildingNr}
                                error={errors["buildingNr"]}
                            />

                            <Input
                                labelName="Nr mieszkania"
                                name="flatNr"
                                onChange={handleClientChange()}
                                placeholder="Numer mieszkania"
                                type="number"
                                value={client.flatNr}
                                error={errors["flatNr"]}
                            />
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

                        <Link to="/klient/login" onClick={() => Swal.close()} className="flex w-52 justify-center items-center mt-5">
                            <div className="border-4 border-amber-900 text-white rounded-2xl cursor-pointer p-2 transition ease-in-out delay-0 bg-amber-900 hover:border-amber-900 hover:bg-white hover:text-amber-900 duration-300 ...">
                                <span className="mx-3 my-2 text-xl">zaloguj</span>
                            </div>
                        </Link>
                    </div>,
                    Swal.getHtmlContainer()!,
                )
            }
        </div>
    )
}

export default ClientRegister