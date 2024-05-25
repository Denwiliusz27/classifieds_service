package postgres

import (
	"backend/internal/dal/sql"
	"backend/internal/models"
	"context"
	"fmt"
	"log"
)

func (m *PG) CreateClientAddress(address models.ClientAddresses, clientId int) (int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	q := sql.CreateClientAddress
	var newAddressId int
	err := m.DB.QueryRowContext(ctx, q,
		address.Street,
		address.BuildingNr,
		address.FlatNr,
		address.CityId,
		clientId,
	).Scan(&newAddressId)

	if err != nil {
		return 0, fmt.Errorf("cannot create new ClientAddress: %w", err)
	}

	log.Println("Successfully created ClientAddress with id ", newAddressId)
	return newAddressId, nil
}
