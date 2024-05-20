package postgres

import (
	"database/sql"
	"time"
)

type PG struct {
	DB *sql.DB
}

const timeout = time.Second * 5

func (m *PG) Connection() *sql.DB {
	return m.DB
}
