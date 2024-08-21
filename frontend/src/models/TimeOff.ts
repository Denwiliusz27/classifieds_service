export interface TimeOff {
    id: number
    start_date: string
    end_date: string
    specialist_id: number
}

export interface TimeOffRequest {
    start_date: Date
    end_date: Date
    specialist_id: number
}