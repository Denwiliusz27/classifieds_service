package models

import "time"

type Client struct {
	Id         int       `json:"id"`
	Name       string    `json:"name"`
	SecondName string    `json:"second_name"`
	Email      string    `json:"email"`
	UserId     int       `json:"user_id"`
	CreatedAt  time.Time `json:"created_at"`
}

type ClientBasicInfo struct {
	Id         int    `json:"id"`
	Name       string `json:"name"`
	SecondName string `json:"second_name"`
}
