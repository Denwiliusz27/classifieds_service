package postgres

import (
	"backend/internal/dal/sql"
	"backend/internal/models"
	"context"
	"fmt"
	"log"
)

func (m *PG) CreateClient(userId int) (int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	q := sql.CreateClient
	var newClientId int
	err := m.DB.QueryRowContext(ctx, q,
		userId,
	).Scan(&newClientId)

	if err != nil {
		return 0, fmt.Errorf("cannot create new Client: %w", err)
	}
	log.Println("Successfully created Client with id ", newClientId)

	return newClientId, nil
}

func (m *PG) GetClientByUserId(userId int) (*models.Client, error) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	q := sql.GetClientByUserId
	var client models.Client
	row := m.DB.QueryRowContext(ctx, q,
		userId,
	)

	err := row.Scan(
		&client.Id,
		&client.Name,
		&client.SecondName,
		&client.Email,
		&client.UserId,
	)

	if err != nil {
		return nil, fmt.Errorf("error getting client by userId: %w", err)
	}
	log.Println("Successfully retrieved client")

	return &client, nil
}
