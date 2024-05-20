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

// --- CLIENTS ---

const CreateClient = `
	INSERT INTO
		clients
	(user_id)
	VALUES 
	    ($1)
	RETURNING id;
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
