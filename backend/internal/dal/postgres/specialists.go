package postgres

import (
	"backend/internal/dal/sql"
	"backend/internal/models"
	"context"
	"fmt"
	"log"
)

func (m *PG) CreateSpecialist(phoneNr string, description string, cityId int, userId int, specializationId int) (int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	q := sql.CreateSpecialist
	var newSpecialistId int
	err := m.DB.QueryRowContext(ctx, q,
		phoneNr,
		description,
		cityId,
		userId,
		specializationId,
	).Scan(&newSpecialistId)

	if err != nil {
		return 0, fmt.Errorf("cannot create new Client: %w", err)
	}
	log.Println("Successfully created Specialist with id ", newSpecialistId)

	return newSpecialistId, nil
}

func (m *PG) GetSpecialistByUserId(userId int) (*models.Specialist, error) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	q := sql.GetSpecialistByUserId
	var specialist models.Specialist
	row := m.DB.QueryRowContext(ctx, q,
		userId,
	)

	err := row.Scan(
		&specialist.Id,
		&specialist.Name,
		&specialist.SecondName,
		&specialist.Email,
		&specialist.Description,
		&specialist.PhoneNr,
		&specialist.SpecializationId,
		&specialist.CityId,
		&specialist.UserId,
	)

	if err != nil {
		return nil, fmt.Errorf("error getting Specialist by userId: %w", err)
	}
	log.Println("Successfully retrieved Specialist")

	return &specialist, nil
}
