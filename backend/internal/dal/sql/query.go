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
	(name, second_name, email, password, role)
	VALUES 
	    ($1, $2, $3, $4, $5)
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
	    clients.id, users.name, users.second_name, users.email, clients.user_id
	FROM 
	    clients
	LEFT JOIN 
	        users on clients.user_id = users.id
	GROUP BY 
	    clients.id, users.name, users.second_name, users.email, clients.user_id, users.role
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
	    specialists.id, users.name, users.second_name, users.email, specialists.description, specialists.phone_nr, specialists.specialization_id, specialists.city_id, specialists.user_id
	FROM 
	    specialists
	LEFT JOIN 
	        users on specialists.user_id = users.id
	GROUP BY 
	    specialists.id, users.name, users.second_name, users.email, specialists.description, specialists.phone_nr, specialists.specialization_id, specialists.city_id, specialists.user_id, users.role
	HAVING 
	    specialists.user_id = ($1) AND users.role = 'specialist';

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
