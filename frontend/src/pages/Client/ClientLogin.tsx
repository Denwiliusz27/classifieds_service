import Input from "../../components/form/Input";
import React, {useState} from "react";
import {UserLogin} from "../../models/UserLogin";
import {useNavigate, useOutletContext} from "react-router-dom";
import Swal from "sweetalert2";
import {AuthContextType} from "../../App";
import {createPortal} from "react-dom";

function ClientLogin() {
    const [user, setUser] = useState<UserLogin>({
        email: "",
        password: "",
        role: "client",
    })
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [errorMsg, setErrorMsg] = useState("")
    const [successLogin, setSuccessLogin] = useState(false)
    const [showErrorMsg, setShowErrorMsg] = useState(false)

    const {setJwtToken, setUserRole, toggleRefresh} = useOutletContext<AuthContextType>();
    const navigate = useNavigate()

    const handleEmailChange = (event: React.FormEvent<HTMLInputElement>) => {
        setUser({
            ...user,
            email: event.currentTarget.value
        })

        setEmailError("")
    }

    const handlePasswordChange = (event: React.FormEvent<HTMLInputElement>) => {
        setUser({
            ...user,
            password: event.currentTarget.value
        })

        setPasswordError("")
    }

    function checkForm() {
        if (user.email === "") {
            setEmailError("Podaj adres email")
        }
        if (user.password === "") {
            setPasswordError("Podaj hasło")
        }

        if (user.email === "" || user.password === "") {
            return false
        }

        return true
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (checkForm()) {
            const headers = new Headers()
            headers.append("Content-Type", "application/json")
            const method = "POST"

            fetch(`/authenticate`, {
                body: JSON.stringify(user),
                method: method,
                headers: headers,
                credentials: 'include',
            })
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
                        console.log("SUCCESSFULLY LOGGED IN")





                        setSuccessLogin(true)
                        document.body.style.cursor = "wait"
                        console.log(data)




                        setTimeout(() => {
                            setJwtToken(data.access_token)
                            setUserRole(data.user_role)



                            toggleRefresh(true)
                            document.body.style.cursor = "default"

                            navigate("/")
                        }, 2000)
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }

    return (
        <div
            className="overflow-hidden bg-no-repeat text-center flex flex-col bg-right-top"
            style={{
                backgroundImage: `url(https://img.freepik.com/free-photo/happy-young-couple-with-laptop-white-wall_186202-8739.jpg?t=st=1714038855~exp=1714042455~hmac=a59427669b84ec44f81fa782196576fb2167286eba934bda202e8ebd433eaaaf&w=740)`,
                height: '91.2vh',
            }}>
            <div
                className="flex flex-col  items-center left-0 right-0 top-0 w-full overflow-hidden h-full bg-fixed"
                style={{backgroundColor: `rgba(255, 255, 255, 0.4)`}}>

                {/* Login elements*/}
                <div className="flex flex-col items-center justify-center h-full m-4 pt-8 w-96">
                    <h1 className="text-3xl font-bold">Zaloguj się jako klient</h1>

                    <div className="flex flex-col items-end w-full">
                        <div className="flex justify-self-end bg-amber-900 rounded-md h-1 mb-3 mx-12 w-16 "></div>
                    </div>

                    <form className="flex flex-col items-center w-full mt-8" onSubmit={handleSubmit}>
                        <Input
                            labelName="Email"
                            name="email"
                            onChange={handleEmailChange}
                            placeholder="Adres email"
                            type="email"
                            value={user.email}
                            error={emailError}
                        />

                        <Input
                            labelName="Hasło"
                            name="password"
                            onChange={handlePasswordChange}
                            placeholder="Hasło"
                            type="password"
                            value={user.password}
                            error={passwordError}
                        />

                        <input
                            type="submit"
                            value="Zaloguj"
                            className="flex flex-row justify-center cursor-pointer drop-shadow-xl mt-4 bg-amber-900 text-white rounded-2xl w-40 h-14 text-xl font-bold overflow-hidden shadow-2xl transition-transform hover:-translate-y-2 duration-300"
                        />

                        {successLogin &&
                            <div className="my-6 drop-shadow-xl text-xl font-bold text-green-500">
                                <p>Pomyślnie zalogowano</p>
                            </div>
                        }
                    </form>
                </div>
            </div>

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

export default ClientLogin