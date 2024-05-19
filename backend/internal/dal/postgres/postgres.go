package postgres

import (
	"database/sql"
)

type PG struct {
	DB *sql.DB
}

func (m *PG) Connection() *sql.DB {
	return m.DB
}
