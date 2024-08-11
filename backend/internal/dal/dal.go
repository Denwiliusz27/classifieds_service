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
	GetClientByUserId(userId int) (*models.Client, error)

	CreateClientAddress(address models.ClientAddressRegister, clientId int) (int, error)
	GetClientAddressesByClientId(clientId int) ([]models.ClientAddress, error)

	GetSpecializations() ([]models.Specialization, error)

	GetServices() ([]models.Service, error)

	CreateSpecialist(phoneNr string, description string, cityId int, userId int, specializationId int) (int, error)
	GetSpecialistByUserId(userId int) (*models.Specialist, error)
	GetSpecialistsBySpecializationIdCityIdServiceId(specializationId *int, cityId *int, serviceId *int) ([]models.SpecialistGeneralInfo, error)
	GetSpecialistProfileInfoBySpecialistId(specialistId int) (*models.SpecialistProfileInfo, error)

	CreateSpecialistService(minPrice int, maxPrice int, specialistId int, serviceId int) (int, error)
	GetSpecialistServicesBySpecialistId(specialistId int) ([]models.SpecialistService, error)

	GetReviewsBySpecialistId(specialistId int) ([]models.Review, error)
	GetReviewByVisitId(visitId int) (*models.Review, error)
	CreateReview(review models.ReviewRequest) (int, error)

	GetTimeOffBySpecialistId(specialistId int) ([]models.TimeOff, error)
	CreateTimeOff(newTimeOff models.TimeOffRequest) (int, error)

	GetCalendarVisitsBySpecialistIdOrClientId(specialistId *int, clientId *int) ([]models.VisitCalendar, error)
	CreateVisit(visitRequest models.VisitRequest) (int, error)
	UpdateVisit(visit models.VisitCalendar) error

	GetNotificationsByClientId(clientId int) ([]models.Notification, error)
	GetNotificationsBySpecialistId(specialistId int) ([]models.Notification, error)
	UpdateNotificationsByVisitIdAndClient(visitId int) error
	UpdateNotificationsByVisitIdAndSpecialist(visitId int) error
	CreateNotification(notification models.NotificationRequest) (int, error)
}
