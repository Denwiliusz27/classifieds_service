import React, {useEffect, useState} from "react";
import {Link, useLocation, useNavigate, useOutletContext} from "react-router-dom";
import {AuthContextType} from "../../App";
import {SpecialistExtendedInfo} from "../../models/Specialist";
import {Review} from "../../models/Review";
import {Calendar, dateFnsLocalizer, Views} from "react-big-calendar";
import {pl} from "date-fns/locale";
import {format} from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import {VisitCalendar, VisitRequest} from "../../models/Visit";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../../index.css"
import Swal from "sweetalert2";
import {createPortal} from "react-dom";
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DemoItem} from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import 'dayjs/locale/pl';
import {DateTimePicker} from "@mui/x-date-pickers";
import {TimeOff} from "../../models/TimeOff";
import {ClientAddressExtended} from "../../models/ClientAddress";

function SpecialistProfile() {
    const [specialist, setSpecialist] = useState<SpecialistExtendedInfo>()
    const [clientAddresses, setClientAddresses] = useState<ClientAddressExtended[]>()
    const [reviews, setReviews] = useState({
        count: 0,
        average: ''
    })
    const [showRegisterWindow, setShowRegisterWindow] = useState(false)
    const [showErrorWindow, setShowErrorWindow] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")
    const [universalError, setUniversalError] = useState("")
    const [dateError, setDateError] = useState("")
    const [loginError, setLoginError] = useState("")
    const [serviceError, setServiceError] = useState("")
    const [clientAddressError, setClientAddressError] = useState("")
    const [descriptionError, setDescriptionError] = useState("")
    const [timeOff, setTimeOff] = useState<TimeOff[]>([])
    const [visits, setVisits] = useState<VisitCalendar[]>([])
    const [newVisit, setNewVisit] = useState<VisitRequest>({
        start_date: new Date(),
        end_date: new Date(),
        description: "",
        client_id: 0,
        client_address_id: 0,
        specialist_id: 0,
        specialist_service_id: 0,
    })

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

        const headers = new Headers()
        headers.append("Content-Type", "application/json")
        const requestOptions = {
            method: "GET",
            headers: headers,
        }

        console.log(location.state.specialistId)

        fetch(`http://localhost:8080/specialist/detailed_info/${location.state.specialistId}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                data.specialist.created_at = new Date(data.specialist.created_at).toLocaleDateString()

                if (data.reviews) {
                    data.reviews.forEach((r: Review) => {
                        const d = new Date(r.created_at)
                        const year = d.getUTCFullYear();
                        const month = String(d.getUTCMonth() + 1).padStart(2, '0'); // Miesiące są 0-indeksowane
                        const day = String(d.getUTCDate()).padStart(2, '0');
                        const hours = String(d.getUTCHours()).padStart(2, '0');
                        const minutes = String(d.getUTCMinutes()).padStart(2, '0');

                        r.created_at = String(hours + ":" + minutes + " " + day + "." + month + "." + year)
                    })
                }

                setSpecialist(data)
            })
            .catch(err => {
                console.log("Error retrieving Specialist: ", err)
            })

        fetch(`http://localhost:8080/time_off/${location.state.specialistId}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setTimeOff(data)
            })
            .catch(err => {
                console.log("Error retrieving TimeOff: ", err)
            })

        getSpecialistVisits(location.state.specialistId)

        const user = sessionStorage.getItem(userRole)
        if (user) {
            var c = JSON.parse(user)
            setNewVisit({
                ...newVisit,
                client_id: c.id
            })

            headers.append("Authorization", "Bearer " + jwtToken)
            fetch(`/client/addresses/${c.id}`, {
                method: "GET",
                headers: headers,
                credentials: 'include'
            }).then((response) => response.json())
                .then((data) => {
                    setClientAddresses(data)
                })
        }
    }, [jwtToken, location.state.specialistId, navigate, userRole])

    useEffect(() => {
        if (specialist) {
            if (specialist.reviews && specialist!.reviews.length > 0) {
                let avg = 0
                for (let i = 0; i < specialist!.reviews.length; i++) {
                    avg = avg + specialist.reviews[i].rating
                }

                avg = avg / specialist.reviews.length

                setReviews({
                    ...reviews,
                    count: specialist.reviews.length,
                    average: (Math.round(avg * 100) / 100).toFixed(2)
                })
            }
        }

    }, [specialist]);

    function getSpecialistVisits(specialistId: number) {
        const headers = new Headers()
        headers.append("Content-Type", "application/json")
        const requestOptions = {
            method: "GET",
            headers: headers,
        }

        fetch(`http://localhost:8080/visits/${specialistId}/0`, requestOptions)
            .then((response) => response.json())
            .then((data) => {

                const tmp: VisitCalendar[] = []

                if(data) {
                    data.forEach((v: VisitCalendar) => {
                        v.info.start_date = new Date(v.info.start_date)
                        v.info.end_date = new Date(v.info.end_date)
                        if (v.info.status !== 'declined') {
                            tmp.push(v)
                        }
                    })
                }

                setVisits(tmp)
            })
            .catch(err => {
                console.log("Error retrieving Visits: ", err)
            })
    }

    const eventBackgroundAdjustment = (visit: VisitCalendar) => {
        let backgroundColor = 'Maroon';

        if (visit.info.status === 'specialist_action_required' || visit.info.status === 'client_action_required') {
            backgroundColor = 'SandyBrown';
        }

        return {style: {backgroundColor}};
    };

    const isDateAvailable = (date: Date): boolean => {
        if (!timeOff) {
            return true
        }
        return !timeOff.some(off => {
            const start = new Date(off.start_date);
            const end = new Date(off.end_date);
            return date >= start && date < end;
        });
    };

    const isDateOverlapping = (date: Date): boolean => {
        if(visits) {
            for (let i = 0; i < visits.length; i++) {
                if (date >= visits[i].info.start_date && date < visits[i].info.end_date) {
                    return true
                }
            }
        }

        return false;
    }

    const isDateFromFuture = (date: Date): boolean => {
        const currentDate = new Date();
        return date >= currentDate;
    }

    const handleSelectSlot = ({start}: { start: Date }) => {
        if (jwtToken === "") {
            console.log("user isn't logged")
            setLoginError("Aby zarezerwować usługę zaloguj się lub zarejestruj konto.")

            Swal.fire({
                didOpen: () => setShowErrorWindow(true),
                didClose: () => {
                    setShowErrorWindow(false)
                    setLoginError("")
                },
                showConfirmButton: false,
            })
            return;
        }

        if (!isDateFromFuture(start)) {
            setUniversalError("Wybrana data jest datą przeszłą, wybierz termin z przyszłości.")

            Swal.fire({
                didOpen: () => setShowErrorWindow(true),
                didClose: () => {
                    setShowErrorWindow(false)
                    setUniversalError("")
                },
                showConfirmButton: false,
            })
            return;
        }

        if (!isDateAvailable(start)) {
            setUniversalError("Wybrana data jest niedostępna, wybierz inny termin.")

            Swal.fire({
                didOpen: () => setShowErrorWindow(true),
                didClose: () => {
                    setShowErrorWindow(false)
                    setUniversalError("")
                },
                showConfirmButton: false,
            })
            return;
        }

        if (isDateOverlapping(start)) {
            setUniversalError("W wybranym terminie istnieje już rezerwacja, wybierz inny termin.")

            Swal.fire({
                didOpen: () => setShowErrorWindow(true),
                didClose: () => {
                    setShowErrorWindow(false)
                    setUniversalError("")
                },
                showConfirmButton: false,
            })
            return;
        }

        const tmp = start.getTime();
        setNewVisit({
            ...newVisit,
            specialist_id: specialist?.specialist.id!,
            start_date: start,
            end_date: new Date(tmp + 2 * 60 * 60 * 1000)
        });

        Swal.fire({
            didOpen: () => setShowRegisterWindow(true),
            didClose: () => {
                setShowRegisterWindow(false)
                setDateError("")
                setServiceError("")
                setClientAddressError("")
                setDescriptionError("")
                setUniversalError("")
                setSuccessMessage("")

                setNewVisit({
                    ...newVisit,
                    specialist_service_id: 0,
                    client_address_id: 0,
                    description: ""
                })
            },
            showConfirmButton: false,
        })
    };

    const timeOffSlotAdjustment = (date: Date) => {
        if (!isDateAvailable(date)) {
            return {style: {backgroundColor: 'lightgray', border: 'none'}};
        }
        return {};
    }

    function checkNewVisitErrors() {
        let dateError = ""
        let serviceError = ""
        let clientAddressError = ""
        let descriptionError = ""

        if (!isDateFromFuture(newVisit.start_date)) {
            dateError = "Wybrana data jest datą przeszłą, wybierz termin z przyszłości"
        }

        if (dateError === "" && !isDateAvailable(newVisit.start_date)) {
            dateError = "Wybrana data jest niedostępna, wybierz inny termin"
        }

        if (dateError === "" && isDateOverlapping(newVisit.start_date)) {
            dateError = "W wybranym terminie istnieje już rezerwacja, wybierz inny termin"
        }

        if (newVisit.specialist_service_id === 0) {
            serviceError = "Wybierz usługę z listy"
        }

        if (newVisit.client_address_id === 0) {
            clientAddressError = "Wybierz adres realizacji z listy"
        }

        if (newVisit.description === "") {
            descriptionError = "Dodaj szczegółowe informacje na temat usługi"
        }

        if (dateError === "" && serviceError === "" && clientAddressError === "" && descriptionError === "") {
            return true
        } else {
            setDateError(dateError)
            setServiceError(serviceError)
            setClientAddressError(clientAddressError)
            setDescriptionError(descriptionError)
            return false
        }
    }

    const createVisit = () => {
        if (!checkNewVisitErrors()) {
            return
        }

        const headers = new Headers()
        headers.append("Content-Type", "application/json")
        headers.append("Authorization", "Bearer " + jwtToken)
        const method = "POST"

        fetch(`/client/create_visit`, {
            body: JSON.stringify(newVisit),
            method: method,
            headers: headers,
            credentials: 'include'
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.log("ERRORS")
                    setUniversalError(data.message)
                } else {
                    console.log("SUCCESSFULLY CREATED VISIT")
                    setSuccessMessage("Pomyślnie utworzono rezerwację")
                    getSpecialistVisits(specialist?.specialist.id!)
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return (
        <div className="flex flex-col items-center overflow-auto h-full bg-fixed fixed w-full pb-32">
            <div className="w-11/12">
                <div className="flex flex-col text-center pt-8">
                    <div className="flex flex-row text-3xl font-bold mb-6 justify-center">
                        <h1>Szczegóły profilu</h1>
                    </div>

                    <div className="flex flex-row">
                        <div className="flex flex-col w-1/3">
                            {/* profile info*/}
                            <div className="flex flex-col w-full bg-white drop-shadow-lg p-6 my-4 rounded-2xl text-2xl">
                                <div className="flex flex-col items-center">
                                    <div className="flex flex-col justify-center">
                                        <p className="font-bold text-3xl pb-1">{specialist?.specialist.name} {specialist?.specialist.second_name}</p>
                                        <div className="bg-amber-900 rounded-md h-1 mb-3"></div>
                                    </div>

                                    {/* contact info */}
                                    <div className="flex flex-row justify-evenly w-full font-extrabold">
                                        <div className="w-1/3">
                                            <div className="flex flex-row py-2 items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                     stroke-width="1.5" stroke="currentColor" className="size-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                          d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z"/>
                                                </svg>
                                                <p className="pl-3 font-bold">{specialist?.specialist.specialization}</p>
                                            </div>

                                            <div className="flex flex-row py-1 items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                     stroke-width="1.5" stroke="currentColor" className="size-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                          d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"/>
                                                </svg>
                                                <p className="pl-3 font-bold">{specialist?.specialist.city}</p>
                                            </div>
                                        </div>

                                        <div className="">
                                            <div className="flex flex-row py-2 items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                     stroke-width="1.5" stroke="currentColor" className="size-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                          d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"/>
                                                </svg>
                                                <p className="pl-3 font-bold">{specialist?.specialist.phone_nr}</p>
                                            </div>

                                            <div className="flex flex-row py-1 items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                     stroke-width="1.5" stroke="currentColor" className="size-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                          d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"/>
                                                </svg>
                                                <p className="pl-3 font-bold break-all w-full">{specialist?.specialist.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="mt-3 text-lg scale-110">(W serwisie
                                        od {specialist?.specialist.created_at})</p>

                                    <div className="bg-amber-900 rounded-md h-1 my-4 w-4/5 "></div>

                                    {/* description */}
                                    <div>
                                        <p className="italic">{specialist?.specialist.description}</p>
                                    </div>
                                </div>
                            </div>

                            {/* specialist services */}
                            <div className="flex flex-col w-full bg-white drop-shadow-lg p-6 my-4 rounded-2xl text-2xl">
                                <div className="flex flex-col items-center">
                                    <div className="flex flex-col justify-center">
                                        <p className="font-bold text-3xl pb-1">Oferowane usługi</p>
                                        <div className="bg-amber-900 rounded-md h-1 mb-3"></div>
                                    </div>

                                    <div
                                        className="flex flex-col w-full text-left justify-items-center">
                                        {specialist?.services !== null && specialist?.services.map((s) => {
                                            return (
                                                <div
                                                    className="pt-1 pb-2 flex flex-row w-full justify-center items-center">
                                                    <div
                                                        className="flex flex-col justify-center border-2 border-amber-900 bg-amber-900 text-white text-center rounded-xl px-2 py-1 mr-2 drop-shadow-lg ">
                                                        <p className="font-medium">{s.name}</p>
                                                    </div>

                                                    <div className="flex flex-row">
                                                        <p>({s.price_min}zł - {s.price_max}zł)</p>
                                                        {s.price_per === "meter" &&
                                                            <p className="text-center ml-1">(m<sup>2</sup>)
                                                            </p>
                                                        }
                                                        {s.price_per === "amount" &&
                                                            <p className="text-center ml-1">(szt.)</p>
                                                        }
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* opinions */}
                            <div
                                className="flex flex-col w-full bg-white drop-shadow-lg p-6 my-4 rounded-2xl text-2xl max-h-[800px]">
                                <div className="flex flex-col items-center h-full">
                                    <div className="flex flex-col justify-center">
                                        <div className="flex flex-row items-center">
                                            <p className="font-bold text-3xl pb-1">Opinie</p>

                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                 fill="gold"
                                                 viewBox="0 0 24 24" stroke-width="1.5"
                                                 stroke="currentColor" className="size-6 ml-3">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                      d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"/>
                                            </svg>

                                            <p>{reviews.average} ({reviews.count})</p>
                                        </div>

                                        <div className="bg-amber-900 rounded-md h-1 mb-3"></div>
                                    </div>

                                    {specialist?.reviews ?
                                        <div className="flex flex-col overflow-auto mt-3 w-full">
                                            {specialist?.reviews.map((r) => {
                                                return (
                                                    <>
                                                        <div
                                                            className="flex flex-col justify-center border-4 border-amber-900 text-center rounded-xl px-5 py-5 my-2 drop-shadow-lg">
                                                            <div className="flex flex-row items-center flex-wrap">
                                                                <p className="font-bold ">{r.client.name} {r.client.second_name[0]}.</p>

                                                                <div className="flex flex-row mx-3">
                                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                                         fill={r.rating >= 1 ? "gold" : "none"}
                                                                         viewBox="0 0 24 24" stroke-width="1.5"
                                                                         stroke="currentColor" className="size-6">
                                                                        <path stroke-linecap="round"
                                                                              stroke-linejoin="round"
                                                                              d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"/>
                                                                    </svg>
                                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                                         fill={r.rating >= 2 ? "gold" : "none"}
                                                                         viewBox="0 0 24 24" stroke-width="1.5"
                                                                         stroke="currentColor" className="size-6">
                                                                        <path stroke-linecap="round"
                                                                              stroke-linejoin="round"
                                                                              d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"/>
                                                                    </svg>
                                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                                         fill={r.rating >= 3 ? "gold" : "none"}
                                                                         viewBox="0 0 24 24" stroke-width="1.5"
                                                                         stroke="currentColor" className="size-6">
                                                                        <path stroke-linecap="round"
                                                                              stroke-linejoin="round"
                                                                              d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"/>
                                                                    </svg>
                                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                                         fill={r.rating >= 4 ? "gold" : "none"}
                                                                         viewBox="0 0 24 24" stroke-width="1.5"
                                                                         stroke="currentColor" className="size-6">
                                                                        <path stroke-linecap="round"
                                                                              stroke-linejoin="round"
                                                                              d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"/>
                                                                    </svg>
                                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                                         fill={r.rating === 5 ? "gold" : "none"}
                                                                         viewBox="0 0 24 24" stroke-width="1.5"
                                                                         stroke="currentColor" className="size-6">
                                                                        <path stroke-linecap="round"
                                                                              stroke-linejoin="round"
                                                                              d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"/>
                                                                    </svg>
                                                                </div>

                                                                <div className="grow">
                                                                    <p className="text-xl text-left">({r.created_at})</p>
                                                                </div>
                                                            </div>

                                                            <p className="text-left text-xl mt-1 font-medium">({r.specialist_service.name})</p>

                                                            <div className="bg-amber-900 rounded-md h-1 my-3"></div>

                                                            <p className="italic text-left">{r.description}</p>
                                                        </div>
                                                    </>
                                                )
                                            })}
                                        </div>
                                        :
                                        <div className="flex flex-col overflow-auto mt-3 w-full">
                                            <p>Brak opinii</p>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>

                        {/* calendar */}
                        <div className="w-2/3 ml-8 flex flex-col bg-white drop-shadow-lg p-6 my-4 rounded-2xl text-2xl">
                            <div className="flex flex-col items-center">
                                <div className="flex flex-col justify-center">
                                    <p className="font-bold text-3xl pb-1">Zarezerwuj usługę</p>
                                    <div className="bg-amber-900 rounded-md h-1 mb-3"></div>

                                    <p className="mb-5">
                                        Aby zarezerwować usługę, kliknij w interesującą cię datę, a następnie wybierz
                                        usługę
                                        i podaj szczegółowy jej opis w wyświetlonym na ekranie formularz.
                                    </p>
                                </div>

                                <div className="w-full">
                                    <Calendar
                                        culture={"pl"}
                                        localizer={localizer}
                                        events={visits}
                                        defaultView={Views.WEEK}
                                        step={15}
                                        views={[Views.WEEK]}
                                        min={new Date(0, 0, 0, 6, 0, 0)}
                                        max={new Date(0, 0, 0, 22, 0, 0)}
                                        onSelectSlot={handleSelectSlot}
                                        startAccessor={(event: VisitCalendar) => event.info.start_date}
                                        endAccessor={(event: VisitCalendar) => event.info.end_date}
                                        style={{
                                            height: (specialist?.reviews && specialist?.reviews.length! <= 2) ? 900 : 1300,
                                            fontSize: "x-large"
                                        }}
                                        messages={{
                                            previous: "Poprzedni",
                                            next: "Następny",
                                            today: "Dziś",
                                        }}
                                        eventPropGetter={eventBackgroundAdjustment}
                                        selectable={true}
                                        components={{
                                            event: EventComponent
                                        }}
                                        onSelectEvent={(event) => alert(event.service.name)}
                                        slotPropGetter={timeOffSlotAdjustment}
                                    />
                                </div>

                                <div className="flex flex-row mt-8 justify-between">
                                    <div className="flex flex-row items-center mr-6">
                                        <div className="bg-gray-300 rounded-lg h-8 w-8 min-h-8 min-w-8"></div>
                                        <p className="ml-2">- termin niedostępny</p>
                                    </div>

                                    <div className="flex flex-row items-center mr-6">
                                        <div className="bg-red-700 rounded-lg h-8 w-8 min-h-8 min-w-8"></div>
                                        <p className="ml-2">- usługa zarezerwowana</p>
                                    </div>

                                    <div className="flex flex-row items-center">
                                        <div className="bg-amber-600 rounded-lg h-8 w-8 min-h-8 min-w-8"></div>
                                        <p className="ml-2">- usługa niepotwierdzona</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {showRegisterWindow &&
                            createPortal(
                                <div className="flex flex-col items-center">
                                    <div className="flex flex-col justify-center">
                                        <p className="font-bold text-3xl pb-1">Zarezerwuj usługę</p>
                                        <div className="bg-amber-900 rounded-md h-1 mb-3"></div>
                                    </div>

                                    <div className="w-2/3 text-2xl">
                                        <div className="w-full py-2">
                                            <p className="font-bold pb-2 text-left">Data<sup>*</sup></p>

                                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pl">
                                                <DemoItem>
                                                    <DateTimePicker
                                                        defaultValue={dayjs(newVisit.start_date)}
                                                        ampm={false}
                                                        minutesStep={15}
                                                        minTime={dayjs().set('hour', 6).set('minute', 0)}
                                                        maxTime={dayjs().set('hour', 21).set('minute', 0)}
                                                        onChange={(value) => {
                                                            setNewVisit({
                                                                ...newVisit,
                                                                start_date: value!.toDate()
                                                            })
                                                            setDateError("")
                                                            setUniversalError("")
                                                            setSuccessMessage("")
                                                        }}
                                                    />
                                                </DemoItem>
                                            </LocalizationProvider>

                                            {dateError &&
                                                <div
                                                    className="italic text-red-500 drop-shadow-2xl font-bold text-lg text-center w-full h-7 mt-1 leading-none">
                                                    <p>{dateError}</p>
                                                </div>
                                            }
                                        </div>

                                        <div className="w-full py-2">
                                            <p className="font-bold text-left pb-2">Usługa<sup>*</sup></p>

                                            <select
                                                id="service_id"
                                                name="usługa"
                                                value={newVisit.specialist_service_id}
                                                onChange={(value) => {
                                                    setNewVisit({
                                                        ...newVisit,
                                                        specialist_service_id: parseInt(value.currentTarget.value)
                                                    })
                                                    setServiceError("")
                                                    setUniversalError("")
                                                    setSuccessMessage("")
                                                }}
                                                className={`w-full h-14 border-2 text-lg border-gray-300 rounded-md pl-2`}
                                            >
                                                <option value="" disabled={newVisit.specialist_service_id !== 0}>
                                                    Nazwa usługi
                                                </option>
                                                {specialist?.services!.map((option) => {
                                                    return (
                                                        <option
                                                            key={option.id}
                                                            value={option.id}
                                                        >
                                                            {option.name}
                                                        </option>
                                                    )
                                                })}
                                            </select>

                                            {serviceError &&
                                                <div
                                                    className="italic text-red-500 drop-shadow-2xl font-bold text-lg text-center w-full h-7 mt-1 leading-none">
                                                    <p>{serviceError}</p>
                                                </div>
                                            }
                                        </div>

                                        <div className="w-full py-2">
                                            <p className="font-bold text-left pb-2">Adres realizacji<sup>*</sup></p>

                                            <select
                                                id="client_address_id"
                                                name="adres"
                                                value={newVisit.client_address_id}
                                                onChange={(value) => {
                                                    setNewVisit({
                                                        ...newVisit,
                                                        client_address_id: parseInt(value.currentTarget.value)
                                                    })
                                                    setClientAddressError("")
                                                    setUniversalError("")
                                                    setSuccessMessage("")
                                                }}
                                                className={`w-full h-14 border-2 text-lg border-gray-300 rounded-md pl-2`}
                                            >
                                                <option value="" disabled={newVisit.client_address_id !== 0}>
                                                    Adres
                                                </option>
                                                {clientAddresses!.map((address) => {
                                                    return (
                                                        <>
                                                            {address.flat_nr === 0 ?
                                                                <option
                                                                    key={address.id}
                                                                    value={address.id}
                                                                >
                                                                    {address.city.name},
                                                                    ul. {address.street} {address.building_nr}
                                                                </option>
                                                                :
                                                                <option
                                                                    key={address.id}
                                                                    value={address.id}
                                                                >
                                                                    {address.city.name},
                                                                    ul. {address.street} {address.building_nr}/{address.flat_nr}
                                                                </option>
                                                            }
                                                        </>
                                                    )
                                                })}
                                            </select>

                                            {clientAddressError &&
                                                <div
                                                    className="italic text-red-500 drop-shadow-2xl font-bold text-lg text-center w-full h-7 mt-1 leading-none">
                                                    <p>{clientAddressError}</p>
                                                </div>
                                            }
                                        </div>

                                        <div className="w-full pt-2">
                                            <p className="font-bold text-left pb-2">Opis usługi<sup>*</sup></p>

                                            <textarea
                                                id="description"
                                                name="description"
                                                placeholder="Opis usługi"
                                                value={newVisit.description}
                                                onChange={(value) => {
                                                    setNewVisit({
                                                        ...newVisit,
                                                        description: value.currentTarget.value
                                                    })
                                                    setDescriptionError("")
                                                    setUniversalError("")
                                                    setSuccessMessage("")
                                                }}
                                                rows={6}
                                                cols={40}
                                                className={`w-full border-2 text-lg border-gray-300 rounded-md p-3`}
                                            />

                                            {descriptionError &&
                                                <div
                                                    className="italic text-red-500 drop-shadow-2xl font-bold text-lg text-center w-full h-7 mt-1 leading-none">
                                                    <p>{descriptionError}</p>
                                                </div>
                                            }
                                        </div>

                                        <div className="flex flex-row justify-evenly mt-5">
                                            <div onClick={() => Swal.close()}
                                                 className="border-4 border-amber-900 text-white rounded-2xl cursor-pointer p-2 transition ease-in-out delay-0 bg-amber-900 hover:border-amber-900 hover:bg-white hover:text-amber-900 duration-300 ...">
                                                <span className="mx-3 my-2 text-xl">Anuluj</span>
                                            </div>

                                            <div onClick={createVisit}
                                                 className="border-4 border-amber-900 text-white rounded-2xl cursor-pointer p-2 transition ease-in-out delay-0 bg-amber-900 hover:border-amber-900 hover:bg-white hover:text-amber-900 duration-300 ...">
                                                <span className="mx-3 my-2 text-xl">Zarezerwuj</span>
                                            </div>
                                        </div>

                                        {successMessage &&
                                            <div className="mt-5 drop-shadow-xl text-xl font-bold text-green-500">
                                                <p>{successMessage}</p>
                                            </div>
                                        }

                                        {universalError &&
                                            <div className="mt-5 drop-shadow-xl text-xl font-bold text-red-500">
                                                <p>{universalError}</p>
                                            </div>
                                        }
                                    </div>
                                </div>,
                                Swal.getHtmlContainer()!,
                            )
                        }

                        {showErrorWindow &&
                            createPortal(
                                <div className="flex flex-col items-center">
                                    <div className="flex flex-col justify-center">
                                        <p className="font-bold text-3xl pb-1">Błąd</p>
                                        <div className="bg-amber-900 rounded-md h-1 mb-3"></div>
                                    </div>

                                    <div className="flex flex-col items-end w-4/5 mt-3 mb-5">
                                        {universalError !== "" &&
                                            <p className="text-xl">{universalError}</p>
                                        }

                                        {loginError !== "" &&
                                            <p className="text-xl">{loginError}</p>
                                        }
                                    </div>

                                    {universalError !== "" &&
                                        <div onClick={() => Swal.close()}
                                             className="border-4 border-amber-900 text-white rounded-2xl cursor-pointer p-2 transition ease-in-out delay-0 bg-amber-900 hover:border-amber-900 hover:bg-white hover:text-amber-900 duration-300 ...">
                                            <span className="mx-3 my-2 text-xl">Ok</span>
                                        </div>
                                    }

                                    {loginError !== "" &&
                                        <div className="flex flex-row items-center p-2">
                                            <Link to="/klient/login" onClick={() => Swal.close()}
                                                  className="mx-2 border-4 border-amber-600 text-white rounded-2xl cursor-pointer p-2 transition ease-in-out delay-0 bg-amber-600 hover:border-amber-600 hover:bg-white hover:text-amber-900 duration-300 ...">
                                                <span className="mx-3 my-2 text-xl">Zaloguj</span>
                                            </Link>

                                            <Link to="/klient/rejestracja" onClick={() => Swal.close()}
                                                  className="mx-2 border-4 border-amber-900 text-white rounded-2xl cursor-pointer p-2 transition ease-in-out delay-0 bg-amber-900 hover:border-amber-900 hover:bg-white hover:text-amber-900 duration-300 ...">
                                                <span className="mx-3 my-2 text-xl">Zarejestruj</span>
                                            </Link>

                                            <div onClick={() => Swal.close()}
                                                 className="mx-2 border-4 border-red-700 text-white rounded-2xl cursor-pointer p-2 transition ease-in-out delay-0 bg-red-700 hover:border-red-700 hover:bg-white hover:text-amber-900 duration-300 ...">
                                                <span className="mx-3 my-2 text-xl">Anuluj</span>
                                            </div>
                                        </div>
                                    }
                                </div>,
                                Swal.getHtmlContainer()!,
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}


const locales = {
    pl: pl,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const EventComponent = ({event}: { event: VisitCalendar }) => (
    <div className="flex flex-col items-center justify-items-center justify-center text-center my-4">
        <p className="break-all drop-shadow-lg">{event.service.name}</p>
    </div>
);
export default SpecialistProfile