package postgres

import (
	"backend/internal/dal/sql"
	"backend/internal/models"
	"context"
	"fmt"
	"log"
)

func (m *PG) GetNotificationsByClientId(clientId int) ([]models.Notification, error) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	q := sql.GetNotificationsByClientId
	var notifications []models.Notification

	rows, err := m.DB.QueryContext(ctx, q, clientId)
	if err != nil {
		return nil, fmt.Errorf("error retrieving data: %w", err)
	}
	defer func() {
		_ = rows.Close()
	}()

	for rows.Next() {
		var n models.Notification

		err := rows.Scan(
			&n.Id,
			&n.Type,
			&n.Notifier,
			&n.Read,
			&n.CreatedAt,
			&n.Client.Id,
			&n.Client.Name,
			&n.Client.SecondName,
			&n.Specialist.Id,
			&n.Specialist.Name,
			&n.Specialist.SecondName,
			&n.Specialist.Specialization,
			&n.Specialist.City,
			&n.Visit.Id,
			&n.Visit.Service,
		)

		if err != nil {
			return nil, fmt.Errorf("error scanning row: %w", err)
		}

		notifications = append(notifications, n)
	}

	log.Println("Successfully retrieved Notifications for clientId: ", clientId)

	return notifications, nil
}

func (m *PG) GetNotificationsBySpecialistId(specialistId int) ([]models.Notification, error) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	q := sql.GetNotificationsBySpecialistId
	var notifications []models.Notification

	rows, err := m.DB.QueryContext(ctx, q, specialistId)
	if err != nil {
		return nil, fmt.Errorf("error retrieving data: %w", err)
	}
	defer func() {
		_ = rows.Close()
	}()

	for rows.Next() {
		var n models.Notification

		err := rows.Scan(
			&n.Id,
			&n.Type,
			&n.Notifier,
			&n.Read,
			&n.CreatedAt,
			&n.Client.Id,
			&n.Client.Name,
			&n.Client.SecondName,
			&n.Specialist.Id,
			&n.Specialist.Name,
			&n.Specialist.SecondName,
			&n.Specialist.Specialization,
			&n.Specialist.City,
			&n.Visit.Id,
			&n.Visit.Service,
		)

		if err != nil {
			return nil, fmt.Errorf("error scanning row: %w", err)
		}

		notifications = append(notifications, n)
	}

	log.Println("Successfully retrieved Notifications for specialistId: ", specialistId)

	return notifications, nil
}
