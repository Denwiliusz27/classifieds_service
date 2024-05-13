package main

import (
	"backend/internal/models"
	"encoding/json"
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

	out, err := json.Marshal(payload)
	if err != nil {
		fmt.Print(err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(out)
}

func (app *application) AllCities(w http.ResponseWriter, r *http.Request) {
	var cities []models.City
	krakow := models.City{
		Id:   1,
		Name: "Kraków",
	}

	warsaw := models.City{
		Id:   2,
		Name: "Warszawa",
	}

	cities = append(cities, krakow)
	cities = append(cities, warsaw)

	out, err := json.Marshal(cities)
	if err != nil {
		fmt.Print(err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(out)
}
