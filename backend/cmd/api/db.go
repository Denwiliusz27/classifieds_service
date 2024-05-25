package api

import (
	"backend/internal/dal/postgres"
	"database/sql"
	"flag"
	"log"

	_ "github.com/jackc/pgconn"
	_ "github.com/jackc/pgx/v4"
	_ "github.com/jackc/pgx/v4/stdlib"
)

func (app *Application) ConnectToDB() error {
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

	app.DB = &postgres.PG{DB: db}

	log.Println("Successfully connected to DB")
	return nil
}

func (app *Application) SetFlags() {
	flag.StringVar(&app.DataSourceName, "dsn", "host=localhost dbname=classifieds_service port=5432 user=admin password=password timezone=UTC sslmode=disable connect_timeout=5", "Text for connecting to Postgres db")
	flag.StringVar(&app.JWTSecret, "jwt-secret", "jwttopsecret", "signing secret")
	flag.StringVar(&app.JWTIssuer, "jwt-issuer", "zlota_raczka.com", "signing issuer")
	flag.StringVar(&app.JWTAudience, "jwt-audience", "zlota_raczka.com", "signing audience")
	flag.StringVar(&app.CookieDomain, "cookie-domain", "localhost", "cookie domain")
	flag.StringVar(&app.Domain, "domain", "zlota_raczka.com", "domain")
	flag.Parse()
}
