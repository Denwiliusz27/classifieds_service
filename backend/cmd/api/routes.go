package api

import (
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"net/http"
)

func (app *Application) Routes() http.Handler {
	mux := chi.NewRouter()

	mux.Use(middleware.Recoverer)
	mux.Use(app.enableCORS)

	mux.Get("/cities", app.GetAllCities)

	mux.Route("/client", func(mux chi.Router) {
		mux.Post("/register", app.CreateClient)
	})

	mux.Route("/specialist", func(mux chi.Router) {
		mux.Post("/register", app.CreateSpecialist)
	})

	mux.Get("/specializations", app.GetAllSpecializations)

	mux.Get("/services", app.GetAllServices)

	return mux
}

func (app *Application) enableCORS(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")

		if r.Method == "OPTIONS" {
			w.Header().Set("Access-Control-Allow-Headers", "Accept,Content-Type,Authorization,X-CSRF-Token")
			w.Header().Set("Access-Control-Allow-Methods", "GET,PUT,DELETE,POST,PATCH,OPTIONS")
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			return
		} else {
			h.ServeHTTP(w, r)
		}
	})
}
