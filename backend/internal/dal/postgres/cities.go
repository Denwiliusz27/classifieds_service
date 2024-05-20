package postgres

import (
	"backend/internal/dal/sql"
	"backend/internal/models"
	"context"
	"fmt"
)

func (m *PG) AllCities() ([]*models.City, error) {
	var cities []*models.City
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	q := sql.GetCities

	rows, err := m.DB.QueryContext(ctx, q)
	if err != nil {
		return nil, fmt.Errorf("error retrieving data: %w", err)
	}
	defer func() {
		_ = rows.Close()
	}()

	for rows.Next() {
		var city models.City

		err := rows.Scan(&city.Id, &city.Name)
		if err != nil {
			return nil, fmt.Errorf("error scanning row: %w", err)
		}

		cities = append(cities, &city)
	}

	return cities, nil
}
