package dal

import (
	"backend/internal/models"
	"database/sql"
)

type DAL interface {
	Connection() *sql.DB
	GetCities() ([]models.City, error)

	CreateUser(name string, secondName string, email string, password string, role string) (int, error)
	GetUserByEmailAndRole(email string, role string) (*models.User, error)
	GetUserById(id int) (*models.User, error)

	CreateClient(userId int) (int, error)

	CreateClientAddress(address models.ClientAddresses, clientId int) (int, error)

	GetSpecializations() ([]models.Specialization, error)

	GetServices() ([]models.Service, error)

	CreateSpecialist(phoneNr string, description string, cityId int, userId int, specializationId int) (int, error)

	CreateSpecialistService(minPrice int, maxPrice int, specialistId int, serviceId int) (int, error)
}
