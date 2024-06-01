package models

type ClientResponse struct {
	Id         int    `json:"id"`
	Name       string `json:"name"`
	SecondName string `json:"second_name"`
	UserId     int    `json:"user_id"`
}
