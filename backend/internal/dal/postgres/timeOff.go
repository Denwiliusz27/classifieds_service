package postgres

import (
	"backend/internal/dal/sql"
	"backend/internal/models"
	"context"
	"fmt"
	"log"
	"time"
)

func (m *PG) GetTimeOffBySpecialistId(specialistId int) ([]models.TimeOff, error) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	q := sql.GetTimeOffBySpecialistId
	var timeOffs []models.TimeOff

	rows, err := m.DB.QueryContext(ctx, q, specialistId)
	if err != nil {
		return nil, fmt.Errorf("error retrieving data: %w", err)
	}
	defer func() {
		_ = rows.Close()
	}()

	for rows.Next() {
		var t models.TimeOff

		err := rows.Scan(
			&t.Id,
			&t.StartDate,
			&t.EndDate,
			&t.SpecialistId)

		if err != nil {
			return nil, fmt.Errorf("error scanning row: %w", err)
		}

		t.StartDate = t.StartDate.Add(-2 * time.Hour)
		t.EndDate = t.EndDate.Add(-2 * time.Hour)

		timeOffs = append(timeOffs, t)
	}

	log.Println("Successfully retrieved TimeOffs for specialistId: ", specialistId)

	return timeOffs, nil
}
