package models

type Review struct {
	Id                int               `json:"id"`
	Rating            int               `json:"rating"`
	Client            Client            `json:"client"`
	SpecialistService SpecialistService `json:"specialist_service"`
	Description       string            `json:"description"`
}