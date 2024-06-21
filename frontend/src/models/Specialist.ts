
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
}

export interface SpecialistGeneralInfo {
    id: number
    name: string
    second_name: string
    specialization: string
    city: string
    rating: number
    reviews: number
}