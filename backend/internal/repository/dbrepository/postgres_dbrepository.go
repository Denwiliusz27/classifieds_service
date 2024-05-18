package dbrepository

import (
	"backend/internal/models"
	"backend/internal/repository/query"
	"context"
	"database/sql"
	"fmt"
	"time"
)

type PostgresDBRepository struct {
	DB *sql.DB
}

const timeout = time.Second * 5

func (m *PostgresDBRepository) Connection() *sql.DB {
	return m.DB
}

func (m *PostgresDBRepository) AllCities() ([]*models.City, error) {
	var cities []*models.City
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	q := query.GetCities

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
