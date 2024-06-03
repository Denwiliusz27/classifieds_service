package postgres

import (
	"backend/internal/dal/sql"
	"backend/internal/models"
	"context"
	"fmt"
	"log"
)

func (m *PG) GetSpecializations() ([]models.Specialization, error) {
	var specializations []models.Specialization
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	q := sql.GetSpecializations

	rows, err := m.DB.QueryContext(ctx, q)
	if err != nil {
		return nil, fmt.Errorf("error retrieving data: %w", err)
	}
	defer func() {
		_ = rows.Close()
	}()

	for rows.Next() {
		var specialization models.Specialization

		err := rows.Scan(
			&specialization.Id,
			&specialization.Name,
		)
		if err != nil {
			return nil, fmt.Errorf("error scanning row: %w", err)
		}

		specializations = append(specializations, specialization)
	}

	log.Println("Successfully retrieved Specializations")

	return specializations, nil
}
