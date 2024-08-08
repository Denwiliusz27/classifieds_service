import {Client} from "./Client";
import {SpecialistService} from "./SpecialistService";

export interface Review {
    id: number
    rating: number
    client: Client
    specialist_service: SpecialistService
    description: string
    created_at: string
}

export interface ReviewRequest {
    rating: number
    description: string
    client_id: number
    specialist_id: number
    specialist_service_id: number
    visit_id: number
}