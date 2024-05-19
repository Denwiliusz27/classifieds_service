package api

import (
	"backend/internal/dal"
	"fmt"
	"net/http"
)

type Application struct {
	DataSourceName string
	DB             dal.DAL
}

func (app *Application) AllCities(w http.ResponseWriter, r *http.Request) {
	cities, err := app.DB.AllCities()
	if err != nil {
		_ = app.errorJSON(w, err)
		fmt.Println("error getting Cities from db: ", err)
	}

	_ = app.writeJSON(w, http.StatusOK, cities)
}
