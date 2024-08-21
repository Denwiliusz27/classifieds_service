import React, {useEffect, useState} from "react";
import Input from "../../components/form/Input";
import {UserLogin} from "../../models/UserLogin";
import Swal from "sweetalert2";
import {useNavigate, useOutletContext} from "react-router-dom";
import {AuthContextType} from "../../App";
import {createPortal} from "react-dom";
import {Specialist} from "../../models/Specialist";

function SpecialistLogin() {
    const [user, setUser] = useState<UserLogin>({
        email: "",
        password: "",
        role: "specialist",
    })
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [errorMsg, setErrorMsg] = useState("")
    const [successLogin, setSuccessLogin] = useState(false)
    const [showErrorMsg, setShowErrorMsg] = useState(false)

    const {jwtToken, setJwtToken, userRole, setUserRole, toggleRefresh, setName} = useOutletContext<AuthContextType>();
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
                        headers.append("Authorization", "Bearer " + data.access_token)

                        fetch(`/specialist/info/${data.user_id}`, {
                            method: "GET",
                            headers: headers,
                            credentials: 'include'
                        }).then((response) => response.json())
                            .then((data) => {
                                const specialist: Specialist = {
                                    id: data.id,
                                    name: data.name,
                                    second_name: data.second_name,
                                    email: data.email,
                                    description: data.description,
                                    phone_nr: data.phone_nr,
                                    specialization_id: data.specialization_id,
                                    city_id: data.city_id,
                                    user_id: data.user_id,
                                    created_at: data.created_at
                                }
                                sessionStorage.setItem("specialist", JSON.stringify(specialist))
                                setName(data.name)
                            })

                        setSuccessLogin(true)
                        document.body.style.cursor = "wait"

                        setTimeout(() => {
                            setJwtToken(data.access_token)
                            setUserRole(data.user_role)
                            toggleRefresh(true)
                            document.body.style.cursor = "default"

                            navigate("/specjalista/strona_glowna")
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

export default SpecialistLogin