package models

import "time"

type Review struct {
	Id                int               `json:"id"`
	Rating            int               `json:"rating"`
	Client            Client            `json:"client"`
	SpecialistService SpecialistService `json:"specialist_service"`
	Description       string            `json:"description"`
	CreatedAt         time.Time         `json:"created_at"`
}

type ReviewRequest struct {
	Rating              int    `json:"rating"`
	Description         string `json:"description"`
	ClientId            int    `json:"client_id"`
	SpecialistId        int    `json:"specialist_id"`
	SpecialistServiceId int    `json:"specialist_service_id"`
	VisitId             int    `json:"visit_id"`
}
