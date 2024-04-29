import React, {useState} from "react";
import Input from "../../components/form/Input";
import Select from "../../components/form/Select";
import {City} from "../../models/City";

function ClientRegister() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [city, setCity] = useState("")
    const [street, setStreet] = useState("")
    const [buildingNr, setBuildingNr] = useState(0)
    const [flatNr, setFlatNr] = useState(0)

    const [nameError, setNameError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [cityError, setCityError] = useState("")
    const [streetError, setStreetError] = useState("")
    const [buildingNrError, setBuildingNrError] = useState("")
    const [flatNrError, setFlatNrError] = useState("")

    const cities: City[] = [
        {id: 1, name:"Kraków"},
        {id: 2, name:"Warszawa"},
        {id: 3, name:"Poznań"},
    ]

    const handleNameChange = (event: React.FormEvent<HTMLInputElement>) => {
        setName(event.currentTarget.value)
        setNameError("")
    }

    const handleEmailChange = (event: React.FormEvent<HTMLInputElement>) => {
        setEmail(event.currentTarget.value)
        setEmailError("")
    }

    const handlePasswordChange = (event: React.FormEvent<HTMLInputElement>) => {
        setPassword(event.currentTarget.value)
        setPasswordError("")
    }

    const handleCityChange = (event: React.FormEvent<HTMLSelectElement>) => {
        setCity(event.currentTarget.value)
        setCityError("")
    }

    const handleStreetChange = (event: React.FormEvent<HTMLInputElement>) => {
        setStreet(event.currentTarget.value)
        setStreetError("")
    }

    const handleBuildingNrChange = (event: React.FormEvent<HTMLInputElement>) => {
        setBuildingNr(parseInt(event.currentTarget.value))
        setBuildingNrError("")
    }

    const handleFlatNrChange = (event: React.FormEvent<HTMLInputElement>) => {
        setFlatNr(parseInt(event.currentTarget.value))
        setFlatNrError("")
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
    }

    return(
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
                <div className="flex flex-col items-center my-4 py-8 w-1/4 min-w-96">
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
                            onChange={handleNameChange}
                            placeholder="Imie"
                            type="text"
                            value={name}
                            error={nameError}
                        />

                        <Input
                            labelName="Email*"
                            name="email"
                            onChange={handleEmailChange}
                            placeholder="Adres email"
                            type="email"
                            value={email}
                            error={emailError}
                        />

                        <Input
                            labelName="Hasło*"
                            name="password"
                            onChange={handlePasswordChange}
                            placeholder="Hasło"
                            type="password"
                            value={password}
                            error={passwordError}
                        />

                        <div className="flex flex-row justify-items-center space-x-4">
                            <Select<City>
                                labelName="Miasto*"
                                name="city"
                                placeholder="Nazwa miasta"
                                onChange={handleCityChange}
                                value={city}
                                options={cities}
                                error={cityError}
                            />

                            <Input
                                labelName="Ulica*"
                                name="street"
                                onChange={handleStreetChange}
                                placeholder="Nazwa ulicy"
                                type="text"
                                value={street}
                                error={streetError}
                            />
                        </div>

                        <div className="flex flex-row justify-items-center space-x-4">
                            <Input
                                labelName="Nr budynku*"
                                name="building"
                                onChange={handleBuildingNrChange}
                                placeholder="Numer budynku"
                                type="number"
                                value={buildingNr}
                                error={buildingNrError}
                            />

                            <Input
                                labelName="Nr mieszkania"
                                name="flat"
                                onChange={handleFlatNrChange}
                                placeholder="Numer mieszkania"
                                type="number"
                                value={flatNr}
                                error={flatNrError}
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