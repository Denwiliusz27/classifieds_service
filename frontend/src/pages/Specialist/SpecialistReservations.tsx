import {useLocation, useNavigate, useOutletContext} from "react-router-dom";
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
import cloneDeep from "lodash/cloneDeep";
import {NotificationRequest} from "../../models/Notification";

function SpecialistReservations() {
    const {jwtToken, userRole} = useOutletContext<AuthContextType>();
    const navigate = useNavigate()
    const location = useLocation()

    const [showTimeOffWindow, setShowTimeOffWindow] = useState(false)
    const [showVisitWindow, setShowVisitWindow] = useState(false)
    const [showErrorWindow, setShowErrorWindow] = useState(false)
    const [universalError, setUniversalError] = useState("")
    const [dateError, setDateError] = useState("")
    const [priceError, setPriceError] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const [info, setInfo] = useState("")
    const [isVisitOld, setIsVisitOld] = useState(false)
    const [timeOffs, setTimeOffs] = useState<TimeOff[]>([])
    const [typeState, setTypeState] = useState<string[]>([])
    const [notification, setNotification] = useState<NotificationRequest>({
        type: '',
        notifier: 'specialist',
        client_id: 0,
        specialist_id: 0,
        visit_id: 0,
    })
    const [specialist, setSpecialist] = useState<Specialist>()
    const [visits, setVisits] = useState<VisitCalendar[]>([])
    const [selectedVisit, setSelectedVisit] = useState<VisitCalendar>()
    const [baseVisit, setBaseVisit] = useState<VisitCalendar>()
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
            getTimeOff()
            getVisits()
        }
    }, [specialist, jwtToken]);

    useEffect(() => {
        if(location.state && visits && location.state.visitId !== 0) {
            visits.forEach((v: VisitCalendar) => {
                if (v.info.id === location.state.visitId) {
                    selectVisit(v)
                    location.state.visitId = 0
                }
            })
        }
    }, [visits, location]);

    function getTimeOff() {
        const headers = new Headers()
        headers.append("Content-Type", "application/json")
        const requestOptions = {
            method: "GET",
            headers: headers,
        }

        fetch(`http://localhost:8080/time_off/${specialist!.id}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setTimeOffs(data)
            })
            .catch(err => {
                console.log("Error retrieving TimeOff: ", err)
            })
    }

    function getVisits() {
        const headers = new Headers()
        headers.append("Content-Type", "application/json")
        const requestOptions = {
            method: "GET",
            headers: headers,
        }

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

    const handleSelectSlot = ({start, end}: { start: Date, end: Date }) => {
        if (!isDateFromFuture(start)) {
            setUniversalError("Wybrany przedział czasowy jest terminem z przeszłości.")

            Swal.fire({
                didOpen: () => setShowErrorWindow(true),
                didClose: () => clearVariables(),
                showConfirmButton: false,
            })
            return;
        }

        if (isNewTimeOverlappingTimeOffs(start, end)) {
            setUniversalError("Wybrany przedział czasowy nakłada się z istniejącym już urlopem.")

            Swal.fire({
                didOpen: () => setShowErrorWindow(true),
                didClose: () => clearVariables(),
                showConfirmButton: false,
            })
            return;
        }

        if (isNewTimeOverlappingVisits(start, end)) {
            setUniversalError("Wybrany przedział czasowy nakłada się z istniejącą wizytą. Wybierz inny termin lub " +
                "zmodyfikuj wizytę.")

            Swal.fire({
                didOpen: () => setShowErrorWindow(true),
                didClose: () => clearVariables(),
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
            didClose: () => clearVariables(),
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
            backgroundColor = 'DarkGoldenRod';
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

    function clearVariables(){
        setShowVisitWindow(false)
        setInfo("")
        setDateError("")
        setSuccessMessage("")
        setPriceError("")
        setUniversalError("")
        setIsVisitOld(false)
        setShowErrorWindow(false)
        setShowTimeOffWindow(false)
        setTypeState([])
        setNotification({
            type: '',
            notifier: 'specialist',
            client_id: 0,
            specialist_id: 0,
            visit_id: 0,
        })
    }

    const selectVisit = (visit: VisitCalendar) => {
        setBaseVisit(visit)
        setSelectedVisit(visit)
        setNotification({
            ...notification,
            client_id: visit.client.id,
            specialist_id: visit.specialist.id,
            visit_id: visit.info.id,
        })

        if (visit.info.start_date < new Date()) {
            setInfo("Wybrana wizyta jest wizytą z przeszłości")
            setIsVisitOld(true)

            Swal.fire({
                customClass: 'swal-wide',
                didOpen: () => setShowVisitWindow(true),
                didClose: () => clearVariables(),
                showConfirmButton: false,
            })
            return
        }

        if (visit.info.status === 'declined') {
            setInfo("Wybrana wizyta została już anulowana.")

            Swal.fire({
                customClass: 'swal-wide',
                didOpen: () => setShowVisitWindow(true),
                didClose: () => clearVariables(),
                showConfirmButton: false,
            })
        } else if (visit.info.status === 'client_action_required') {
            setInfo("Wybrana wizyta wymaga działania po stronie klienta.")

            Swal.fire({
                customClass: 'swal-wide',
                didOpen: () => setShowVisitWindow(true),
                didClose: () => clearVariables(),
                showConfirmButton: false,
            })
        } else if (visit.info.status === 'specialist_action_required') {
            setInfo("Wybrana wizyta wymaga działania - zaproponuj zmiany, zaakceptuj bądź odrzuć wizytę.")

            Swal.fire({
                customClass: 'swal-wide',
                didOpen: () => setShowVisitWindow(true),
                didClose: () => clearVariables(),
                showConfirmButton: false,
            })
        } else if (visit.info.status === 'accepted') {
            setInfo("Wybrana wizyta została już zaakceptowana.")

            Swal.fire({
                customClass: 'swal-wide',
                didOpen: () => setShowVisitWindow(true),
                didClose: () => clearVariables(),
                showConfirmButton: false,
            })
        }
    }

    function isNewTimeOverlappingTimeOffs(start: Date, end: Date) {
        const newStartDate = start.getTime()
        const newEndDate = end.getTime()

        if (!timeOffs) {
            return false
        }

        for (let i = 0; i < timeOffs.length; i++) {
            const startDate = new Date(timeOffs[i].start_date).getTime()
            const endDate = new Date(timeOffs[i].end_date).getTime()

            if (isNewDateOverlappingExistingCheck(newStartDate, newEndDate, startDate, endDate)) {
                return true
            }
        }

        return false
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

    const createTimeOff = () => {
        if (!isDateFromFuture(newTimeOff.start_date)) {
            setUniversalError("Wybrany przedział czasowy jest terminem z przeszłości.")
            return;
        }

        if (isNewTimeOverlappingTimeOffs(newTimeOff.start_date, newTimeOff.end_date)) {
            setUniversalError("Wybrany przedział czasowy nakłada się z istniejącym już urlopem.")
            return;
        }

        if (isNewTimeOverlappingVisits(newTimeOff.start_date, newTimeOff.end_date)) {
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
                    getTimeOff()
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    function updateVisit(visit: VisitCalendar, newStatus: string, message: string){
        setSuccessMessage("")
        setUniversalError("")
        console.log(visit)

        const headers = new Headers()
        headers.append("Content-Type", "application/json")
        headers.append("Authorization", "Bearer " + jwtToken)
        const method = "PATCH"

        fetch(`/specialist/visit/update`, {
            body: JSON.stringify(visit),
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
                    console.log("SUCCESSFULLY UPDATED VISIT")
                    setSuccessMessage(message)

                    if (!data.error && selectedVisit){
                        setSelectedVisit({
                            ...selectedVisit,
                            info: {
                                ...selectedVisit?.info,
                                status: newStatus
                            }
                        })
                    }

                    getVisits()
                    createNotification(newStatus)
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const changeVisitStatus = (status: string) => {
        const updatedVisit = cloneDeep(visits!.find((element) => {
            return element.info.id === selectedVisit!.info.id;
        }))

        updatedVisit!.info.status = status

        if (status === 'declined') {
            setNotification({
                ...notification,
                type: 'declined'
            })
            updateVisit(updatedVisit!, 'declined', "Pomyślnie odrzucono wizytę")
        } else if (status === 'accepted') {
            setNotification({
                ...notification,
                type: 'accepted'
            })
            updateVisit(updatedVisit!, 'accepted', "Pomyślnie zaakceptowano wizytę")
        }
    }

    function hasVisitChanged(): boolean {
        const tmp = visits!.find((element) => {
            return element.info.id === selectedVisit?.info.id;
        })

        return !(tmp!.info.start_date.getTime() === selectedVisit?.info.start_date.getTime() &&
            tmp!.info.end_date.getTime() === selectedVisit?.info.end_date.getTime() &&
            tmp!.info.client_address.id === selectedVisit?.info.client_address.id &&
            tmp!.info.description === selectedVisit?.info.description &&
            tmp!.info.price === selectedVisit?.info.price);
    }

    const modifyVisit = () => {
        if (!hasVisitChanged()) {
            setUniversalError("Wprowadź zmiany aby zmodyfikować wizytę")
            return;
        }

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

        if (isNewTimeOverlappingTimeOffs(selectedVisit!.info.start_date, selectedVisit!.info.end_date)) {
            setDateError("Nowy termin rezerwacji nakłada się z istniejącym już urlopem.")
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

    function setNotificationType(v1: any, v2: any, type: string) {
        if (v1 !== v2) {
            if (!typeState.includes(type)) {
                if (notification.type === '') {
                    setNotification({
                        ...notification,
                        type: type
                    })
                } else {
                    setNotification({
                        ...notification,
                        type: 'modified'
                    })
                }

                setTypeState([
                    ...typeState,
                    type
                ])
            }
        } else {
            if (notification.type === type) {
                setNotification({
                    ...notification,
                    type: ''
                })
            } else {
                let tmp = typeState.filter(s => s !== type)

                if (tmp.length === 1) {
                    setNotification({
                        ...notification,
                        type: tmp[0]
                    })
                } else {
                    setNotification({
                        ...notification,
                        type: 'modified'
                    })
                }
            }

            setTypeState(
                typeState.filter(s => s !== type)
            )
        }
    }

    function createNotification(type: string) {
        let tmp = cloneDeep(notification!)
        if (type === 'declined'){
            tmp.type = 'declined'
        } else if (type === 'accepted') {
            tmp.type = 'accepted'
        }

        const headers = new Headers()
        headers.append("Content-Type", "application/json")
        headers.append("Authorization", "Bearer " + jwtToken)
        const method = "POST"

        fetch(`/specialist/notifications/create`, {
            body: JSON.stringify(tmp),
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
                    console.log("SUCCESSFULLY CREATED NOTIFICATION")
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
                                <div className=" bg-yellow-600 rounded-lg h-8 w-8 min-h-8 min-w-8"></div>
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
                                            maxTime={dayjs().set('hour', 22).set('minute', 0)}
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
                                            maxTime={dayjs().set('hour', 22).set('minute', 0)}
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
                                                disabled={selectedVisit!.info.status !== 'specialist_action_required' || isVisitOld}
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
                                                    setNotificationType(baseVisit?.info.start_date.getTime(), value!.toDate().getTime(), 'modified_date')
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
                                                disabled={selectedVisit!.info.status !== 'specialist_action_required' || isVisitOld}
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
                                                    setNotificationType(baseVisit?.info.end_date.getTime(), value!.toDate().getTime(), 'modified_date')
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
                                    disabled={selectedVisit!.info.status !== 'specialist_action_required' || isVisitOld}
                                    placeholder={"Cena realizacji usługi"}
                                    value={0 || selectedVisit!.info.price}
                                    className={`w-full h-14 border-2 text-lg border-gray-300 rounded-md pl-2`}
                                    onChange={(value) => {
                                        if (selectedVisit) {
                                            setSelectedVisit({
                                                ...selectedVisit,
                                                info: {
                                                    ...selectedVisit.info,
                                                    price: parseInt(value.target.value, 10)
                                                }
                                            })
                                        }
                                        setNotificationType(baseVisit?.info.price, value.target.value, 'modified_price')
                                        setPriceError("")
                                        setSuccessMessage("")
                                        setUniversalError("")
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

                            {(selectedVisit?.info.status !== "declined" && !isVisitOld ) &&
                                <div onClick={() => changeVisitStatus("declined")}
                                     className="ml-2 border-4 border-red-700 text-red-700 rounded-2xl cursor-pointer p-2 transition ease-in-out delay-0 bg-white hover:border-red-700 hover:bg-red-700 hover:text-white duration-300 ...">
                                    <span className="mx-3 my-2 text-xl">Odrzuć</span>
                                </div>
                            }

                            {(selectedVisit?.info.status === "specialist_action_required" && !isVisitOld) &&
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