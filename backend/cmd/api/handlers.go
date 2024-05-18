package main

import (
	"fmt"
	"net/http"
)

func (app *application) Home(w http.ResponseWriter, r *http.Request) {
	var payload = struct {
		Status  string `json:"status"`
		Message string `json:"message"`
		Version string `json:"version"`
	}{
		Status:  "active",
		Message: "Go app is running",
		Version: "1.0.0",
	}

	_ = app.writeJSON(w, http.StatusOK, payload)
}

func (app *application) AllCities(w http.ResponseWriter, r *http.Request) {
	cities, err := app.DB.AllCities()
	if err != nil {
		app.errorJSON(w, err)
		fmt.Println("error getting Cities from db: ", err)
	}

	_ = app.writeJSON(w, http.StatusOK, cities)
}
