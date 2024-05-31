package main

import (
	"backend/cmd/api"
	"backend/cmd/auth"
	"fmt"
	"log"
	"net/http"
	"time"
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

	app.Auth = auth.Auth{
		Issuer:        app.JWTIssuer,
		Audience:      app.JWTAudience,
		Secret:        app.JWTSecret,
		TokenExpiry:   time.Minute * 15,
		RefreshExpiry: time.Hour * 24,
		CookieDomain:  app.CookieDomain,
		CookiePath:    "/",
		CookieName:    "refresh_token",
	}

	log.Println("Backend is starting on port", port)

	// start a web server
	err = http.ListenAndServe(fmt.Sprintf(":%d", port), app.Routes())
	if err != nil {
		log.Fatal(err)
	}
}
