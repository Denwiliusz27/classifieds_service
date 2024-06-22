package postgres

import (
	"backend/internal/dal/sql"
	"backend/internal/models"
	"context"
	"fmt"
	"log"
)

func (m *PG) CreateSpecialistService(minPrice int, maxPrice int, specialistId int, serviceId int) (int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	q := sql.CreateSpecialistService
	var newSpecialistId int
	err := m.DB.QueryRowContext(ctx, q,
		minPrice,
		maxPrice,
		specialistId,
		serviceId,
	).Scan(&newSpecialistId)

	if err != nil {
		return 0, fmt.Errorf("cannot create new Client: %w", err)
	}
	log.Println("Successfully created Specialist with id ", newSpecialistId)

	return newSpecialistId, nil
}

func (m *PG) GetSpecialistServicesBySpecialistId(specialistId int) ([]models.SpecialistService, error) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	q := sql.GetSpecialistServicesBySpecialistId
	var specialisServices []models.SpecialistService

	rows, err := m.DB.QueryContext(ctx, q, specialistId)
	if err != nil {
		return nil, fmt.Errorf("error retrieving data: %w", err)
	}
	defer func() {
		_ = rows.Close()
	}()

	for rows.Next() {
		var service models.SpecialistService

		err := rows.Scan(
			&service.Id,
			&service.Name,
			&service.PricePer,
			&service.PriceMin,
			&service.PriceMax)

		if err != nil {
			return nil, fmt.Errorf("error scanning row: %w", err)
		}

		specialisServices = append(specialisServices, service)
	}

	log.Println("Successfully retrieved SpecialistsServices")

	return specialisServices, nil
}
