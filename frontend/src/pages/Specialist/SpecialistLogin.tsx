import React, {useState} from "react";
import Input from "../../components/form/Input";

function SpecialistLogin() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")

    const handleEmailChange = (event: React.FormEvent<HTMLInputElement>) => {
        setEmail(event.currentTarget.value)
        setEmailError("")
    }

    const handlePasswordChange = (event: React.FormEvent<HTMLInputElement>) => {
        setPassword(event.currentTarget.value)
        setPasswordError("")
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (email === "") {
            setEmailError("Podaj adres email")
        }
        if (password === "") {
            setPasswordError("Podaj hasło")
        }

        if(email === "" || password === ""){
            return
        }

        console.log(`Hello ${email} ${password}`)
    }

    return (
        <div
            className="overflow-hidden bg-no-repeat bg-contain text-center flex flex-col bg-left-top"
            style={{
                backgroundImage: `url(https://img.freepik.com/free-photo/mechanic-presenting-something_1368-4081.jpg?t=st=1714058048~exp=1714061648~hmac=3ba707f57a0b98a44200b2cd870db6177d03e9467e1e04fe6c10ae1bc9ee3c10&w=740)`,
                height: '91.2vh',
                backgroundPositionX: '80px',
            }}>
            <div
                className="flex flex-col  items-center left-30 right-0 top-0 w-full overflow-hidden h-full bg-fixed"
                style={{backgroundColor: `rgba(255, 255, 255, 0.4)`}}>

                {/* Login elements*/}
                <div className="flex flex-col items-center justify-center h-full m-4 pt-8 w-96">
                    <h1 className="text-3xl font-bold">Zaloguj się jako specjalista</h1>

                    <div className="flex flex-col items-end w-full">
                        <div className="flex justify-self-end bg-amber-900 rounded-md h-1 mb-3 mx-4 w-32"></div>
                    </div>

                    <form className="flex flex-col items-center w-full mt-8" onSubmit={handleSubmit}>
                        <Input
                            labelName="Email"
                            name="email"
                            onChange={handleEmailChange}
                            placeholder="Adres email"
                            type="email"
                            value={email}
                            error={emailError}
                        />

                        <Input
                            labelName="Hasło"
                            name="password"
                            onChange={handlePasswordChange}
                            placeholder="Hasło"
                            type="password"
                            value={password}
                            error={passwordError}
                        />

                        <input
                            type="submit"
                            value="Zaloguj"
                            className="flex flex-row justify-center cursor-pointer drop-shadow-xl mt-4 bg-amber-900 text-white rounded-2xl w-40 h-14 text-xl font-bold overflow-hidden shadow-2xl transition-transform hover:-translate-y-2 duration-300"
                        />
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SpecialistLogin