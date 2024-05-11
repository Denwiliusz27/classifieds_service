export interface Specialization {
    id: number
    name: string
}

export interface Service {
    id: number
    name: string
    specializationId: number
}