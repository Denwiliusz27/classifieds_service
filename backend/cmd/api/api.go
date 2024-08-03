package api

import (
	"backend/cmd/auth"
	"backend/internal/dal"
	"backend/internal/models"
	"fmt"
	"github.com/go-chi/chi/v5"
	"github.com/golang-jwt/jwt/v4"
	"log"
	"net/http"
	"strconv"
	"time"
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

	userRoleCookie := app.Auth.GetUserRoleCookie(user.Role)
	http.SetCookie(w, userRoleCookie)

	_ = app.writeJSON(w, http.StatusAccepted, tokens)
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

func (app *Application) GetClientInfoByUserId(w http.ResponseWriter, r *http.Request) {
	userId, err := strconv.Atoi(chi.URLParam(r, "user_id"))
	if err != nil {
		fmt.Println("cannot find parameter: ", err)
		_ = app.errorJSON(w, err)
		return
	}

	client, err := app.DB.GetClientByUserId(userId)
	if err != nil {
		fmt.Println("error getting Client by user_id from db: ", err)
		_ = app.errorJSON(w, err)
		return
	}

	_ = app.writeJSON(w, http.StatusOK, client)
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

func (app *Application) GetSpecialistInfoByUserId(w http.ResponseWriter, r *http.Request) {
	userId, err := strconv.Atoi(chi.URLParam(r, "user_id"))
	if err != nil {
		fmt.Println("cannot find parameter: ", err)
		_ = app.errorJSON(w, err)
		return
	}

	specialist, err := app.DB.GetSpecialistByUserId(userId)
	if err != nil {
		fmt.Println("error getting Specialist by user_id from db: ", err)
		_ = app.errorJSON(w, err)
		return
	}

	_ = app.writeJSON(w, http.StatusOK, specialist)
}

func (app *Application) GetSpecialistsBySpecializationIdCityIdServiceId(w http.ResponseWriter, r *http.Request) {
	var specId *int
	var cId *int
	var servId *int

	specializationId, err := strconv.Atoi(chi.URLParam(r, "specialization_id"))
	if err != nil {
		fmt.Println("cannot find parameter specialization_id: ", err)
		_ = app.errorJSON(w, err)
		return
	}
	if specializationId == 0 {
		specId = nil
	} else {
		specId = &specializationId
	}

	cityId, err := strconv.Atoi(chi.URLParam(r, "city_id"))
	if err != nil {
		fmt.Println("cannot find parameter city_id: ", err)
		_ = app.errorJSON(w, err)
		return
	}
	if cityId == 0 {
		cId = nil
	} else {
		cId = &cityId
	}

	serviceId, err := strconv.Atoi(chi.URLParam(r, "service_id"))
	if err != nil {
		fmt.Println("cannot find parameter service_id: ", err)
		_ = app.errorJSON(w, err)
		return
	}
	if serviceId == 0 {
		servId = nil
	} else {
		servId = &serviceId
	}

	specialists, err := app.DB.GetSpecialistsBySpecializationIdCityIdServiceId(specId, cId, servId)
	if err != nil {
		fmt.Println("error getting Specialist by specialization_id from db: ", err)
		_ = app.errorJSON(w, err)
		return
	}

	_ = app.writeJSON(w, http.StatusOK, specialists)
}

func (app *Application) GetSpecialistDetailedInfo(w http.ResponseWriter, r *http.Request) {
	specialistId, err := strconv.Atoi(chi.URLParam(r, "specialist_id"))
	if err != nil {
		fmt.Println("cannot find parameter specialist_id: ", err)
		_ = app.errorJSON(w, err)
		return
	}

	specialistServices, err := app.DB.GetSpecialistServicesBySpecialistId(specialistId)
	if err != nil {
		fmt.Println("error getting Specialist services by specialist_id from db: ", err)
		_ = app.errorJSON(w, err)
		return
	}

	specialistProfileInfo, err := app.DB.GetSpecialistProfileInfoBySpecialistId(specialistId)
	if err != nil {
		fmt.Println("error getting Specialist profile info by specialist_id from db: ", err)
		_ = app.errorJSON(w, err)
		return
	}

	specialistReviews, err := app.DB.GetReviewsBySpecialistId(specialistId)
	if err != nil {
		fmt.Println("error getting Specialist reviews by specialist_id from db: ", err)
		_ = app.errorJSON(w, err)
		return
	}

	specialist := models.SpecialistExtendedInfo{
		Info:     *specialistProfileInfo,
		Services: specialistServices,
		Reviews:  specialistReviews,
	}

	_ = app.writeJSON(w, http.StatusOK, specialist)
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
	log.Println("Got cookies: ", r.Cookies())
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
		} else if cookie.Name == "user_role" {
			http.SetCookie(w, app.Auth.GetUserRoleCookie(cookie.Value))
		}
	}
}

func (app *Application) Logout(w http.ResponseWriter, r *http.Request) {
	http.SetCookie(w, app.Auth.GetExpiredRefreshCookie())

	for _, cookie := range r.Cookies() {
		if cookie.Name != app.Auth.CookieName {
			http.SetCookie(w, app.Auth.GetExpiredUserRoleCookie(cookie.Name))
		}
	}
	w.WriteHeader(http.StatusAccepted)
}

func (app *Application) GetTimeOffBySpecialistId(w http.ResponseWriter, r *http.Request) {
	specialistId, err := strconv.Atoi(chi.URLParam(r, "specialist_id"))
	if err != nil {
		fmt.Println("cannot find parameter specialist_id: ", err)
		_ = app.errorJSON(w, err)
		return
	}

	timeOffs, err := app.DB.GetTimeOffBySpecialistId(specialistId)
	if err != nil {
		fmt.Println("error getting TimeOff from db for SpecialistId=", specialistId, " : ", err)
		_ = app.errorJSON(w, err)
		return
	}

	app.writeJSON(w, http.StatusOK, timeOffs)
}

func (app *Application) GetCalendarVisitsBySpecialistIdOrClientId(w http.ResponseWriter, r *http.Request) {
	var specId *int
	var clId *int

	specialistId, err := strconv.Atoi(chi.URLParam(r, "specialist_id"))
	if err != nil {
		fmt.Println("cannot find parameter specialist_id: ", err)
		_ = app.errorJSON(w, err)
		return
	}
	if specialistId == 0 {
		specId = nil
	} else {
		specId = &specialistId
	}

	clientId, err := strconv.Atoi(chi.URLParam(r, "client_id"))
	if err != nil {
		fmt.Println("cannot find parameter client_id: ", err)
		_ = app.errorJSON(w, err)
		return
	}
	if clientId == 0 {
		clId = nil
	} else {
		clId = &clientId
	}

	visits, err := app.DB.GetCalendarVisitsBySpecialistIdOrClientId(specId, clId)
	if err != nil {
		fmt.Println("error getting Calendar Visits from db: ", err)
		_ = app.errorJSON(w, err)
		return
	}

	_ = app.writeJSON(w, http.StatusOK, visits)
}

func (app *Application) CreateVisit(w http.ResponseWriter, r *http.Request) {
	var newVisitRequest models.VisitRequest

	err := app.readJSON(w, r, &newVisitRequest)
	if err != nil {
		_ = app.errorJSON(w, err)
		return
	}

	log.Println("I got new Visit to create: ", newVisitRequest)

	visits, err := app.DB.GetCalendarVisitsBySpecialistIdOrClientId(&newVisitRequest.SpecialistId, nil)
	if err != nil {
		fmt.Println("error getting Calendar Visits from db: ", err)
		_ = app.errorJSON(w, err)
		return
	}

	for _, v := range visits {
		if v.Info.Status == "declined" {
			continue
		}

		if isVisitOverlapping(newVisitRequest.StartDate, newVisitRequest.EndDate, v.Info.StartDate, v.Info.EndDate) {
			fmt.Println("there already exist visit on this time")
			_ = app.errorJSON(w, fmt.Errorf("Wybrany termin rozpoczęcia lub zakońcenia nakłada się na istniejącą już wizytę"))
			return
		}
	}

	timeOffs, err := app.DB.GetTimeOffBySpecialistId(newVisitRequest.SpecialistId)
	for _, t := range timeOffs {
		if isVisitOverlapping(newVisitRequest.StartDate, newVisitRequest.EndDate, t.StartDate, t.EndDate) {
			fmt.Println("visit is overlapping timeOff")
			_ = app.errorJSON(w, fmt.Errorf("Wybrany termin nakłada się na termin urlopu specjlisty"))
			return
		}
	}

	visitId, err := app.DB.CreateVisit(newVisitRequest)
	if err != nil {
		log.Println(err)
		_ = app.errorJSON(w, err)
		return
	}

	_ = app.writeJSON(w, http.StatusOK, visitId)
}

func (app *Application) GetClientAddressesByClientId(w http.ResponseWriter, r *http.Request) {
	clientId, err := strconv.Atoi(chi.URLParam(r, "client_id"))
	if err != nil {
		fmt.Println("cannot find parameter client_id: ", err)
		_ = app.errorJSON(w, err)
		return
	}

	clientAddresses, err := app.DB.GetClientAddressesByClientId(clientId)
	if err != nil {
		fmt.Println("error getting ClientAddresses from db: ", err)
		_ = app.errorJSON(w, err)
		return
	}

	_ = app.writeJSON(w, http.StatusOK, clientAddresses)
}

func (app *Application) CreateTimeOff(w http.ResponseWriter, r *http.Request) {
	var newTimeOff models.TimeOffRequest

	err := app.readJSON(w, r, &newTimeOff)
	if err != nil {
		_ = app.errorJSON(w, err)
		return
	}

	log.Println("I got new TimeOff to create: ", newTimeOff)

	// sprawdzenie czy nakłada się na jakieś istniejące wizyty
	visits, err := app.DB.GetCalendarVisitsBySpecialistIdOrClientId(&newTimeOff.SpecialistId, nil)
	if err != nil {
		fmt.Println("error getting Calendar Visits from db: ", err)
		_ = app.errorJSON(w, err)
		return
	}

	for _, v := range visits {
		if v.Info.Status == "declined" {
			continue
		}

		if isVisitOverlapping(newTimeOff.StartDate, newTimeOff.EndDate, v.Info.StartDate, v.Info.EndDate) {
			fmt.Println("timeOff overlapping on existing visits")
			_ = app.errorJSON(w, fmt.Errorf("Wybrany termin urlopu nakłada się na istniejącą wizytę"))
			return
		}
	}

	newTimeOffId, err := app.DB.CreateTimeOff(newTimeOff)
	if err != nil {
		log.Println(err)
		_ = app.errorJSON(w, err)
		return
	}

	_ = app.writeJSON(w, http.StatusOK, newTimeOffId)
}

func (app *Application) UpdateVisitBySpecialist(w http.ResponseWriter, r *http.Request) {
	var visit models.VisitCalendar

	err := app.readJSON(w, r, &visit)
	if err != nil {
		_ = app.errorJSON(w, err)
		return
	}

	log.Println("I got Visit to update: ", visit)

	if !(visit.Info.Status == "declined") {
		// sprawdzenie czy nakłada się na jakieś istniejące wizyty
		visits, err := app.DB.GetCalendarVisitsBySpecialistIdOrClientId(&visit.Specialist.Id, nil)
		if err != nil {
			fmt.Println("error getting Calendar Visits from db: ", err)
			_ = app.errorJSON(w, err)
			return
		}

		for _, v := range visits {
			if v.Info.Status == "declined" {
				continue
			}

			if v.Info.Id != visit.Info.Id {
				if isVisitOverlapping(visit.Info.StartDate, visit.Info.EndDate, v.Info.StartDate, v.Info.EndDate) {
					fmt.Println("visit overlapping on existing visits")
					_ = app.errorJSON(w, fmt.Errorf("Wybrany termin nakłada się na istniejącą wizytę"))
					return
				}
			}
		}
	}

	err = app.DB.UpdateVisit(visit)
	if err != nil {
		log.Println(err)
		_ = app.errorJSON(w, err)
		return
	}

	_ = app.writeJSON(w, http.StatusOK, visit.Info.Id)
}

func (app *Application) UpdateVisitByClient(w http.ResponseWriter, r *http.Request) {
	var visit models.VisitCalendar

	err := app.readJSON(w, r, &visit)
	if err != nil {
		_ = app.errorJSON(w, err)
		return
	}

	log.Println("I got Visit to update: ", visit)

	if !(visit.Info.Status == "declined") {
		// sprawdzenie czy nakłada się na jakieś istniejące wizyty
		visits, err := app.DB.GetCalendarVisitsBySpecialistIdOrClientId(&visit.Specialist.Id, nil)
		if err != nil {
			fmt.Println("error getting Calendar Visits from db: ", err)
			_ = app.errorJSON(w, err)
			return
		}

		for _, v := range visits {
			if v.Info.Status == "declined" {
				continue
			}

			if v.Info.Id != visit.Info.Id {
				if isVisitOverlapping(visit.Info.StartDate, visit.Info.EndDate, v.Info.StartDate, v.Info.EndDate) {
					fmt.Println("visit overlapping on existing visits")
					_ = app.errorJSON(w, fmt.Errorf("Wybrany termin nakłada się na istniejącą wizytę specjalisty"))
					return
				}
			}
		}

		timeOffs, err := app.DB.GetTimeOffBySpecialistId(visit.Specialist.Id)
		for _, t := range timeOffs {
			if isVisitOverlapping(visit.Info.StartDate, visit.Info.EndDate, t.StartDate, t.EndDate) {
				fmt.Println("visit is overlapping timeOff")
				_ = app.errorJSON(w, fmt.Errorf("Wybrany termin nakłada się na termin urlopu specjlisty"))
				return
			}
		}
	}

	err = app.DB.UpdateVisit(visit)
	if err != nil {
		log.Println(err)
		_ = app.errorJSON(w, err)
		return
	}

	_ = app.writeJSON(w, http.StatusOK, visit.Info.Id)
}

func isVisitOverlapping(visitStartDate, visitEndDate, existingStartDate, existingEndDate time.Time) bool {
	if (visitStartDate.Before(existingStartDate) && (visitEndDate.After(existingStartDate) && visitEndDate.Before(existingEndDate))) ||
		(visitStartDate.Before(existingStartDate) && visitEndDate.Equal(existingEndDate)) ||
		(visitStartDate.Before(existingStartDate) && visitEndDate.After(existingEndDate)) ||
		(visitStartDate.Equal(existingStartDate) && (visitEndDate.After(existingStartDate) && visitEndDate.Before(existingEndDate))) ||
		(visitStartDate.Equal(existingStartDate) && visitEndDate.Equal(existingEndDate)) ||
		(visitStartDate.Equal(existingStartDate) && visitEndDate.After(existingEndDate)) ||
		((visitStartDate.After(existingStartDate) && visitStartDate.Before(existingEndDate)) && visitEndDate.Equal(existingEndDate)) ||
		((visitStartDate.After(existingStartDate) && visitStartDate.Before(existingEndDate)) && (visitEndDate.After(existingStartDate) && visitEndDate.Before(existingEndDate))) ||
		((visitStartDate.After(existingStartDate) && visitStartDate.Before(existingEndDate)) && visitEndDate.After(existingEndDate)) {
		return true
	}
	return false
}
