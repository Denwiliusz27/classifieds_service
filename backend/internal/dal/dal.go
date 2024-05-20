package dal

import (
	"backend/internal/models"
	"database/sql"
)

type DAL interface {
	Connection() *sql.DB
	AllCities() ([]*models.City, error)

	CreateUser(client models.ClientRegister) (int, error)
	GetUserByEmailAndRole(email string, role string) (*models.User, error)

	CreateClient(newUserId int) (int, error)

	CreateClientAddress(address models.ClientAddresses, clientId int) (int, error)
}
