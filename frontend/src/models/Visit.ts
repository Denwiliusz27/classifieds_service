import {SpecialistProfileInfo} from "./Specialist";
import {Client} from "./Client";
import {SpecialistService} from "./SpecialistService";
import {ClientAddressExtended} from "./ClientAddress";

export interface Visit {
    id: number
    start_date: Date
    end_date: Date
    price: number
    description: string
    status: string
    client_address: ClientAddressExtended
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
    client_address_id: number
    specialist_id: number
    specialist_service_id: number
}

export interface VisitBasicInfo {
    id: number
    service: string
}