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

func (m *PG) CreateTimeOff(newTimeOff models.TimeOffRequest) (int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	var newTimeOffId int

	q := sql.CreateTimeOff
	err := m.DB.QueryRowContext(ctx, q,
		newTimeOff.StartDate.Add(2*time.Hour),
		newTimeOff.EndDate.Add(2*time.Hour),
		newTimeOff.SpecialistId,
	).Scan(&newTimeOffId)

	if err != nil {
		return 0, fmt.Errorf("cannot create new TimeOff: %w", err)
	}
	log.Println("Successfully created TimeOff with id ", newTimeOffId)

	return newTimeOffId, nil
}
