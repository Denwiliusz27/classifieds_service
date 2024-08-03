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
		mux.Use(app.authRequired)
		mux.Get("/reservations", app.GetClientReservations)
		mux.Get("/info/{user_id}", app.GetClientInfoByUserId)
		mux.Get("/addresses/{client_id}", app.GetClientAddressesByClientId)
		mux.Post("/create_visit", app.CreateVisit)
		mux.Patch("/update_visit", app.UpdateVisitByClient)
	})

	mux.Post("/register_client", app.CreateClient)

	mux.Route("/specialist", func(mux chi.Router) {
		mux.Use(app.authRequired)
		mux.Get("/reservations", app.GetSpecialistReservations)
		mux.Get("/info/{user_id}", app.GetSpecialistInfoByUserId)
		mux.Post("/create_time_off", app.CreateTimeOff)
		mux.Patch("/update_visit", app.UpdateVisitBySpecialist)
	})

	mux.Get("/specialists/{specialization_id}/{city_id}/{service_id}", app.GetSpecialistsBySpecializationIdCityIdServiceId)
	mux.Get("/specialist/detailed_info/{specialist_id}", app.GetSpecialistDetailedInfo)

	mux.Post("/register_specialist", app.CreateSpecialist)

	mux.Post("/authenticate", app.Authenticate)
	mux.Get("/refresh_token", app.RefreshToken)
	mux.Get("/logout", app.Logout)

	mux.Get("/specializations", app.GetAllSpecializations)

	mux.Get("/services", app.GetAllServices)

	mux.Get("/time_off/{specialist_id}", app.GetTimeOffBySpecialistId)

	mux.Get("/visits/{specialist_id}/{client_id}", app.GetCalendarVisitsBySpecialistIdOrClientId)

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

func (app *Application) authRequired(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_, _, err := app.Auth.GetTokenFromHeaderAndVerify(w, r)
		if err != nil {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		next.ServeHTTP(w, r)
	})
}
