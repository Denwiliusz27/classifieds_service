package api

import (
	"backend/cmd/auth"
	"backend/internal/dal"
	"backend/internal/models"
	"fmt"
	"github.com/golang-jwt/jwt/v4"
	"log"
	"net/http"
	"strconv"
)

type Application struct {
	DataSourceName string
	DB             dal.DAL
	Domain         string
	Auth           auth.Auth
	JWTSecret      string
	JWTIssuer      string
	JWTAudience    string
	CookieDomain   string
}

func (app *Application) Authenticate(w http.ResponseWriter, r *http.Request) {
	// read json payload
	var userRequest models.UserLogin

	err := app.readJSON(w, r, &userRequest)
	if err != nil {
		_ = app.errorJSON(w, err)
		return
	}

	// validate user against database
	user, err := app.DB.GetUserByEmailAndRole(userRequest.Email, userRequest.Role)
	if err != nil {
		if userRequest.Role == "client" {
			_ = app.errorJSON(w, fmt.Errorf("klient o adresie email '%s' nie istnieje", userRequest.Email), http.StatusBadRequest)

		} else {
			_ = app.errorJSON(w, fmt.Errorf("specjalista o adresie email '%s' nie istnieje", userRequest.Email), http.StatusBadRequest)
		}

		return
	}

	// check password
	// TODO change password to be a hash in DB
	if user.Password != userRequest.Password {
		_ = app.errorJSON(w, fmt.Errorf("niepoprawne hasło"), http.StatusBadRequest)
		return
	}

	// generate tokens
	tokens, err := app.Auth.GenerateTokenPair(user)
	if err != nil {
		_ = app.errorJSON(w, err)
		return
	}

	log.Println("Got token: ", tokens.Token)
	refreshCookie := app.Auth.GetRefreshCookie(tokens.RefreshToken)
	http.SetCookie(w, refreshCookie)

	app.writeJSON(w, http.StatusAccepted, tokens)
}

func (app *Application) GetAllCities(w http.ResponseWriter, r *http.Request) {
	cities, err := app.DB.GetCities()
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

	userId, err := app.DB.CreateUser(newClient.Name, newClient.SecondName, newClient.Email, newClient.Password, "client")
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

func (app *Application) GetClientReservations(w http.ResponseWriter, r *http.Request) {

}

func (app *Application) GetSpecialistReservations(w http.ResponseWriter, r *http.Request) {

}

func (app *Application) CreateSpecialist(w http.ResponseWriter, r *http.Request) {
	var newSpecialist models.SpecialistRegister

	err := app.readJSON(w, r, &newSpecialist)
	if err != nil {
		_ = app.errorJSON(w, err)
		return
	}

	log.Println("I got new Specialist to create: ", newSpecialist)

	client, err := app.DB.GetUserByEmailAndRole(newSpecialist.Email, "specialist")
	if client != nil {
		log.Println("error: ", err)
		log.Println("User with email '", newSpecialist.Email, "' already exists")
		_ = app.errorJSON(w, fmt.Errorf("specjalista o adresie email '%s' już istnieje", newSpecialist.Email), http.StatusFound)
		return
	}

	userId, err := app.DB.CreateUser(newSpecialist.Name, newSpecialist.SecondName, newSpecialist.Email, newSpecialist.Password, "specialist")
	if err != nil {
		log.Println(err)
		_ = app.errorJSON(w, err)
		return
	}

	specialistId, err := app.DB.CreateSpecialist(newSpecialist.PhoneNr, newSpecialist.Description, newSpecialist.CityId, userId, newSpecialist.SpecializationId)
	if err != nil {
		log.Println(err)
		_ = app.errorJSON(w, err)
		return
	}

	for _, service := range newSpecialist.Services {
		_, err := app.DB.CreateSpecialistService(service.MinPrice, service.MaxPrice, specialistId, service.ServiceId)
		if err != nil {
			log.Println(err)
			_ = app.errorJSON(w, err)
			return
		}
	}

	_ = app.writeJSON(w, http.StatusOK, specialistId)
}

func (app *Application) GetAllSpecializations(w http.ResponseWriter, r *http.Request) {
	specializations, err := app.DB.GetSpecializations()
	if err != nil {
		if err != nil {
			fmt.Println("error getting Specializations from db: ", err)
			_ = app.errorJSON(w, err)
			return
		}
	}

	_ = app.writeJSON(w, http.StatusOK, specializations)
}

func (app *Application) GetAllServices(w http.ResponseWriter, r *http.Request) {
	services, err := app.DB.GetServices()
	if err != nil {
		if err != nil {
			fmt.Println("error getting Services from db: ", err)
			_ = app.errorJSON(w, err)
			return
		}
	}

	_ = app.writeJSON(w, http.StatusOK, services)
}

func (app *Application) RefreshToken(w http.ResponseWriter, r *http.Request) {
	log.Println("Got refresh request")
	log.Println(r.Cookies())

	for _, cookie := range r.Cookies() {
		if cookie.Name == app.Auth.CookieName {
			claims := &auth.Claims{}
			refreshToken := cookie.Value

			// parse the token to get the claims
			_, err := jwt.ParseWithClaims(refreshToken, claims, func(token *jwt.Token) (interface{}, error) {
				return []byte(app.JWTSecret), nil
			})

			if err != nil {
				_ = app.errorJSON(w, fmt.Errorf("błąd autoryzacji"), http.StatusUnauthorized)
				return
			}

			// get userId from token claims
			userId, err := strconv.Atoi(claims.Subject)
			if err != nil {
				_ = app.errorJSON(w, fmt.Errorf("nieznany użytkownik"), http.StatusUnauthorized)
				return
			}

			user, err := app.DB.GetUserById(userId)
			if err != nil {
				_ = app.errorJSON(w, fmt.Errorf("nieznany użytkownik"), http.StatusUnauthorized)
				return
			}

			tokenPairs, err := app.Auth.GenerateTokenPair(user)
			if err != nil {
				_ = app.errorJSON(w, fmt.Errorf("błąd generowania tokenu"), http.StatusUnauthorized)
				return
			}

			log.Println("Refreshed token: ", tokenPairs.Token)

			http.SetCookie(w, app.Auth.GetRefreshCookie(tokenPairs.RefreshToken))

			app.writeJSON(w, http.StatusOK, tokenPairs)
		}
	}
}

func (app *Application) Logout(w http.ResponseWriter, r *http.Request) {
	http.SetCookie(w, app.Auth.GetExpiredRefreshCookie())
	w.WriteHeader(http.StatusAccepted)
}
