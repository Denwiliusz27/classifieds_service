package postgres

import (
	"backend/internal/dal/sql"
	"context"
	"fmt"
	"log"
)

func (m *PG) CreateSpecialist(phoneNr string, description string, cityId int, userId int, specializationId int) (int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	q := sql.CreateSpecialist
	var newSpecialistId int
	err := m.DB.QueryRowContext(ctx, q,
		phoneNr,
		description,
		cityId,
		userId,
		specializationId,
	).Scan(&newSpecialistId)

	if err != nil {
		return 0, fmt.Errorf("cannot create new Client: %w", err)
	}
	log.Println("Successfully created Specialist with id ", newSpecialistId)

	return newSpecialistId, nil
}
