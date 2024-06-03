package models

type Specialist struct {
	Id               int    `json:"id"`
	Name             string `json:"name"`
	SecondName       string `json:"second_name"`
	Email            string `json:"email"`
	Description      string `json:"description"`
	PhoneNr          string `json:"phone_nr"`
	SpecializationId int    `json:"specialization_id"`
	CityId           int    `json:"city_id"`
	UserId           int    `json:"user_id"`
}
