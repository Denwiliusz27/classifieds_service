package postgres

import (
	"backend/internal/dal/sql"
	"backend/internal/models"
	"context"
	"fmt"
	"log"
	"time"
)

func (m *PG) GetCalendarVisitsBySpecialistIdOrClientId(specialistId *int, clientId *int) ([]models.VisitCalendar, error) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	q := sql.GetCalendarVisitsBySpecialistIdOrClientId
	var visits []models.VisitCalendar

	rows, err := m.DB.QueryContext(ctx, q, specialistId, clientId)
	if err != nil {
		return nil, fmt.Errorf("error retrieving data: %w", err)
	}
	defer func() {
		_ = rows.Close()
	}()

	for rows.Next() {
		var v models.VisitCalendar

		err := rows.Scan(
			&v.Info.Id,
			&v.Info.StartDate,
			&v.Info.EndDate,
			&v.Info.Price,
			&v.Info.Description,
			&v.Info.Status,
			&v.Info.ClientAddress.Id,
			&v.Info.ClientAddress.Street,
			&v.Info.ClientAddress.BuildingNr,
			&v.Info.ClientAddress.FlatNr,
			&v.Info.ClientAddress.City.Id,
			&v.Info.ClientAddress.City.Name,
			&v.Specialist.Id,
			&v.Specialist.Name,
			&v.Specialist.SecondName,
			&v.Specialist.Email,
			&v.Specialist.Specialization,
			&v.Specialist.City,
			&v.Specialist.PhoneNr,
			&v.Specialist.Description,
			&v.Specialist.CreatedAt,
			&v.Client.Id,
			&v.Client.Name,
			&v.Client.SecondName,
			&v.Client.Email,
			&v.Client.UserId,
			&v.Client.CreatedAt,
			&v.Service.Id,
			&v.Service.Name,
			&v.Service.PricePer,
			&v.Service.PriceMin,
			&v.Service.PriceMax,
			&v.Service.ServiceId)

		if err != nil {
			return nil, fmt.Errorf("error scanning row: %w", err)
		}

		v.Info.StartDate = v.Info.StartDate.Add(-2 * time.Hour)
		v.Info.EndDate = v.Info.EndDate.Add(-2 * time.Hour)

		visits = append(visits, v)
	}

	log.Println("Successfully retrieved Visits for calendar")

	return visits, nil
}

func (m *PG) CreateVisit(visitRequest models.VisitRequest) (int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	q := sql.CreateVisit

	var newVisitId int
	err := m.DB.QueryRowContext(ctx, q,
		visitRequest.StartDate.Add(2*time.Hour),
		visitRequest.EndDate.Add(2*time.Hour),
		visitRequest.Description,
		visitRequest.ClientAddressId,
		visitRequest.ClientId,
		visitRequest.SpecialistId,
		visitRequest.SpecialistServiceId,
	).Scan(&newVisitId)

	if err != nil {
		return 0, fmt.Errorf("cannot create new Visit: %w", err)
	}
	log.Println("Successfully created Visit with id ", newVisitId)

	return newVisitId, nil
}
