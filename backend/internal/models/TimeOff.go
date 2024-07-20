package models

import "time"

type TimeOff struct {
	Id           int       `json:"id"`
	StartDate    time.Time `json:"start_date"`
	EndDate      time.Time `json:"end_date"`
	SpecialistId int       `json:"specialist_id"`
}
