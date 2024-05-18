package repository

import (
	"backend/internal/models"
	"database/sql"
)

type DBRepository interface {
	Connection() *sql.DB
	AllCities() ([]*models.City, error)
}
