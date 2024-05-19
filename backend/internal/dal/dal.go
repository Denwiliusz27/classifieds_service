package dal

import (
	"backend/internal/models"
	"database/sql"
)

type DAL interface {
	Connection() *sql.DB
	AllCities() ([]*models.City, error)
}
