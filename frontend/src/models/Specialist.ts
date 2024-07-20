import {SpecialistService} from "./SpecialistService";
import {Review} from "./Review";

export interface Specialist {
    id: number
    name: string
    second_name: string
    email: string
    description: string
    phone_nr: string
    specialization_id: number
    city_id: number
    user_id: number
    created_at: Date
}

export interface SpecialistGeneralInfo {
    id: number
    name: string
    second_name: string
    specialization: string
    city: string
    created_at: string
    rating: number
    reviews: number
}

export interface SpecialistProfileInfo {
    id: number
    name: string
    second_name: string
    email: string
    specialization: string
    city: string
    phone_nr: string
    description: string
    created_at: string
}

export interface SpecialistExtendedInfo {
    specialist: SpecialistProfileInfo
    services: SpecialistService[]
    reviews: Review[]
}
