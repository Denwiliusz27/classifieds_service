package models

type ClientAddress struct {
	Id         int    `json:"id"`
	Street     string `json:"street"`
	BuildingNr int    `json:"building_nr"`
	FlatNr     int    `json:"flat_nr"`
	City       City   `json:"city"`
}
