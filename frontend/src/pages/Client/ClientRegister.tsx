import React, {useEffect, useState} from "react";
import Input from "../../components/form/Input";
import Select from "../../components/form/Select";
import {City} from "../../models/City";
import Swal from "sweetalert2";
import {createPortal} from "react-dom";
import {Link} from "react-router-dom";
import {ClientRequest} from "../../models/ClientRequest";
import {ClientAddress} from "../../models/ClientAddress";


function ClientRegister() {
    const [client, setClient] = useState<ClientRequest>({
        name: "",
        second_name: "",
        email: "",
        password: "",
        addresses: [{
            city_id: 0,
            street: "",
            building_nr: 0,
            flat_nr: 0
        }] as ClientAddress[]
    })

    const [errors, setErrors] = useState({
        name: "",
        second_name: "",
        email: "",
        password: "",
        clientAddresses: "",
    })

    const [cities, setCities] = useState([])
    const [showSuccessMsg, setShowSuccessMsg] = useState(false)
    const [showErrorMsg, setShowErrorMsg] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")

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
        let name = event.currentTarget.name as keyof ClientRequest
        const fieldType = typeof client[name]

        if (fieldType === "number") {
            setClient({
                ...client,
                [name]: parseInt(value),
            })
        } else {
            setClient({
                ...client,
                [name]: value,
            })
        }

        setErrors({
            ...errors,
            [name]: ""
        })
    }

    const handleCityChange = (event: React.FormEvent<HTMLSelectElement>, i: number) => {
        let value = event.currentTarget.value
        const addresses = client.addresses
        addresses[i].city_id = Number(value)

        setClient({
            ...client,
            addresses: addresses,
        })

        setErrors({
            ...errors,
            clientAddresses: ""
        })
    }

    const handleStreetChange = (event: React.FormEvent<HTMLInputElement>, i: number) => {
        let value = event.currentTarget.value
        const addresses = client.addresses
        addresses[i].street = value

        setClient({
            ...client,
            addresses: addresses,
        })

        setErrors({
            ...errors,
            clientAddresses: ""
        })
    }

    const handleBuildingNrChange = (event: React.FormEvent<HTMLInputElement>, i: number) => {
        let value = event.currentTarget.value
        const addresses = client.addresses
        addresses[i].building_nr = Number(value)

        setClient({
            ...client,
            addresses: addresses,
        })

        setErrors({
            ...errors,
            clientAddresses: ""
        })
    }

    const handleFlatNrChange = (event: React.FormEvent<HTMLInputElement>, i: number) => {
        let value = event.currentTarget.value
        const addresses = client.addresses
        addresses[i].flat_nr = Number(value)

        setClient({
            ...client,
            addresses: addresses,
        })

        setErrors({
            ...errors,
            clientAddresses: ""
        })
    }

    const addAddress = () => {
        const newAddress: ClientAddress = {
            city_id: 0,
            street: "",
            building_nr: 0,
            flat_nr: 0
        }

        const addresses = client.addresses
        addresses.push(newAddress)

        setClient({
            ...client,
            addresses: addresses,
        })
    }

    function deleteAddress(i: number) {
        let newAddresses: ClientAddress[]

        if (client.addresses.length > 1) {
            newAddresses = client.addresses.filter((_, index) => index !== i)
        } else {
            newAddresses = client.addresses
            newAddresses[0].city_id = 0
            newAddresses[0].street = ""
            newAddresses[0].building_nr = 0
            newAddresses[0].flat_nr = 0
        }

        setClient({
            ...client,
            addresses: newAddresses,
        })
    }

    function checkForm() {
        const nameRegex = new RegExp('^[A-Za-ząĄćĆęĘłŁńŃóÓśŚźŹżŻ-]+$');
        const streetRegex = new RegExp('^[A-Za-ząĄćĆęĘłŁńŃóÓśŚźŹżŻ\\s-.]+$');
        let nameError = ""
        let second_nameError = ""
        let emailError = ""
        let passwordError = ""
        let clientAddressesError = ""

        // name
        if (client.name.length === 0) {
            nameError = "Wprowadź swoje imie"
        } else if (!nameRegex.test(client.name)) {
            nameError = "Imie powinno składać się jedynie z liter"
        }

        // second_name
        if (client.second_name.length === 0) {
            second_nameError = "Wprowadź swoje nazwisko"
        } else if (!nameRegex.test(client.second_name)) {
            second_nameError = "Nazwisko powinno składać się jedynie z liter"
        }

        // email
        if (client.email.length === 0) {
            emailError = "Wprowadź adres email"
        }

        // password
        if (client.password.length === 0) {
            passwordError = "Wprowadź hasło do konta"
        }

        client.addresses.forEach(a => {
            if (a.city_id === 0) {
                clientAddressesError = "Wybierz miasto z listy"
            } else if (a.street === "") {
                clientAddressesError = "Wprowadź nazwę ulicy"
            } else if (!streetRegex.test(a.street)) {
                clientAddressesError = "Nazwa ulicy zawiera niewłaściwe znaki"
            } else if (a.building_nr === 0) {
                clientAddressesError = "Wprowadź numer budynku"
            } else if (a.building_nr < 0) {
                clientAddressesError = "Numer budynku powinien być liczbą dodatnią"
            }
        })

        client.addresses.forEach((a1, i) => {
            client.addresses.forEach((a2, j) => {
                if (i !== j) {
                    if (a1.city_id === a2.city_id && a1.street === a2.street && a1.building_nr === a2.building_nr && a1.flat_nr === a2.flat_nr) {
                        clientAddressesError = "Adresy nie mogą się powtarzać"
                    }
                }
            })
        })

        if (nameError === "" && second_nameError === "" && emailError === "" && passwordError === "" && clientAddressesError === "") {
            let newName = client.name.toLowerCase()
            newName = newName.charAt(0).toUpperCase() + newName.slice(1)

            let new_second_name = client.second_name.toLowerCase()
            new_second_name = new_second_name.charAt(0).toUpperCase() + new_second_name.slice(1)

            setClient({
                ...client,
                name: newName,
                second_name: new_second_name,
                email: client.email.toLowerCase(),
            });

            return true
        } else {
            setErrors({
                ...errors,
                name: nameError,
                second_name: second_nameError,
                email: emailError,
                password: passwordError,
                clientAddresses: clientAddressesError
            })

            return false
        }
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (checkForm()) {
            const headers = new Headers()
            headers.append("Content-Type", "application/json")
            const method = "POST"
            let requestOptions = {
                body: JSON.stringify(client),
                method: method,
                headers: headers,
            }

            fetch(`/client/register`, requestOptions)
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
        }
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

                {/* Register elements*/}
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
                            name="second_name"
                            onChange={handleClientChange()}
                            placeholder="Nazwisko"
                            type="text"
                            value={client.second_name}
                            error={errors["second_name"]}
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

                        <div className="flex flex-col items-start mb-4 w-full">
                            <p className="font-bold text-2xl mx-6 mb-3">Adresy*</p>
                            <div
                                className={`flex flex-col bg-white w-full drop-shadow-2xl border-2 ${errors.clientAddresses ? 'border-red-500' : 'border-amber-900 mb-8'} focus:border-4 rounded-2xl text-2xl px-4 py-3`}>

                                {client.addresses.map((a, i) => {
                                    return (
                                        <>
                                            <div className="flex flex-row justify-center items-center">
                                                <div className="w-[500px]">
                                                    <div className="flex flex-row justify-items-center space-x-4 ">
                                                        <Select<City>
                                                            labelName="Miasto*"
                                                            name="city_id"
                                                            placeholder="Nazwa miasta"
                                                            onChange={(e) => handleCityChange(e, i)}
                                                            value={a.city_id}
                                                            options={cities}
                                                        />

                                                        <Input
                                                            labelName="Ulica*"
                                                            name="street"
                                                            onChange={(e) => handleStreetChange(e, i)}
                                                            placeholder="Nazwa ulicy"
                                                            type="text"
                                                            value={a.street}
                                                        />
                                                    </div>

                                                    <div className="flex flex-row justify-items-center space-x-4">
                                                        <Input
                                                            labelName="Nr budynku*"
                                                            name="building_nr"
                                                            onChange={(e) => handleBuildingNrChange(e, i)}
                                                            placeholder="Numer budynku"
                                                            type="number"
                                                            value={a.building_nr}
                                                        />

                                                        <Input
                                                            labelName="Nr mieszkania"
                                                            name="flat_nr"
                                                            onChange={(e) => handleFlatNrChange(e, i)}
                                                            placeholder="Numer mieszkania"
                                                            type="number"
                                                            value={a.flat_nr}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="w-[50px] h-full flex items-center justify-end">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                         viewBox="0 0 24 24" stroke-width="1.5"
                                                         stroke="currentColor"
                                                         className="size-8 hover:cursor-pointer"
                                                         onClick={(e) => deleteAddress(i)}
                                                    >
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            {client.addresses.length > 1 &&
                                                <div className="flex flex-col items-center w-full mb-8">
                                                    <div
                                                        className="flex justify-self-end bg-amber-900 rounded-md h-1 w-2/3"></div>
                                                </div>
                                            }
                                        </>
                                    )
                                })}

                                <div className="w-full flex justify-center mb-3">
                                    <div onClick={addAddress}
                                         className="w-40 border-2 border-amber-900 text-white text-xl font-bold rounded-2xl cursor-pointer p-2 transition ease-in-out delay-0 bg-amber-900 hover:bg-white hover:border-amber-900 hover:text-amber-900 duration-300 ...">
                                        <span>Dodaj adres</span>
                                    </div>
                                </div>
                            </div>

                            {errors.clientAddresses && (
                                <div
                                    className="italic text-red-500 drop-shadow-2xl font-bold text-lg text-center w-full h-7 my-3 leading-none">
                                    <p>{errors.clientAddresses}</p>
                                </div>
                            )}
                        </div>

                        <input
                            type="submit"
                            value="Zarejestruj"
                            className="flex flex-row justify-center cursor-pointer drop-shadow-xl bg-amber-900 text-white rounded-2xl w-40 h-14 text-xl font-bold shadow-2xl transition-transform hover:-translate-y-2 duration-300"
                        />
                    </form>
                </div>
            </div>

            {showSuccessMsg &&
                createPortal(
                    <div className="flex flex-col items-center">
                        <h1 className="text-3xl font-bold my-4">Pomyślnie zarejestrowano!</h1>
                        <p className="text-xl my-2">Kliknij poniższy przycisk aby przejść do logowania</p>

                        <Link to="/klient/login" onClick={() => Swal.close()}
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

export default ClientRegister