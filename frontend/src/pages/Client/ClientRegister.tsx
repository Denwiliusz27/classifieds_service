import React, {useState} from "react";
import Input from "../../components/form/Input";
import Select from "../../components/form/Select";
import {City} from "../../models/City";

function ClientRegister() {
    const [client, setClient] = useState({
        name: "",
        email: "",
        password: "",
        city: 0,
        street: "",
        buildingNr: 0,
        flatNr: 0
    })

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        city: "",
        street: "",
        buildingNr: "",
        flatNr: "",
    })

    const cities: City[] = [
        {id: 1, name: "Kraków"},
        {id: 2, name: "Warszawa"},
        {id: 3, name: "Poznań"},
    ]

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

    function checkName() {
        const regex = new RegExp('^[a-zA-Z]+$');

        if (client.name.length === 0){
            setErrors({
                ...errors,
                name: "Wprowadź adres email"
            });
            errors["name"] = "Wprowadź swoje imie"
            return
        }

        if (!regex.test(client.name)){
            errors["name"] = "Imie powinno składać się jedynie z liter"
            return
        }

        let newName = client.name.toLowerCase()
        newName = newName.charAt(0).toUpperCase() + newName.slice(1)
        setClient({
            ...client,
            name: newName
        })
    }

    function checkEmail() {
        if (client.email.length === 0) {
            setErrors({
                ...errors,
                email: "Wprowadź adres email"
            });
            return;
        }

        setClient({
            ...client,
            email: client.email.toLowerCase()
        });
    }

    function checkPassword() {
        if (client.password.length === 0) {
            // errors["password"] = "Wprowadź hasło do konta"
            setErrors({
                ...errors,
                password: "Wprowadź hasło do konta"
            })
            return
        }
    }


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        checkName()
        checkEmail()
        checkPassword()

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
        </div>
    )

}

export default ClientRegister