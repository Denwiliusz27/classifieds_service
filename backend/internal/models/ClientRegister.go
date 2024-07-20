package models

type ClientRegister struct {
	Name       string                  `json:"name"`
	SecondName string                  `json:"second_name"`
	Email      string                  `json:"email"`
	Password   string                  `json:"password"`
	Addresses  []ClientAddressRegister `json:"addresses"`
}

type ClientAddressRegister struct {
	CityId     int    `json:"city_id"`
	Street     string `json:"street"`
	BuildingNr int    `json:"building_nr"`
	FlatNr     int    `json:"flat_nr"`
}
