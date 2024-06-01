package models

type Client struct {
	Id         int    `json:"id"`
	Name       string `json:"name"`
	SecondName string `json:"second_name"`
	Email      string `json:"email"`
	UserId     int    `json:"user_id"`
}
