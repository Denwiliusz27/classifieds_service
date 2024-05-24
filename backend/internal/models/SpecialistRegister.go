package models

type SpecialistRegister struct {
	Name             string                      `json:"name"`
	SecondName       string                      `json:"second_name"`
	Email            string                      `json:"email"`
	Password         string                      `json:"password"`
	CityId           int                         `json:"city_id"`
	PhoneNr          string                      `json:"phone_nr"`
	SpecializationId int                         `json:"specialization_id"`
	Services         []SpecialistServicesRequest `json:"services"`
	Description      string                      `json:"description"`
}

type SpecialistServicesRequest struct {
	MinPrice  int `json:"min_price"`
	MaxPrice  int `json:"max_price"`
	ServiceId int `json:"service_id"`
}
