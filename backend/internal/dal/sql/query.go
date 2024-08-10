package sql

// --- CITIES ---

const GetCities = `
	SELECT * 
	FROM
		cities;
`

// --- USERS ---

const CreateUser = `
	INSERT INTO
		users
	(name, second_name, email, password, created_at, role)
	VALUES 
	    ($1, $2, $3, $4, $5, $6)
	RETURNING id;
`

const GetUserByEmailAndRole = `
	SELECT * 
	FROM
	    users
	WHERE 
	    email = $1 AND
	    role = $2;
`

const GetUserById = `
	SELECT * 
	FROM
	    users
	WHERE 
	    id = $1;
`

// --- CLIENTS ---

const CreateClient = `
	INSERT INTO
		clients
	(user_id)
	VALUES 
	    ($1)
	RETURNING id;
`

const GetClientByUserId = `
	SELECT 
	    clients.id, users.name, users.second_name, users.email, clients.user_id, users.created_at
	FROM 
	    clients
	LEFT JOIN 
	        users on clients.user_id = users.id
	GROUP BY 
	    clients.id, users.name, users.second_name, users.email, clients.user_id, users.role, users.created_at
	HAVING 
	    clients.user_id = ($1) AND users.role = 'client' ;
`

// --- CLIENTS_ADDRESSES ---

const CreateClientAddress = `
	INSERT INTO
		clients_addresses
	(street, building_nr, flat_nr, city_id, client_id)
	VALUES 
	    ($1, $2, $3, $4, $5)
	RETURNING id;
`

const GetClientAddressesByClientId = `
	SELECT 
		clients_addresses.id, clients_addresses.street, clients_addresses.building_nr, clients_addresses.flat_nr, clients_addresses.city_id, cities.name
	FROM
	    clients_addresses
	LEFT JOIN
		cities on cities.id = clients_addresses.city_id
	WHERE
	    clients_addresses.client_id = ($1);
`

// --- SPECIALIZATIONS ---

const GetSpecializations = `
	SELECT *
	FROM
		specializations;
`

// --- SERVICES ---

const GetServices = `
	SELECT * 
	FROM
		services;
`

// --- SPECIALIST ---

const CreateSpecialist = `
	INSERT INTO
		specialists
	(phone_nr, description, city_id, user_id, specialization_id)
	VALUES
	    ($1, $2, $3, $4, $5)
	RETURNING id;
`

const GetSpecialistByUserId = `
	SELECT 
	    specialists.id, users.name, users.second_name, users.email, specialists.description, specialists.phone_nr, specialists.specialization_id, specialists.city_id, specialists.user_id, users.created_at
	FROM 
	    specialists
	LEFT JOIN 
	        users on specialists.user_id = users.id
	GROUP BY 
	    specialists.id, users.name, users.second_name, users.email, specialists.description, specialists.phone_nr, specialists.specialization_id, specialists.city_id, specialists.user_id, users.role, users.created_at
	HAVING 
	    specialists.user_id = ($1) AND users.role = 'specialist';

`

const GetSpecialistsBySpecializationIdCityIdServiceId = `
	SELECT 
		specialists.id, users.name, users.second_name, specializations.name as specialization, cities.name as city, users.created_at, COALESCE(ROUND(AVG(reviews.rating), 2), 0.00) as rating, COUNT(DISTINCT reviews.id) as reviews 
	FROM 
		specialists
	LEFT JOIN 
		    users ON specialists.user_id = users.id
	LEFT JOIN
		    cities on specialists.city_id = cities.id
	LEFT JOIN
		    specializations on specialists.specialization_id = specializations.id
	LEFT JOIN
		    reviews on specialists.id = reviews.specialist_id
	WHERE
	    (specialists.specialization_id = ($1) OR ($1) IS NULL) AND
	    (specialists.city_id = ($2) OR ($2) IS NULL) AND
	    (specialists.id IN (
			SELECT specialist_id 
			FROM specialists_services 
			WHERE (specialists_services.service_id = $3 OR $3 IS NULL)
		) OR $3 IS NULL)
	GROUP BY 
	    specialists.id, users.name, users.second_name, specializations.name, cities.name, users.created_at
	ORDER BY
	    rating DESC, reviews DESC;
`

const GetSpecialistProfileInfoBySpecialistId = `
	SELECT
		specialists.id, users.name, users.second_name, users.email, specializations.name, cities.name, specialists.phone_nr, specialists.description, users.created_at
	FROM
	    specialists
	LEFT JOIN
		users ON specialists.user_id = users.id
	LEFT JOIN
		specializations ON specialists.specialization_id = specializations.id
	LEFT JOIN
		cities ON specialists.city_id = cities.id
	WHERE
	    specialists.id = ($1);
`

// --- SPECIALIST_SERVICE ---

const CreateSpecialistService = `
	INSERT INTO
		specialists_services
	(price_min, price_max, specialist_id, service_id)
	VALUES
	    ($1, $2, $3, $4)
	RETURNING id;
`

const GetSpecialistServicesBySpecialistId = `
	SELECT
		specialists_services.id, services.name, services.price_per, specialists_services.price_min, specialists_services.price_max, specialists_services.service_id
	FROM
	    specialists_services
	LEFT JOIN
		services on specialists_services.service_id = services.id
	WHERE
	    specialists_services.specialist_id = ($1);
`

// --- REVIEWS ---

const GetReviewsBySpecialistId = `
	SELECT
		reviews.id, reviews.rating, clients.id, users.name, users.second_name, users.email, users.id, 
		specialists_services.id, services.name, services.price_per, specialists_services.price_min, specialists_services.price_max, specialists_services.service_id,
		reviews.description, reviews.created_at
	FROM
	    reviews
	LEFT JOIN
		clients ON reviews.client_id = clients.id
	LEFT JOIN
		users ON clients.user_id = users.id
 	LEFT JOIN
		specialists_services ON reviews.specialist_service_id = specialists_services.id  
	LEFT JOIN
		services ON services.id = specialists_services.service_id
	WHERE
	    reviews.specialist_id = ($1)
	ORDER BY 
		reviews.created_at DESC ;
	;
`

const GetReviewByVisitId = `
	SELECT
		reviews.id, reviews.rating, clients.id, users.name, users.second_name, users.email, users.id, 
		specialists_services.id, services.name, services.price_per, specialists_services.price_min, specialists_services.price_max, specialists_services.service_id,
		reviews.description, reviews.created_at
	FROM
	    reviews
	LEFT JOIN
		clients ON reviews.client_id = clients.id
	LEFT JOIN
		users ON clients.user_id = users.id
 	LEFT JOIN
		specialists_services ON reviews.specialist_service_id = specialists_services.id  
	LEFT JOIN
		services ON services.id = specialists_services.service_id
	WHERE
	    reviews.visit_id = ($1)
`

const CreateReview = `
	INSERT INTO
		reviews
	(rating, description, specialist_id, client_id, created_at, specialist_service_id, visit_id)
	VALUES
	    ($1, $2, $3, $4, $5, $6, $7)
	RETURNING id;
`

// --- TIME_OFF ---

const GetTimeOffBySpecialistId = `
	SELECT *
	FROM
	    time_off
	WHERE
	    specialist_id = ($1) AND start_date >= current_date
	ORDER BY 
	    start_date ASC;
`

const CreateTimeOff = `
	INSERT INTO
		time_off
	(start_date, end_date, specialist_id)
	VALUES
	    ($1, $2, $3)
	RETURNING id;
`

// --- VISITS ---

const GetCalendarVisitsBySpecialistIdOrClientId = `
	SELECT
		visits.id, visits.start_date, visits.end_date, visits.price, visits.description, visits.status, 
		visits.client_address_id, clients_addresses.street, clients_addresses.building_nr, clients_addresses.flat_nr, clients_addresses.city_id, cities2.name, 
		specialists.id, u1.name, u1.second_name, u1.email, specializations.name, cities.name, specialists.phone_nr, specialists.description, u1.created_at, 
		clients.id, u2.name, u2.second_name, u2.email, u2.id, u2.created_at, 
		specialists_services.id,
		services.name, services.price_per, 
		specialists_services.price_min, 
		specialists_services.price_max,
		specialists_services.service_id
	FROM
	    visits
	LEFT JOIN
		specialists  ON visits.specialist_id = specialists.id
  	LEFT JOIN
		users as u1 ON specialists.user_id = u1.id
	LEFT JOIN
		specializations ON specialists.specialization_id = specializations.id
  	LEFT JOIN 
  		cities ON cities.id = specialists.city_id 	
	LEFT JOIN
	    clients_addresses ON clients_addresses.id = visits.client_address_id
	LEFT JOIN 
  		cities as cities2 ON cities2.id = clients_addresses.city_id
   	LEFT JOIN
		clients ON clients.id = visits.client_id
   	LEFT JOIN
		users as u2 ON clients.user_id = u2.id 
  	LEFT JOIN
  		specialists_services ON specialists_services.id = visits.specialist_service_id
  	LEFT JOIN
  		services on specialists_services.service_id = services.id
  	WHERE
  		(visits.specialist_id = ($1) OR ($1) IS NULL) AND
		(visits.client_id = ($2) OR ($2) IS NULL)
--   		visits.start_date >= current_date
	ORDER BY
   		visits.start_date ASC;   
`

const CreateVisit = `
	INSERT INTO
		visits
		(start_date, end_date, price, description, status, client_address_id, client_id, specialist_id, specialist_service_id)
	VALUES
	    ($1, $2, 0, $3, 'specialist_action_required', $4, $5, $6, $7)
	RETURNING id;
`

const UpdateVisit = `
	UPDATE visits
	SET
	  start_date = $2,
	  end_date = $3,
	  price = $4,
	  status = $5,
	  description = $6,
	  client_address_id = $7
	WHERE
	  id = $1
	RETURNING id;
`

// --- NOTIFICATIONS ---

const GetNotificationsByClientId = `
	SELECT
		n.id, n.type, n.notifier, n.read, n.created_at, clients.id, uc.name, uc.second_name,
    	specialists.id, us.name, us.second_name, specializations.name, cities.name,
    	n.visit_id, services.name  
	FROM
	    notifications as n
	LEFT JOIN
		clients ON n.client_id = clients.id
	LEFT JOIN
		users as uc ON clients.user_id = uc.id
 	LEFT JOIN
		specialists ON n.specialist_id = specialists.id  
	LEFT JOIN
		users as us ON specialists.user_id = us.id
	LEFT JOIN
		specializations ON specialists.specialization_id = specializations.id
    LEFT JOIN 
  		cities ON cities.id = specialists.city_id
    LEFT JOIN 
  		visits ON visits.id = n.visit_id  
    LEFT JOIN
  		specialists_services ON specialists_services.id = visits.specialist_service_id
  	LEFT JOIN
  		services on specialists_services.service_id = services.id  
	WHERE
	    n.client_id = ($1) AND
	    n.notifier = 'specialist'
	ORDER BY 
	    n.created_at DESC;
`

const GetNotificationsBySpecialistId = `
	SELECT
		n.id, n.type, n.notifier, n.read, n.created_at, clients.id, uc.name, uc.second_name,
    	specialists.id, us.name, us.second_name, specializations.name, cities.name,
    	n.visit_id, services.name  
	FROM
	    notifications as n
	LEFT JOIN
		clients ON n.client_id = clients.id
	LEFT JOIN
		users as uc ON clients.user_id = uc.id
 	LEFT JOIN
		specialists ON n.specialist_id = specialists.id  
	LEFT JOIN
		users as us ON specialists.user_id = us.id
	LEFT JOIN
		specializations ON specialists.specialization_id = specializations.id
    LEFT JOIN 
  		cities ON cities.id = specialists.city_id
    LEFT JOIN 
  		visits ON visits.id = n.visit_id  
    LEFT JOIN
  		specialists_services ON specialists_services.id = visits.specialist_service_id
  	LEFT JOIN
  		services on specialists_services.service_id = services.id  
	WHERE
	    n.specialist_id = ($1) AND
	    n.notifier = 'client'
	ORDER BY 
	    n.created_at DESC;
`

const UpdateNotificationForVisitAsRead = `
	UPDATE notifications
	SET
	  read = 'true'
	WHERE
	  visit_id = $1
	RETURNING id;
`

const CreateNotification = `
	INSERT INTO
		notifications
	(type, notifier, read, client_id, specialist_id, visit_id, created_at)
	VALUES 
	    ($1, $2, $3, $4, $5, $6, $7)
	RETURNING id;
`
