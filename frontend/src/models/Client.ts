
export interface Client {
    id: number
    name: string
    second_name: string
    email: string
    user_id: number
    created_at: Date
}

export interface ClientBasicInfo {
    id: number
    name: string
    second_name: string
}