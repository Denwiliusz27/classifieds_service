
export interface SpecialistRequest {
    name: string
    second_name: string
    email: string
    password: string
    city_id: number
    phone_nr: string
    specialization_id: number
    services: SpecialistService[]
    description: string
}

export interface SpecialistService {
    min_price: number
    max_price: number
    service_id: number
}