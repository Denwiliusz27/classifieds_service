package models

type User struct {
	Id         int    `json:"id"`
	Name       string `json:"name"`
	SecondName string `json:"second_name"`
	Email      string `json:"email"`
	Password   string `json:"password"`
	Role       string `json:"role"`
}
