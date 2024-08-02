import {useNavigate, useOutletContext} from "react-router-dom";
import {AuthContextType} from "../../App";
import React, {useEffect, useState} from "react";
import CalendarForVisits from "../../components/CalendarForVisits";
import {Views} from "react-big-calendar";
import {createPortal} from "react-dom";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DemoItem} from "@mui/x-date-pickers/internals/demo";
import {DateTimePicker} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import {VisitCalendar} from "../../models/Visit";
import cloneDeep from "lodash/cloneDeep";
import {Client} from "../../models/Client";

function ClientReservations() {
    const {jwtToken, userRole} = useOutletContext<AuthContextType>();
    const navigate = useNavigate()

    const [client, setClient] = useState<Client>()
    const [visits, setVisits] = useState<VisitCalendar[]>([])
    const [selectedVisit, setSelectedVisit] = useState<VisitCalendar>()
    const [showVisitWindow, setShowVisitWindow] = useState(false)
    const [universalError, setUniversalError] = useState("")
    const [dateError, setDateError] = useState("")
    const [priceError, setPriceError] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const [info, setInfo] = useState("")

    useEffect(() => {
        if (jwtToken === "" && userRole !== "client") {
            navigate("/wybor_konta")
            return
        }

        const spec = sessionStorage.getItem(userRole)
        if (spec) {
            var s = JSON.parse(spec)
            setClient(s)
        }
    }, [jwtToken, userRole, navigate])

    useEffect(() => {
        if (client) {
            console.log(client)

            const headers = new Headers()
            headers.append("Content-Type", "application/json")
            const requestOptions = {
                method: "GET",
                headers: headers,
            }

            fetch(`http://localhost:8080/visits/0/${client!.id}`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    data.forEach((v: VisitCalendar) => {
                        v.info.start_date = new Date(v.info.start_date)
                        v.info.end_date = new Date(v.info.end_date)
                    })

                    setVisits(data)
                })
                .catch(err => {
                    console.log("Error retrieving Visits: ", err)
                })


        }
    }, [client, jwtToken]);

    const eventBackgroundAdjustment = (event: VisitCalendar): React.CSSProperties => {
        let backgroundColor = 'Maroon';

        if (event.info.status === 'accepted') {
            backgroundColor = 'DarkGreen';
        } else if (event.info.status === 'specialist_action_required') {
            backgroundColor = 'DarkSeaGreen';
        } else if (event.info.status === 'client_action_required') {
            backgroundColor = 'DarkGoldenRod';
        } else if (event.info.status === 'declined') {
            backgroundColor = 'FireBrick';
        }

        return {backgroundColor};
    };

    const isDateFromFuture = (date: Date): boolean => {
        const currentDate = new Date();
        return date >= currentDate;
    }

    function isNewTimeOverlappingVisits(start: Date, end: Date, visitId=0) {
        const newStartDate = start.getTime()
        const newEndDate = end.getTime()

        for (let i = 0; i < visits.length; i++) {
            if ((visitId !== 0 && (visitId === visits[i].info.id)) || visits[i].info.status === "declined") {
                continue
            }
            const startDate = new Date(visits[i].info.start_date).getTime()
            const endDate = new Date(visits[i].info.end_date).getTime()

            if (isNewDateOverlappingExistingCheck(newStartDate, newEndDate, startDate, endDate)) {
                return true
            }
        }
        return false
    }

    function isNewDateOverlappingExistingCheck(newStartDate: number, newEndDate: number, startDate: number, endDate: number) {
        if (
            (newStartDate < startDate && (newEndDate > startDate && newEndDate < endDate)) ||
            (newStartDate < startDate && newEndDate === endDate) ||
            (newStartDate < startDate && newEndDate > endDate) ||
            (newStartDate === startDate && (newEndDate > startDate && newEndDate < endDate)) ||
            (newStartDate === startDate && newEndDate > endDate) ||
            ((newStartDate > startDate && newStartDate < endDate) && newEndDate === endDate) ||
            ((newStartDate > startDate && newStartDate < endDate) && newEndDate > endDate) ||
            ((newStartDate > startDate && newStartDate < endDate) && (newEndDate > startDate && newEndDate < endDate)) ||
            (newStartDate === startDate && newEndDate === endDate)
        ) {
            return true
        }

        return false
    }

    const selectVisit = (visit: VisitCalendar) => {
        setSelectedVisit(visit)

        if (visit.info.status === 'declined') {
            setInfo("Wybrana wizyta została już anulowana.")

            Swal.fire({
                customClass: 'swal-wide',
                didOpen: () => setShowVisitWindow(true),
                didClose: () => {
                    setShowVisitWindow(false)
                    setDateError("")
                    setInfo("")
                    setSuccessMessage("")
                    setUniversalError("")
                },
                showConfirmButton: false,
            })
        } else if (visit.info.status === 'client_action_required') {
            setInfo("Wybrana wizyta wymaga działania po stronie klienta.")

            Swal.fire({
                customClass: 'swal-wide',
                didOpen: () => setShowVisitWindow(true),
                didClose: () => {
                    setShowVisitWindow(false)
                    setInfo("")
                    setDateError("")
                    setUniversalError("")
                    setSuccessMessage("")
                },
                showConfirmButton: false,
            })
        } else if (visit.info.status === 'specialist_action_required') {
            setInfo("Wybrana wizyta wymaga działania - zaproponuj zmiany, zaakceptuj bądź odrzuć wizytę.")

            Swal.fire({
                customClass: 'swal-wide',
                didOpen: () => setShowVisitWindow(true),
                didClose: () => {
                    setShowVisitWindow(false)
                    setInfo("")
                    setDateError("")
                    setUniversalError("")
                    setSuccessMessage("")
                },
                showConfirmButton: false,
            })
        } else if (visit.info.status === 'accepted') {
            setInfo("Wybrana wizyta została już zaakceptowana.")

            Swal.fire({
                customClass: 'swal-wide',
                didOpen: () => setShowVisitWindow(true),
                didClose: () => {
                    setShowVisitWindow(false)
                    setInfo("")
                    setDateError("")
                    setUniversalError("")
                    setSuccessMessage("")
                },
                showConfirmButton: false,
            })
        }
    }

    const changeVisitStatus = (status: string) => {
        const updatedVisit = cloneDeep(selectedVisit!)
        updatedVisit!.info.status = status

        if (status === 'declined') {
            updateVisit(updatedVisit, 'declined', "Pomyślnie odrzucono wizytę")
        } else if (status === 'accepted') {
            updateVisit(updatedVisit, 'accepted', "Pomyślnie zaakceptowano wizytę")
        }
    }

    function updateVisit(visit: VisitCalendar, newStatus: string, message: string){
        setSuccessMessage("")
        setUniversalError("")

        const headers = new Headers()
        headers.append("Content-Type", "application/json")
        headers.append("Authorization", "Bearer " + jwtToken)
        const method = "PATCH"

        // fetch(`/specialist/update_visit`, {
        //     body: JSON.stringify(visit),
        //     method: method,
        //     headers: headers,
        //     credentials: 'include'
        // })
        //     .then((response) => response.json())
        //     .then((data) => {
        //         if (data.error) {
        //             console.log("ERRORS")
        //             setUniversalError(data.message)
        //         } else {
        //             console.log("SUCCESSFULLY UPDATED VISIT")
        //             setSuccessMessage(message)
        //
        //             if (!data.error && selectedVisit){
        //                 setSelectedVisit({
        //                     ...selectedVisit,
        //                     info: {
        //                         ...selectedVisit?.info,
        //                         status: newStatus
        //                     }
        //                 })
        //             }
        //
        //             getVisits()
        //         }
        //     })
        //     .catch((err) => {
        //         console.log(err)
        //     })
    }

    const modifyVisit = () =>{
        if (!isDateFromFuture(selectedVisit!.info.start_date)){
            setDateError("Data rozpoczęcia jest datą przeszłą")
            return;
        }

        if (!isDateFromFuture(selectedVisit!.info.end_date)){
            setDateError("Data rozpoczęcia jest datą przeszłą")
            return;
        }

        if (selectedVisit!.info.start_date.getTime() > selectedVisit!.info.end_date.getTime()) {
            setDateError("Data zakończenia nie może być datą wcześniejszą niż data rozpoczęcia")
            return;
        }

        if (selectedVisit!.info.start_date.getTime() === selectedVisit!.info.end_date.getTime()) {
            setDateError("Data rozpoczęcia i data zakończenia nie mogą być takie same")
            return;
        }

        if (selectedVisit!.info.start_date.getDate() !== selectedVisit!.info.end_date.getDate()){
            setDateError("Dzień rozpoczęcia i zakończenia różnią się")
            return;
        }

        if (isNewTimeOverlappingVisits(selectedVisit!.info.start_date, selectedVisit!.info.end_date, selectedVisit!.info.id)) {
            setDateError("Wybrany przedział czasowy nakłada się z istniejącą wizytą. Wybierz inny termin lub " +
                "zmodyfikuj wizytę.")
            return;
        }

        if (selectedVisit!.info.price <= 0) {
            setPriceError("Szacowana cena musi być wartością większą od zera")
            return;
        }

        const updatedVisit = cloneDeep(selectedVisit!)
        updatedVisit!.info.status = 'client_action_required'
        updateVisit(updatedVisit, 'client_action_required', "Pomyślnie zaktualizowano wizytę")
    }

    return (
        <div className="flex flex-col items-center overflow-auto h-full bg-fixed fixed w-full pb-32">
            <div className="w-2/3">
                <div className="flex flex-col text-center pt-8">
                    <div className="flex flex-row text-3xl font-bold mb-6 justify-center">
                        <h1>Kalendarz rezerwacji usług</h1>
                    </div>

                    <p className="mb-6 text-2xl">
                        Poniżej znajduje się kalendarz zarezerwowanych przez ciebie usług. Wizyty potwierdzone, odrzucone oraz
                        te oczekujące na akcje, zaznaczone są określonym kolorem (patrz legenda poniżej). Aby wyświetlić szczegóły
                        wizyty, kliknij w nią. W celu potwierdzenia, modyfikacji lub odrzucenia rezerwacji, wypełnij formularz
                        wyświetlony po kliknięciu w daną pozycję.
                    </p>

                    <div className="bg-amber-900 rounded-md h-1 mb-3"></div>
                </div>

                <div>
                    <div className="bg-white drop-shadow-lg pt-6 pl-6 pr-6 pb-4 mt-3 mb-8 rounded-2xl">
                        <div>
                            <p className="text-2xl font-bold">Legenda</p>
                        </div>
                        <div className="flex flex-row flex-wrap mt-5 justify-center justify-items-center items-center">
                            <div className="flex flex-row items-center mr-6 mb-3">
                                <div className="bg-green-800 rounded-lg h-8 w-8 min-h-8 min-w-8"></div>
                                <p className="ml-2">- usługa potwierdzona</p>
                            </div>

                            <div className="flex flex-row items-center mr-6 mb-3">
                                <div className=" bg-yellow-600 rounded-lg h-8 w-8 min-h-8 min-w-8"></div>
                                <p className="ml-2">- wymaga użytkownika</p>
                            </div>

                            <div className="flex flex-row items-center mr-6 mb-3">
                                <div className="bg-lime-500 rounded-lg h-8 w-8 min-h-8 min-w-8"></div>
                                <p className="ml-2">- wymaga akcji specjalisty</p>
                            </div>

                            <div className="flex flex-row items-center mb-3">
                                <div className="bg-red-700 rounded-lg h-8 w-8 min-h-8 min-w-8"></div>
                                <p className="ml-2">- odrzucona</p>
                            </div>
                        </div>
                    </div>

                    <CalendarForVisits
                        events={visits}
                        handleSelectSlot={() => null}
                        style={{
                            height: 1500,
                            fontSize: "x-large"
                        }}
                        eventBackgroundAdjustment={eventBackgroundAdjustment}
                        selectable={false}
                        views={[Views.DAY, Views.WEEK, Views.MONTH]}
                        EventComponent={EventComponent}
                        onSelectEvent={(event) => selectVisit(event)}
                        timeOffSlotAdjustment={() => {return {}}}
                    />
                </div>
            </div>

            {showVisitWindow &&
                createPortal(
                    <div className="flex flex-col items-center justify-center">
                        <div className="flex flex-col justify-center">
                            <p className="font-bold text-3xl pb-1">Wizyta</p>
                            <div className="bg-amber-900 rounded-md h-1 mb-3"></div>
                        </div>

                        {info !== "" &&
                            <div className="w-full">
                                <div className="text-2xl">
                                    <p>{info}</p>
                                </div>

                                <div className="bg-amber-900 rounded-md h-1 my-3"></div>
                            </div>
                        }

                        <p className="font-bold text-left w-full">Klient</p>

                        <div className="bg-white drop-shadow-lg my-3 rounded-2xl w-full py-4">
                            <div className="flex flex-col items-center">
                                <div className="flex flex-col justify-center">
                                    <p className="font-bold text-2xl pb-1">{selectedVisit?.client.name} {selectedVisit?.client.second_name}</p>
                                    <div className="bg-amber-900 rounded-md h-1 mb-3"></div>
                                </div>

                                {/* contact info */}
                                <div className="flex flex-col items-center w-full font-extrabold">
                                    <div className="flex flex-row py-1 items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                             stroke-width="1.5" stroke="currentColor" className="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                  d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"/>
                                        </svg>
                                        <p className="pl-3 font-bold break-all">{selectedVisit?.client.email}</p>
                                    </div>

                                    <div className="flex flex-row py-1 items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                             stroke-width="1.5" stroke="currentColor" className="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                  d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"/>
                                        </svg>
                                        {selectedVisit!.info.client_address.flat_nr !== 0 ?
                                            <p className="pl-3 font-bold break-all">{selectedVisit!.info.client_address.city.name},
                                                ul. {selectedVisit!.info.client_address.street} {selectedVisit!.info.client_address.building_nr}/{selectedVisit!.info.client_address.flat_nr}</p>
                                            :
                                            <p className="pl-3 font-bold break-all">{selectedVisit!.info.client_address.city.name},
                                                ul. {selectedVisit!.info.client_address.street} {selectedVisit!.info.client_address.building_nr}</p>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full">
                            <div className="flex flex-row py-2">
                                <div className="w-1/2 pr-2">
                                    <p className="font-bold pb-2 text-left">Data rozpoczęcia<sup>*</sup></p>

                                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pl">
                                        <DemoItem>
                                            <DateTimePicker
                                                defaultValue={dayjs(selectedVisit!.info.start_date)}
                                                disabled={selectedVisit!.info.status === 'accepted' || selectedVisit!.info.status === 'declined' || selectedVisit!.info.status === 'client_action_required'}
                                                ampm={false}
                                                minutesStep={15}
                                                minTime={dayjs().set('hour', 6).set('minute', 0)}
                                                maxTime={dayjs().set('hour', 22).set('minute', 0)}
                                                onChange={(value) => {
                                                    if (selectedVisit) {
                                                        setSelectedVisit({
                                                            ...selectedVisit,
                                                            info: {
                                                                ...selectedVisit?.info,
                                                                start_date: value!.toDate()
                                                            }
                                                        })
                                                    }
                                                    setDateError("")
                                                    setSuccessMessage("")
                                                    setUniversalError("")
                                                }}
                                            />
                                        </DemoItem>
                                    </LocalizationProvider>
                                </div>

                                <div className="w-1/2 pl-2">
                                    <p className="font-bold pb-2 text-left">Data zakończenia<sup>*</sup></p>

                                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pl">
                                        <DemoItem>
                                            <DateTimePicker
                                                defaultValue={dayjs(selectedVisit!.info.end_date)}
                                                disabled={selectedVisit!.info.status === 'accepted' || selectedVisit!.info.status === 'declined' || selectedVisit!.info.status === 'client_action_required'}
                                                ampm={false}
                                                minutesStep={15}
                                                minTime={dayjs().set('hour', 6).set('minute', 0)}
                                                maxTime={dayjs().set('hour', 22).set('minute', 0)}
                                                onChange={(value) => {
                                                    if (selectedVisit) {
                                                        setSelectedVisit({
                                                            ...selectedVisit,
                                                            info: {
                                                                ...selectedVisit?.info,
                                                                end_date: value!.toDate()
                                                            }
                                                        })
                                                    }
                                                    setDateError("")
                                                    setUniversalError("")
                                                    setSuccessMessage("")
                                                }}
                                            />
                                        </DemoItem>
                                    </LocalizationProvider>
                                </div>
                            </div>

                            {dateError &&
                                <div
                                    className="italic text-red-500 drop-shadow-2xl font-bold text-lg text-center w-full mb-2 leading-none">
                                    <p>{dateError}</p>
                                </div>
                            }

                            <div className="w-full py-2">
                                <p className="font-bold pb-2 text-left">Usługa<sup>*</sup></p>

                                <select
                                    id="client_address_id"
                                    disabled={true}
                                    name="adres"
                                    className={`w-full h-14 border-2 text-lg border-gray-300 rounded-md pl-2`}
                                >
                                    <option value="">
                                        {selectedVisit!.service.name}
                                    </option>
                                </select>
                            </div>

                            <div className="w-full py-2">
                                <p className="font-bold pb-2 text-left">Szacowana cena<sup>*</sup></p>

                                <input
                                    type="number"
                                    id="price"
                                    disabled={selectedVisit!.info.status === 'accepted' || selectedVisit!.info.status === 'declined' || selectedVisit!.info.status === 'client_action_required'}
                                    placeholder={"Cena realizacji usługi"}
                                    value={0 || selectedVisit!.info.price}
                                    className={`w-full h-14 border-2 text-lg border-gray-300 rounded-md pl-2`}
                                    onChange={(value) => {
                                        setPriceError("")
                                        setSuccessMessage("")

                                        if (selectedVisit) {
                                            setSelectedVisit({
                                                ...selectedVisit,
                                                info: {
                                                    ...selectedVisit.info,
                                                    price: parseInt(value.target.value, 10)
                                                }
                                            })
                                        }
                                    }}
                                />
                            </div>

                            {priceError &&
                                <div
                                    className="italic text-red-500 drop-shadow-2xl font-bold text-lg text-center w-full mb-2 leading-none">
                                    <p>{priceError}</p>
                                </div>
                            }

                            <div className="w-full py-2">
                                <p className="font-bold text-left pb-2">Opis usługi<sup>*</sup></p>

                                <textarea
                                    id="description"
                                    name="description"
                                    disabled={true}
                                    placeholder="Opis usługi"
                                    value={selectedVisit?.info.description}
                                    rows={6}
                                    cols={40}
                                    className={`w-full border-2 text-lg border-gray-300 rounded-md p-3`}
                                />
                            </div>
                        </div>

                        <div className="flex flex-row justify-evenly mt-5 font-medium">
                            <div onClick={() => Swal.close()}
                                 className="border-4 border-amber-900 text-white rounded-2xl cursor-pointer p-2 transition ease-in-out delay-0 bg-amber-900 hover:border-amber-900 hover:bg-white hover:text-amber-900 duration-300 ...">
                                <span className="mx-3 my-2 text-xl">Anuluj</span>
                            </div>

                            {selectedVisit?.info.status !== "declined" &&
                                <div onClick={() => changeVisitStatus("declined")}
                                     className="ml-2 border-4 border-red-700 text-red-700 rounded-2xl cursor-pointer p-2 transition ease-in-out delay-0 bg-white hover:border-red-700 hover:bg-red-700 hover:text-white duration-300 ...">
                                    <span className="mx-3 my-2 text-xl">Odrzuć</span>
                                </div>
                            }

                            {selectedVisit?.info.status === "specialist_action_required" &&
                                <>
                                    <div onClick={() => changeVisitStatus("accepted")}
                                         className="ml-2 border-4 border-green-700 text-green-700 rounded-2xl cursor-pointer p-2 transition ease-in-out delay-0 bg-white hover:border-green-700 hover:bg-green-700 hover:text-white duration-300 ...">
                                        <span className="mx-3 my-2 text-xl">Zaakceptuj</span>
                                    </div>

                                    <div onClick={() => modifyVisit()}
                                         className="ml-2 border-4 border-yellow-500 text-yellow-500 rounded-2xl cursor-pointer p-2 transition ease-in-out delay-0 bg-white hover:border-yellow-500 hover:bg-yellow-500 hover:text-white duration-300 ...">
                                        <span className="mx-3 my-2 text-xl">Zmodyfikuj</span>
                                    </div>
                                </>
                            }
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
                    ,
                    Swal.getHtmlContainer()!,
                )
            }
        </div>
    )
}

const EventComponent = ({event}: { event: VisitCalendar }) => (
    <div className="flex flex-col items-center justify-items-center justify-center text-center my-4">
        {event.info.status === 'declined' ?
            <p className="break-all drop-shadow-lg line-through">{event.service.name}</p>
            :
            <p className="break-all drop-shadow-lg">{event.service.name}</p>
        }
    </div>
);

export default ClientReservations