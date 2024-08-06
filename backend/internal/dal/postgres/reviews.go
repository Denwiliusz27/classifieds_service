package postgres

import (
	"backend/internal/dal/sql"
	"backend/internal/models"
	"context"
	sql2 "database/sql"
	"errors"
	"fmt"
	"log"
	"time"
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

func (m *PG) GetReviewByVisitId(visitId int) (*models.Review, error) {
	q := sql.GetReviewByVisitId
	var review models.Review

	err := m.DB.QueryRow(q, visitId).Scan(&review.Id,
		&review.Rating,
		&review.Client.Id,
		&review.Client.Name,
		&review.Client.SecondName,
		&review.Client.Email,
		&review.Client.UserId,
		&review.SpecialistService.Id,
		&review.SpecialistService.Name,
		&review.SpecialistService.PricePer,
		&review.SpecialistService.PriceMin,
		&review.SpecialistService.PriceMax,
		&review.SpecialistService.ServiceId,
		&review.Description,
		&review.CreatedAt)
	if errors.Is(err, sql2.ErrNoRows) {
		return nil, nil
	} else if err != nil {
		return nil, fmt.Errorf("error running query: %w", err)
	}

	log.Println("Successfully retrieved Review by visitId")

	return &review, nil
}

func (m *PG) CreateReview(review models.ReviewRequest) (int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	var newReviewId int

	q := sql.CreateReview
	err := m.DB.QueryRowContext(ctx, q,
		review.Rating,
		review.Description,
		review.SpecialistId,
		review.ClientId,
		time.Now(),
		review.SpecialistServiceId,
		review.VisitId,
	).Scan(&newReviewId)

	if err != nil {
		return 0, fmt.Errorf("cannot create new Review: %w", err)
	}
	log.Println("Successfully created Review with id ", newReviewId)

	return newReviewId, nil
}
