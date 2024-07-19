package postgres

import (
	"backend/internal/dal/sql"
	"backend/internal/models"
	"context"
	"fmt"
	"log"
)

func (m *PG) GetReviewsBySpecialistId(specialistId int) ([]models.Review, error) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	q := sql.GetReviewsBySpecialistId
	var reviews []models.Review

	rows, err := m.DB.QueryContext(ctx, q, specialistId)
	if err != nil {
		return nil, fmt.Errorf("error retrieving data: %w", err)
	}
	defer func() {
		_ = rows.Close()
	}()

	for rows.Next() {
		var r models.Review

		err := rows.Scan(
			&r.Id,
			&r.Rating,
			&r.Client.Id,
			&r.Client.Name,
			&r.Client.SecondName,
			&r.Client.Email,
			&r.Client.UserId,
			&r.SpecialistService.Id,
			&r.SpecialistService.Name,
			&r.SpecialistService.PricePer,
			&r.SpecialistService.PriceMin,
			&r.SpecialistService.PriceMax,
			&r.SpecialistService.ServiceId,
			&r.Description,
			&r.CreatedAt)

		if err != nil {
			return nil, fmt.Errorf("error scanning row: %w", err)
		}

		reviews = append(reviews, r)
	}

	log.Println("Successfully retrieved Reviews")

	return reviews, nil
}
