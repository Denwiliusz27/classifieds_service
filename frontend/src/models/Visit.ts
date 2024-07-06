import {SpecialistGeneralInfo} from "./Specialist";
import {Client} from "./Client";
import {SpecialistService} from "./SpecialistService";

export interface Visit {
    id: number
    start_date: Date
    end_date: Date
    price: number
    description: string
    status: string
    specialist: SpecialistGeneralInfo
    client: Client
    specialist_service: SpecialistService
}

export interface VisitRequest {
    start_date: Date
    end_date: Date
    description: string
    client_id: number
    specialist_id: number
    specialist_service_id: number
}