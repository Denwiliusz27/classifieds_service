package postgres

import (
	"backend/internal/dal/sql"
	"backend/internal/models"
	"context"
	"fmt"
)

func (m *PG) GetServices() ([]models.Service, error) {
	var services []models.Service
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	q := sql.GetServices

	rows, err := m.DB.QueryContext(ctx, q)
	if err != nil {
		return nil, fmt.Errorf("error retrieving data: %w", err)
	}
	defer func() {
		_ = rows.Close()
	}()

	for rows.Next() {
		var service models.Service

		err := rows.Scan(
			&service.Id,
			&service.Name,
			&service.PricePer,
			&service.SpecializationId,
		)
		if err != nil {
			return nil, fmt.Errorf("error scanning row: %w", err)
		}

		services = append(services, service)
	}

	return services, nil
}
