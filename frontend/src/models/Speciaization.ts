export interface Speciaization {
    id: number
    name: string
}

export interface Service {
    id: number
    name: string
    specializationId: number
}