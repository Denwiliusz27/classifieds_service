package models

import "time"

type Notification struct {
	Id         int                 `json:"id"`
	Type       string              `json:"type"`
	Notifier   string              `json:"notifier"`
	Read       bool                `json:"read"`
	CreatedAt  time.Time           `json:"created_at"`
	Client     ClientBasicInfo     `json:"client"`
	Specialist SpecialistBasicInfo `json:"specialist"`
	Visit      VisitBasicInfo      `json:"visit"`
}