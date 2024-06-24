import {Client} from "./Client";
import {SpecialistService} from "./SpecialistService";

export interface Review {
    id: number
    rating: number
    client: Client
    specialist_service: SpecialistService
    description: string
}