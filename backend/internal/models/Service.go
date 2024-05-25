package models

type Service struct {
	Id               int    `json:"id"`
	Name             string `json:"name"`
	PricePer         string `json:"price_per"`
	SpecializationId int    `json:"specialization_id"`
}
