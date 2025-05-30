package postgres

import (
	"backend/internal/dal/sql"
	"backend/internal/models"
	"context"
	"fmt"
	"log"
	"time"
)

func (m *PG) CreateUser(name string, secondName string, email string, password string, role string) (int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	q := sql.CreateUser
	var newUserId int
	err := m.DB.QueryRowContext(ctx, q,
		name,
		secondName,
		email,
		password,
		time.Now().Add(2*time.Hour),
		role,
	).Scan(&newUserId)

	if err != nil {
		return 0, fmt.Errorf("cannot create new User: %w", err)
	}

	log.Println("Successfully created User with id ", newUserId)

	return newUserId, nil
}

func (m *PG) GetUserByEmailAndRole(email string, role string) (*models.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	q := sql.GetUserByEmailAndRole
	var user models.User
	row := m.DB.QueryRowContext(ctx, q,
		email,
		role,
	)
	err := row.Scan(
		&user.Id,
		&user.Name,
		&user.SecondName,
		&user.Email,
		&user.Password,
		&user.CreatedAt,
		&user.Role,
	)

	if err != nil {
		return nil, fmt.Errorf("error getting User: %w", err)
	}

	log.Println("Successfully retrieved User by email and role")

	return &user, nil
}

func (m *PG) GetUserById(id int) (*models.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	q := sql.GetUserById
	var user models.User
	row := m.DB.QueryRowContext(ctx, q,
		id,
	)
	err := row.Scan(
		&user.Id,
		&user.Name,
		&user.SecondName,
		&user.Email,
		&user.Password,
		&user.CreatedAt,
		&user.Role,
	)

	if err != nil {
		return nil, fmt.Errorf("error getting User: %w", err)
	}

	log.Println("Successfully retrieved User by id")

	return &user, nil
}
