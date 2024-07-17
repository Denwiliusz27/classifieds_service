import {SpecialistGeneralInfo, SpecialistProfileInfo} from "./Specialist";
import {Client} from "./Client";
import {SpecialistService} from "./SpecialistService";
import {ClientAddress} from "./ClientAddress";

export interface Visit {
    id: number
    start_date: Date
    end_date: Date
    price: number
    description: string
    status: string
    client_address: ClientAddress
}

export interface VisitCalendar {
    info: Visit
    specialist: SpecialistProfileInfo
    client: Client
    service: SpecialistService
}

export interface VisitRequest {
    start_date: Date
    end_date: Date
    description: string
    client_id: number
    specialist_id: number
    specialist_service_id: number
}