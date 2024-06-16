export interface Specialization {
    id: number
    name: string
    img:  string
}

export interface Service {
    id: number
    name: string
    price_per: string
    specialization_id: number
}