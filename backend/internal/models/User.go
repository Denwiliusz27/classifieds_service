package models

import "time"

type User struct {
	Id         int       `json:"id"`
	Name       string    `json:"name"`
	SecondName string    `json:"second_name"`
	Email      string    `json:"email"`
	Password   string    `json:"password"`
	CreatedAt  time.Time `json:"created_at"`
	Role       string    `json:"role"`
}
