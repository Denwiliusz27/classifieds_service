package main

import (
	"backend/internal/repository/dbrepository"
	"database/sql"
	"flag"
	"log"

	_ "github.com/jackc/pgconn"
	_ "github.com/jackc/pgx/v4"
	_ "github.com/jackc/pgx/v4/stdlib"
)

func (app *application) connectToDB() error {
	db, err := sql.Open("pgx", app.DataSourceName)
	if err != nil {
		log.Println("Error in 'sql.Open' function call")
		return err
	}

	err = db.Ping()
	if err != nil {
		log.Println("Error pinging DB")
		return err
	}

	log.Println("Successfully connected to DB")
	app.DB = &dbrepository.PostgresDBRepository{DB: db}

	return nil
}

func (app *application) setFlags() {
	flag.StringVar(&app.DataSourceName, "dsn", "host=localhost dbname=classifieds_service port=5432 user=admin password=password timezone=UTC sslmode=disable connect_timeout=5", "Text for connecting to Postgres db")
	flag.Parse()
}
