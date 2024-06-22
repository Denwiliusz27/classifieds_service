package models

type SpecialistService struct {
	Id       int    `json:"id"`
	Name     int    `json:"name"`
	PricePer string `json:"price_per"`
	PriceMin int    `json:"price_min"`
	PriceMax int    `json:"price_max"`
}
