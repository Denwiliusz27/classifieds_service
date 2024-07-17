package models

import "time"

type Visit struct {
	Id            int           `json:"id"`
	StartDate     time.Time     `json:"start_date"`
	EndDate       time.Time     `json:"end_date"`
	Price         int           `json:"price"`
	Description   string        `json:"description"`
	Status        string        `json:"status"`
	ClientAddress ClientAddress `json:"client_address"`
}

type VisitCalendar struct {
	Info       Visit                 `json:"info"`
	Specialist SpecialistProfileInfo `json:"specialist"`
	Client     Client                `json:"client"`
	Service    SpecialistService     `json:"service"`
}
