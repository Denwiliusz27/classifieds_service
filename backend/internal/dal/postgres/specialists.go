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

func (m *PG) GetSpecialistsBySpecializationIdCityIdServiceId(specializationId *int, cityId *int, serviceId *int) ([]models.SpecialistGeneralInfo, error) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	q := sql.GetSpecialistsBySpecializationIdCityIdServiceId
	var specialists []models.SpecialistGeneralInfo

	rows, err := m.DB.QueryContext(ctx, q, specializationId, cityId, serviceId)
	if err != nil {
		return nil, fmt.Errorf("error retrieving data: %w", err)
	}
	defer func() {
		_ = rows.Close()
	}()

	for rows.Next() {
		var s models.SpecialistGeneralInfo

		err := rows.Scan(
			&s.Id,
			&s.Name,
			&s.SecondName,
			&s.Specialization,
			&s.City,
			&s.Rating,
			&s.Reviews)

		if err != nil {
			return nil, fmt.Errorf("error scanning row: %w", err)
		}

		specialists = append(specialists, s)
	}

	log.Println("Successfully retrieved SpecialistsGeneralInfo")

	return specialists, nil
}
