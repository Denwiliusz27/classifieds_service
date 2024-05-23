package api

import (
	"backend/internal/dal"
	"backend/internal/models"
	"fmt"
	"log"
	"net/http"
)

type Application struct {
	DataSourceName string
	DB             dal.DAL
}

func (app *Application) AllCities(w http.ResponseWriter, r *http.Request) {
	cities, err := app.DB.AllCities()
	if err != nil {
		fmt.Println("error getting Cities from db: ", err)
		_ = app.errorJSON(w, err)
		return
	}

	_ = app.writeJSON(w, http.StatusOK, cities)
}

func (app *Application) CreateClient(w http.ResponseWriter, r *http.Request) {
	var newClient models.ClientRegister

	err := app.readJSON(w, r, &newClient)
	if err != nil {
		_ = app.errorJSON(w, err)
		return
	}

	log.Println("I got new Client to create: ", newClient)

	client, err := app.DB.GetUserByEmailAndRole(newClient.Email, "client")
	if client != nil {
		log.Println("error: ", err)
		log.Println("User with email '", newClient.Email, "' already exists")
		_ = app.errorJSON(w, fmt.Errorf("klient o adresie email '%s' już istnieje", newClient.Email), http.StatusFound)
		return
	}

	userId, err := app.DB.CreateUser(newClient)
	if err != nil {
		log.Println(err)
		_ = app.errorJSON(w, err)
		return
	}

	clientId, err := app.DB.CreateClient(userId)
	if err != nil {
		log.Println(err)
		_ = app.errorJSON(w, err)
		return
	}

	for _, address := range newClient.Addresses {
		_, err := app.DB.CreateClientAddress(address, clientId)
		if err != nil {
			log.Println(err)
			_ = app.errorJSON(w, err)
			return
		}
	}

	_ = app.writeJSON(w, http.StatusOK, clientId)
}
