package postgres

import (
	"backend/internal/dal/sql"
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
