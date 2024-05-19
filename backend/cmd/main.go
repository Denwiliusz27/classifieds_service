package main

import (
	"backend/cmd/api"
	"fmt"
	"log"
	"net/http"
)

const port = 8080

func main() {
	// set application config
	var app api.Application

	// read from command line
	app.SetFlags()

	// connect to database
	err := app.ConnectToDB()
	if err != nil {
		log.Fatal(err)
	}
	defer func() {
		_ = app.DB.Connection().Close()
	}()

	log.Println("Backend is starting on port", port)

	// start a web server
	err = http.ListenAndServe(fmt.Sprintf(":%d", port), app.Routes())
	if err != nil {
		log.Fatal(err)
	}
}
