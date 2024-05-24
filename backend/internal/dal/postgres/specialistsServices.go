package postgres

import (
	"backend/internal/dal/sql"
	"context"
	"fmt"
	"log"
)

func (m *PG) CreateSpecialistService(minPrice int, maxPrice int, specialistId int, serviceId int) (int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	q := sql.CreateSpecialistService
	var newSpecialistId int
	err := m.DB.QueryRowContext(ctx, q,
		minPrice,
		maxPrice,
		specialistId,
		serviceId,
	).Scan(&newSpecialistId)

	if err != nil {
		return 0, fmt.Errorf("cannot create new Client: %w", err)
	}
	log.Println("Successfully created Specialist with id ", newSpecialistId)

	return newSpecialistId, nil
}
