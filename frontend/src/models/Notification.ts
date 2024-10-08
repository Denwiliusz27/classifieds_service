import {ClientBasicInfo} from "./Client";
import {SpecialistBasicInfo} from "./Specialist";
import {VisitBasicInfo} from "./Visit";

export interface Notification {
    id: number
    type: string
    notifier: string
    read: boolean
    created_at: Date
    client: ClientBasicInfo
    specialist: SpecialistBasicInfo
    visit: VisitBasicInfo
}

export interface NotificationRequest {
    type: string
    notifier: string
    client_id: number
    specialist_id: number
    visit_id: number
}