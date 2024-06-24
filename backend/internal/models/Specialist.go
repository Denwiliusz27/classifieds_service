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

type SpecialistGeneralInfo struct {
	Id             int     `json:"id"`
	Name           string  `json:"name"`
	SecondName     string  `json:"second_name"`
	Specialization string  `json:"specialization"`
	City           string  `json:"city"`
	Rating         float32 `json:"rating"`
	Reviews        int     `json:"reviews"`
}

type SpecialistProfileInfo struct {
	Id             int    `json:"id"`
	Name           string `json:"name"`
	SecondName     string `json:"second_name"`
	Email          string `json:"email"`
	Specialization string `json:"specialization"`
	City           string `json:"city"`
	PhoneNr        string `json:"phone_nr"`
	Description    string `json:"description"`
}

type SpecialistExtendedInfo struct {
	Info     SpecialistProfileInfo `json:"specialist"`
	Services []SpecialistService   `json:"services"`
	Reviews  []Review              `json:"reviews"`
}
