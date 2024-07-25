import {Link, useNavigate, useOutletContext} from "react-router-dom";
import {AuthContextType} from "../../App";
import React, {useEffect, useState} from "react";
import CalendarForVisits from "../../components/CalendarForVisits";
import {VisitCalendar} from "../../models/Visit";
import {TimeOff, TimeOffRequest} from "../../models/TimeOff";
import {Specialist} from "../../models/Specialist";
import Swal from "sweetalert2";
import {createPortal} from "react-dom";
import {Views} from "react-big-calendar";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DemoItem} from "@mui/x-date-pickers/internals/demo";
import {DateTimePicker} from "@mui/x-date-pickers";
import dayjs from "dayjs";

function SpecialistReservations() {
    const {jwtToken, userRole} = useOutletContext<AuthContextType>();
    const navigate = useNavigate()

    const [showTimeOffWindow, setShowTimeOffWindow] = useState(false)
    const [showVisitWindow, setShowVisitWindow] = useState(false)
    const [showInfoWindow, setShowInfoWindow] = useState(false)
    const [showErrorWindow, setShowErrorWindow] = useState(false)
    const [universalError, setUniversalError] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const [info, setInfo] = useState("")

    const [timeOffs, setTimeOffs] = useState<TimeOff[]>([])
    const [specialist, setSpecialist] = useState<Specialist>()
    const [visits, setVisits] = useState<VisitCalendar[]>([])
    const [selectedVisit, setSelectedVisit] = useState<VisitCalendar>()
    const [newTimeOff, setNewTimeOff] = useState<TimeOffRequest>({
        start_date: new Date(),
        end_date: new Date(),
        specialist_id: 0
    })

    useEffect(() => {
        if (jwtToken === "" && userRole !== "specialist") {
            navigate("/wybor_konta")
            return
        }

        const spec = sessionStorage.getItem(userRole)
        if (spec) {
            var s = JSON.parse(spec)
            setSpecialist(s)
        }
    }, [jwtToken, userRole, navigate])

    useEffect(() => {
        if (specialist) {
            const headers = new Headers()
            headers.append("Content-Type", "application/json")
            const requestOptions = {
                method: "GET",
                headers: headers,
            }

            getTimeOff(specialist!.id)

            fetch(`http://localhost:8080/visits/${specialist!.id}/0`, requestOptions)
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


    }, [specialist, jwtToken]);

    function getTimeOff(specialistId: number) {
        const headers = new Headers()
        headers.append("Content-Type", "application/json")
        const requestOptions = {
            method: "GET",
            headers: headers,
        }

        fetch(`http://localhost:8080/time_off/${specialistId}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setTimeOffs(data)
            })
            .catch(err => {
                console.log("Error retrieving TimeOff: ", err)
            })
    }

    const handleSelectSlot = ({start, end}: { start: Date, end: Date }) => {
        if (!isDateFromFuture(start)) {
            console.log("date is from present")
            setUniversalError("Wybrany przedział czasowy jest terminem z przeszłości.")

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

        if (areTimeOffsOverlapping(start, end)) {
            console.log("timeOffs overlapping")
            setUniversalError("Wybrany przedział czasowy nakłada się z istniejącym już urlopem.")

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

        if (isTimeOffOverlappingVisit(start, end)) {
            console.log("timeOff overlapps visit")
            setUniversalError("Wybrany przedział czasowy nakłada się z istniejącą wizytą. Wybierz inny termin lub " +
                "zmodyfikuj wizytę.")

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

        setNewTimeOff({
            ...newTimeOff,
            start_date: start,
            end_date: end,
            specialist_id: specialist!.id,
        })

        Swal.fire({
            didOpen: () => setShowTimeOffWindow(true),
            didClose: () => {
                setShowTimeOffWindow(false)
                setUniversalError("")
                setSuccessMessage("")
            },
            showConfirmButton: false,
        })
    }

    const eventBackgroundAdjustment = (event: VisitCalendar): React.CSSProperties => {
        let backgroundColor = 'Maroon';

        if (event.info.status === 'accepted') {
            backgroundColor = 'DarkGreen';
        } else if (event.info.status === 'specialist_action_required') {
            backgroundColor = 'DarkSeaGreen';
        } else if (event.info.status === 'client_action_required') {
            backgroundColor = 'LightCoral';
        } else if (event.info.status === 'declined') {
            backgroundColor = 'FireBrick';
        }

        return {backgroundColor};
    };

    const isDateAvailable = (date: Date): boolean => {
        if (!timeOffs) {
            return true
        }
        return !timeOffs.some(off => {
            const start = new Date(off.start_date);
            const end = new Date(off.end_date);
            return date >= start && date < end;
        });
    };

    const isDateFromFuture = (date: Date): boolean => {
        const currentDate = new Date();
        return date >= currentDate;
    }

    const timeOffSlotAdjustment = (date: Date) => {
        if (!isDateAvailable(date)) {
            return {style: {backgroundColor: 'lightgray', border: 'none'}};
        }
        return {};
    }

    const selectVisit = (visit: VisitCalendar) => {
        setSelectedVisit(visit)

        console.log(visit.info.status)

        if (visit.info.status === 'declined') {
            setInfo("Wybrana wizyta została już anulowana")

            Swal.fire({
                didOpen: () => setShowInfoWindow(true),
                didClose: () => {
                    setShowInfoWindow(false)
                    setInfo("")
                },
                showConfirmButton: false,
            })
        } else if (visit.info.status === 'client_action_required') {
            setInfo("Wybrana wizyta wymaga działania po stronie klienta")

            Swal.fire({
                didOpen: () => setShowInfoWindow(true),
                didClose: () => {
                    setShowInfoWindow(false)
                    setInfo("")
                },
                showConfirmButton: false,
            })
        } else if (visit.info.status === 'specialist_action_required') {
            Swal.fire({
                didOpen: () => setShowVisitWindow(true),
                didClose: () => {
                    setShowVisitWindow(false)
                },
                showConfirmButton: false,
            })
        } else if (visit.info.status === 'accepted') {
            setInfo("Wybrana wizyta została już zaakceptowana")

            Swal.fire({
                didOpen: () => setShowInfoWindow(true),
                didClose: () => {
                    setShowInfoWindow(false)
                    setInfo("")
                },
                showConfirmButton: false,
            })
        }
    }

    function areTimeOffsOverlapping(start: Date, end: Date) {
        const newStartDate = start.getTime()
        const newEndDate = end.getTime()

        for (let i = 0; i < timeOffs.length; i++) {
            const startDate = new Date(timeOffs[i].start_date).getTime()
            const endDate = new Date(timeOffs[i].end_date).getTime()

            if (isTimeOffOverlappingCheck(newStartDate, newEndDate, startDate, endDate)) {
                return true
            }
        }
        return false
    }

    function isTimeOffOverlappingVisit(start: Date, end: Date) {
        const newStartDate = start.getTime()
        const newEndDate = end.getTime()

        for (let i = 0; i < visits.length; i++) {
            const startDate = new Date(visits[i].info.start_date).getTime()
            const endDate = new Date(visits[i].info.end_date).getTime()

            if (isTimeOffOverlappingCheck(newStartDate, newEndDate, startDate, endDate)) {
                return true
            }
        }
        return false
    }

    function isTimeOffOverlappingCheck(newStartDate: number, newEndDate: number, startDate: number, endDate: number) {
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

    const createTimeOff = () => {
        if (!isDateFromFuture(newTimeOff.start_date)) {
            console.log("date is from present")
            setUniversalError("Wybrany przedział czasowy jest terminem z przeszłości.")
            return;
        }

        if (areTimeOffsOverlapping(newTimeOff.start_date, newTimeOff.end_date)) {
            console.log("timeOffs overlapping")
            setUniversalError("Wybrany przedział czasowy nakłada się z istniejącym już urlopem.")
            return;
        }

        if (isTimeOffOverlappingVisit(newTimeOff.start_date, newTimeOff.end_date)) {
            console.log("timeOff overlapps visit")
            setUniversalError("Wybrany przedział czasowy nakłada się z istniejącą wizytą. Wybierz inny termin lub " +
                "zmodyfikuj wizytę.")
            return;
        }

        const headers = new Headers()
        headers.append("Content-Type", "application/json")
        headers.append("Authorization", "Bearer " + jwtToken)
        const method = "POST"

        fetch(`/specialist/create_time_off`, {
            body: JSON.stringify(newTimeOff),
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
                    console.log("SUCCESSFULLY CREATED TIMEOFF")
                    setSuccessMessage("Pomyślnie utworzono urlop")
                    getTimeOff(specialist!.id)
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return (
        <div className="flex flex-col items-center overflow-auto h-full bg-fixed fixed w-full pb-32">
            <div className="w-2/3">
                <div className="flex flex-col text-center pt-8">
                    <div className="flex flex-row text-3xl font-bold mb-6 justify-center">
                        <h1>Kalendarz rezerwacji usług</h1>
                    </div>

                    <p className="mb-6 text-2xl">
                        Poniżej znajduje się kalendarz usług zarezerwowanych przez klientów. Wizyty potwierdzone,
                        oraz te oczekujące na akcje zaznaczone są określonym kolorem (patrz legenda poniżej). Aby
                        potwierdzić,
                        zmodyfikować lub odrzucić daną rezerwację, kliknij w nią i wypełnij formularz wyświetlony na
                        ekranie.
                    </p>

                    <div className="bg-amber-900 rounded-md h-1 mb-3"></div>
                </div>

                <div>
                    <div className="bg-white drop-shadow-lg pt-6 pl-6 pr-6 pb-4 mt-3 mb-8 rounded-2xl">
                        <div>
                            <p className="text-2xl font-bold">Legenda</p>
                        </div>
                        <div className="flex flex-row flex-wrap mt-5 justify-center justify-items-center items-center">
                            <div className="flex flex-row items-center mr-6">
                                <div className="bg-gray-300 rounded-lg h-8 w-8 min-h-8 min-w-8"></div>
                                <p className="ml-2">- termin niedostępny</p>
                            </div>

                            <div className="flex flex-row items-center mr-6 mb-3">
                                <div className="bg-green-800 rounded-lg h-8 w-8 min-h-8 min-w-8"></div>
                                <p className="ml-2">- usługa potwierdzona</p>
                            </div>

                            <div className="flex flex-row items-center mr-6 mb-3">
                                <div className="bg-pink-400 rounded-lg h-8 w-8 min-h-8 min-w-8"></div>
                                <p className="ml-2">- wymaga akceptacji użytkownika</p>
                            </div>

                            <div className="flex flex-row items-center mr-6 mb-3">
                                <div className="bg-lime-500 rounded-lg h-8 w-8 min-h-8 min-w-8"></div>
                                <p className="ml-2">- wymaga akcji</p>
                            </div>

                            <div className="flex flex-row items-center mb-3">
                                <div className="bg-red-700 rounded-lg h-8 w-8 min-h-8 min-w-8"></div>
                                <p className="ml-2">- odrzucona</p>
                            </div>
                        </div>
                    </div>

                    <CalendarForVisits
                        events={visits}
                        handleSelectSlot={handleSelectSlot}
                        style={{
                            height: 1500,
                            fontSize: "x-large"
                        }}
                        eventBackgroundAdjustment={eventBackgroundAdjustment}
                        selectable={true}
                        views={[Views.DAY, Views.WEEK, Views.MONTH]}
                        EventComponent={EventComponent}
                        onSelectEvent={(event) => selectVisit(event)}
                        timeOffSlotAdjustment={timeOffSlotAdjustment}
                    />
                </div>
            </div>

            {showTimeOffWindow &&
                createPortal(
                    <div className="flex flex-col items-center">
                        <div className="flex flex-col justify-center">
                            <p className="font-bold text-3xl pb-1">Dodaj termin urlopu</p>
                            <div className="bg-amber-900 rounded-md h-1 mb-3"></div>
                        </div>
                        <div className="w-2/3 text-2xl">
                            <div className="w-full py-2">
                                <p className="font-bold pb-2 text-left">Data rozpoczęcia<sup>*</sup></p>

                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pl">
                                    <DemoItem>
                                        <DateTimePicker
                                            defaultValue={dayjs(newTimeOff.start_date)}
                                            ampm={false}
                                            minutesStep={15}
                                            minTime={dayjs().set('hour', 6).set('minute', 0)}
                                            maxTime={dayjs().set('hour', 21).set('minute', 0)}
                                            onChange={(value) => {
                                                setNewTimeOff({
                                                    ...newTimeOff,
                                                    start_date: value!.toDate()
                                                })
                                                setUniversalError("")
                                                setSuccessMessage("")
                                            }}
                                        />
                                    </DemoItem>
                                </LocalizationProvider>
                            </div>

                            <div className="w-full py-2">
                                <p className="font-bold pb-2 text-left">Data zakończenia<sup>*</sup></p>

                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pl">
                                    <DemoItem>
                                        <DateTimePicker
                                            defaultValue={dayjs(newTimeOff.end_date)}
                                            ampm={false}
                                            minutesStep={15}
                                            minTime={dayjs().set('hour', 6).set('minute', 0)}
                                            maxTime={dayjs().set('hour', 21).set('minute', 0)}
                                            onChange={(value) => {
                                                setNewTimeOff({
                                                    ...newTimeOff,
                                                    end_date: value!.toDate()
                                                })
                                                setUniversalError("")
                                                setSuccessMessage("")
                                            }}
                                        />
                                    </DemoItem>
                                </LocalizationProvider>
                            </div>

                            <div className="flex flex-row justify-evenly mt-5">
                                <div onClick={() => Swal.close()}
                                     className="border-4 border-amber-900 text-white rounded-2xl cursor-pointer p-2 transition ease-in-out delay-0 bg-amber-900 hover:border-amber-900 hover:bg-white hover:text-amber-900 duration-300 ...">
                                    <span className="mx-3 my-2 text-xl">Anuluj</span>
                                </div>

                                <div onClick={createTimeOff}
                                     className="border-4 border-amber-900 text-white rounded-2xl cursor-pointer p-2 transition ease-in-out delay-0 bg-amber-900 hover:border-amber-900 hover:bg-white hover:text-amber-900 duration-300 ...">
                                    <span className="mx-3 my-2 text-xl">Utwórz</span>
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

            {showInfoWindow &&
                createPortal(
                    <div className="flex flex-col items-center">
                        <div className="flex flex-col justify-center">
                            <p className="font-bold text-3xl pb-1">Informacja</p>
                            <div className="bg-amber-900 rounded-md h-1 mb-3"></div>
                        </div>
                        <div className="w-2/3 text-2xl">
                            <p>{info}</p>
                        </div>

                        <div className="">
                            <p>Data rozpoczęcia: {selectedVisit!.info.start_date.toLocaleString()}</p>
                            <p>Data zakończenia: {selectedVisit!.info.end_date.toLocaleString()}</p>
                            <p>Adres realizacji:
                                ul. {selectedVisit!.info.client_address.street} {selectedVisit!.info.client_address.building_nr}</p>
                            <p>Opis: {selectedVisit!.info.description}</p>
                        </div>

                        <div className="flex flex-row justify-evenly mt-5">
                            <div onClick={() => Swal.close()}
                                 className="border-4 border-amber-900 text-white rounded-2xl cursor-pointer p-2 transition ease-in-out delay-0 bg-amber-900 hover:border-amber-900 hover:bg-white hover:text-amber-900 duration-300 ...">
                                <span className="mx-3 my-2 text-xl">Ok</span>
                            </div>
                        </div>
                    </div>
                    ,
                    Swal.getHtmlContainer()!,
                )
            }

            {showVisitWindow &&
                createPortal(
                    <div className="flex flex-col items-center">
                        <div className="flex flex-col justify-center">
                            <p className="font-bold text-3xl pb-1">Wizyta</p>
                            <div className="bg-amber-900 rounded-md h-1 mb-3"></div>
                        </div>

                        <div className="">
                            <p>Data rozpoczęcia: {selectedVisit!.info.start_date.toLocaleString()}</p>
                            <p>Data zakończenia: {selectedVisit!.info.end_date.toLocaleString()}</p>
                            <p>Adres realizacji:
                                ul. {selectedVisit!.info.client_address.street} {selectedVisit!.info.client_address.building_nr}</p>
                            <p>Opis: {selectedVisit!.info.description}</p>
                        </div>

                        <div className="flex flex-row justify-evenly mt-5">
                            <div onClick={() => Swal.close()}
                                 className="border-4 border-amber-900 text-white rounded-2xl cursor-pointer p-2 transition ease-in-out delay-0 bg-amber-900 hover:border-amber-900 hover:bg-white hover:text-amber-900 duration-300 ...">
                                <span className="mx-3 my-2 text-xl">Ok</span>
                            </div>
                        </div>
                    </div>
                    ,
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
                            <p className="text-xl">{universalError}</p>
                        </div>

                        <div onClick={() => Swal.close()}
                             className="border-4 border-amber-900 text-white rounded-2xl cursor-pointer p-2 transition ease-in-out delay-0 bg-amber-900 hover:border-amber-900 hover:bg-white hover:text-amber-900 duration-300 ...">
                            <span className="mx-3 my-2 text-xl">Ok</span>
                        </div>
                    </div>,
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

export default SpecialistReservations