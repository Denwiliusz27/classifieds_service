package main

import (
	"backend/internal/repository"
	"fmt"
	"log"
	"net/http"
)

const port = 8080

type application struct {
	Domain         string
	DataSourceName string
	DB             repository.DBRepository
}

func main() {
	// set application config
	var app application

	// read from command line
	app.setFlags()

	// connect to database
	err := app.connectToDB()
	if err != nil {
		log.Fatal(err)
	}
	defer func() {
		_ = app.DB.Connection().Close()
	}()

	log.Println("Backend is starting on port", port)
	app.Domain = "example.com"

	// start a web server
	err = http.ListenAndServe(fmt.Sprintf(":%d", port), app.routes())
	if err != nil {
		log.Fatal(err)
	}
}
