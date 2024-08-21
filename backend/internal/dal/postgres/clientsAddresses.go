package postgres

import (
	"backend/internal/dal/sql"
	"backend/internal/models"
	"context"
	"fmt"
	"log"
)

func (m *PG) CreateClientAddress(address models.ClientAddressRegister, clientId int) (int, error) {
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

func (m *PG) GetClientAddressesByClientId(clientId int) ([]models.ClientAddress, error) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	q := sql.GetClientAddressesByClientId
	var clientAddresses []models.ClientAddress

	rows, err := m.DB.QueryContext(ctx, q, clientId)
	if err != nil {
		return nil, fmt.Errorf("error retrieving data: %w", err)
	}
	defer func() {
		_ = rows.Close()
	}()

	for rows.Next() {
		var ca models.ClientAddress

		err := rows.Scan(
			&ca.Id,
			&ca.Street,
			&ca.BuildingNr,
			&ca.FlatNr,
			&ca.City.Id,
			&ca.City.Name)

		if err != nil {
			return nil, fmt.Errorf("error scanning row: %w", err)
		}

		clientAddresses = append(clientAddresses, ca)
	}

	log.Println("Successfully retrieved ClientAddresses")

	return clientAddresses, nil
}
