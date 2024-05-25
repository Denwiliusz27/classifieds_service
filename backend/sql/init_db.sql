--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5 (Debian 14.5-1.pgdg110+1)
-- Dumped by pg_dump version 14.5 (Homebrew)

SET
statement_timeout = 0;
SET
lock_timeout = 0;
SET
idle_in_transaction_session_timeout = 0;
SET
client_encoding = 'UTF8';
SET
standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET
check_function_bodies = false;
SET
xmloption = content;
SET
client_min_messages = warning;
SET
row_security = off;
SET
default_tablespace = '';
SET
default_table_access_method = heap;

--
-- Name: cities; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public.cities
(
    id   integer PRIMARY KEY   NOT NULL,
    name character varying(55) NOT NULL
);

--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public.users
(
    id          integer PRIMARY KEY    NOT NULL,
    name        character varying(255) NOT NULL,
    second_name character varying(255) NOT NULL,
    email       character varying(255) NOT NULL,
    password    character varying(255) NOT NULL,
    role        character varying(255) NOT NULL
);

--
-- Name: clients; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public.clients
(
    id      integer PRIMARY KEY NOT NULL,
    user_id integer             NOT NULL
);

--
-- Name: specialists; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public.specialists
(
    id                integer PRIMARY KEY    NOT NULL,
    phone_nr          character varying(255) NOT NULL,
    description       text                   NOT NULL,
    city_id           integer                NOT NULL,
    user_id           integer                NOT NULL,
    specialization_id integer                NOT NULL
);

--
-- Name: clients_addresses; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public.clients_addresses
(
    id          integer PRIMARY KEY    NOT NULL,
    street      character varying(255) NOT NULL,
    building_nr integer                NOT NULL,
    flat_nr     integer,
    city_id     integer                NOT NULL,
    client_id   integer                NOT NULL
);

--
-- Name: specializations; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public.specializations
(
    id   integer PRIMARY KEY    NOT NULL,
    name character varying(255) NOT NULL
);

--
-- Name: specializations; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public.services
(
    id                integer PRIMARY KEY    NOT NULL,
    name              character varying(255) NOT NULL,
    price_per         character varying(255),
    specialization_id integer                NOT NULL
);

--
-- Name: specialists_services; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public.specialists_services
(
    id            integer PRIMARY KEY NOT NULL,
    price_min     integer             NOT NULL,
    price_max     integer             NOT NULL,
    specialist_id integer             NOT NULL,
    service_id    integer             NOT NULL
);

--
-- Name: availabilities; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public.availabilities
(
    id            integer PRIMARY KEY NOT NULL,
    start_date    timestamp without time zone NOT NULL,
    end_date      timestamp without time zone NOT NULL,
    specialist_id integer             NOT NULL
);

--
-- Name: visits; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public.visits
(
    id                    integer PRIMARY KEY    NOT NULL,
    start_date            timestamp without time zone NOT NULL,
    end_date              timestamp without time zone NOT NULL,
    price                 integer                not NULL,
    description           text                   not NULL,
    status                character varying(255) not NULL,
    availability_id       integer                not NULL,
    client_id             integer                NOT NULL,
    specialist_id         integer                NOT NULL,
    specialist_service_id integer                NOT NULL
);

--
-- Name: offers; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public.offers
(
    id                  integer PRIMARY KEY    NOT NULL,
    title               character varying(255) NOT NULL,
    description         text                   NOT NULL,
    auctions_end_date   timestamp without time zone NOT NULL,
    preferred_lead_date date                   NOT NULL,
    client_id           integer                NOT NULL
);

--
-- Name: offers_auctions; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public.offers_auctions
(
    id            integer PRIMARY KEY NOT NULL,
    price         integer             NOT NULL,
    start_date    timestamp without time zone NOT NULL,
    end_date      timestamp without time zone NOT NULL,
    specialist_id integer             NOT NULL,
    offer_id      integer             NOT NULL
);

--
-- Name: messages; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public.messages
(
    id            integer PRIMARY KEY NOT NULL,
    message       text                NOT NULL,
    send_date     timestamp without time zone NOT NULL,
    specialist_id integer             NOT NULL,
    client_id     integer             NOT NULL
);

--
-- Name: reviews; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public.reviews
(
    id            integer PRIMARY KEY NOT NULL,
    rating        integer             NOT NULL,
    description   text                NOT NULL,
    specialist_id integer             NOT NULL,
    service_id    integer             NOT NULL
);

--
-- Name: cities_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--
ALTER TABLE public.cities ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.cities_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--
ALTER TABLE public.users ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

--
-- Name: clients_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--
ALTER TABLE public.clients ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.clients_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

--
-- Name: specialists_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--
ALTER TABLE public.specialists ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.specialists_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

--
-- Name: clients_addresses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--
ALTER TABLE public.clients_addresses ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.clients_addresses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

--
-- Name: specializations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--
ALTER TABLE public.specializations ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.specializations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

--
-- Name: services_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--
ALTER TABLE public.services ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.services_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

--
-- Name: specialist_services_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--
ALTER TABLE public.specialists_services ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.specialists_services_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

--
-- Name: specialist_services_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--
ALTER TABLE public.availabilities ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.availabilities_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

--
-- Name: visits_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--
ALTER TABLE public.visits ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.visits_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

--
-- Name: offers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--
ALTER TABLE public.offers ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.offers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

--
-- Name: offers_auctions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--
ALTER TABLE public.offers_auctions ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.offers_auctions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

--
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--
ALTER TABLE public.messages ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.messages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

--
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--
ALTER TABLE public.reviews ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.reviews_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

--
-- Data for Name: cities; Type: TABLE DATA; Schema: public; Owner: -
--
INSERT INTO public.cities (name)
VALUES ('Gdańsk'),
       ('Kraków'),
       ('Poznań'),
       ('Rzeszów'),
       ('Warszawa');

--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--
INSERT INTO public.users (name, second_name, email, password, role)
VALUES ('Marek', 'Nowak', 'marek@gmail.com', 'marek1', 'client'),
       ('Stanisław', 'Cięciwka', 'stas@gmail.com', 'stas1', 'specialist');

--
-- Data for Name: clients; Type: TABLE DATA; Schema: public; Owner: -
--
INSERT INTO public.clients (user_id)
VALUES (1);

--
-- Data for Name: specialists; Type: TABLE DATA; Schema: public; Owner: -
--
INSERT INTO public.specialists (phone_nr, description, city_id, user_id, specialization_id)
VALUES ('990427111',
        'Kocham swoją pracę, od dziecka marzyłem o byciu elektrykiem, dlatego uczyłem się fachu w najleszych szkołach w kraju, a dzisiaj starannie pomagam innym',
        1,
        2, 1);

--
-- Data for Name: clients_addresses; Type: TABLE DATA; Schema: public; Owner: -
--
INSERT INTO public.clients_addresses (street, building_nr, flat_nr, city_id, client_id)
VALUES ('Bieszczadzka', 10, 27, 1, 1);

--
-- Data for Name: specializations; Type: TABLE DATA; Schema: public; Owner: -
--
INSERT INTO public.specializations (name)
VALUES ('Elektryk'),
       ('Hydraulik'),
       ('Ogrodnik'),
       ('Malarz'),
       ('Tapicer'),
       ('Sprzątacz'),
       ('Złota rączka'),
       ('Informatyk');

--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: -
--
INSERT INTO public.services (name, price_per, specialization_id)
VALUES ('Wymiana instalacji elektrycznej', 'meter', 1),
       ('Montaż instalacji elektrycznej', 'meter', 1),
       ('Montaż domofonu', '', 1),
       ('Instalacja oświetlenia ogrodowego', 'meter', 1),
       ('Instalacja gniazdek', 'amount', 1),
       ('Instalacja urządzeń "Smart Home"', '', 1),

       ('Montaż kabiny prysznicowej', '', 2),
       ('Montaż umywalki', '', 2),
       ('Montaż wanny', '', 2),
       ('Montaż WC', '', 2),
       ('Naprawa spłuczki', '', 2),
       ('Udrażnianie rur', '', 2),
       ('Podłączenie bojlera', '', 2),

       ('Koszenie trawy', 'meter', 3),
       ('Aeracja trawnika', 'meter', 3),
       ('Zasadzenie trawnika', 'meter', 3),
       ('Sadzenie drzew', 'amount', 3),
       ('Przycięcie drzew', 'amount', 3),
       ('Przekopanie ogródka', 'meter', 3),
       ('Sadzenie warzyw w ogrodzie', 'meter', 3),

       ('Malowanie ścian', 'meter', 4),
       ('Gruntowanie ścian', 'meter', 4),
       ('Malowanie drzwi', 'amount', 4),
       ('Malowanie elewacji', 'meter', 4),
       ('Malowanie mebli', 'amount',4),

       ('Pranie i czyszczenie tapicerki samochodowej', 'amount', 5),
       ('Pranie i czyszczenie wykładzin dywanowych', 'meter', 5),
       ('Pranie i czyszczenie tapicerki skórzanej', 'amount', 5),
       ('Pranie krzeseł/puf', 'amount', 5),
       ('Pranie foteli/sof', 'amount',5),
       ('Mycie i odkurzenie samochodu', '', 5),

       ('Sprzątanie po remoncie', 'meter', 6),
       ('Sprzątanie mieszkania', 'meter', 6),
       ('Mycie okien', 'amount', 6),
       ('Mycie kostki brukowej', 'meter', 6),
       ('Mycie elewacji', 'meter', 6),
       ('Odgrzybianie', 'meter', 6),

       ('Montaż drzwi', '', 7),
       ('Montaż okien', 'amount', 7),
       ('Skręcanie mebli', 'amount', 7),
       ('Montaż karniszy', 'amount', 7),
       ('Montaż rolet', 'amount', 7),
       ('Montaż telewizora', '', 7),
       ('Montaż oświetlenia', 'amount', 7),
       ('Montaż parapetów', 'amount', 7),
       ('Naprawa okna', '', 7),
       ('Naprawa drzwi', '', 7),
       ('Montaż bramy garażowej', '', 7),
       ('Montaż klimatyzacji', 'amount', 7),
       ('Naprawa roweru', '', 7),
       ('Wymiana zamka w drzwiach', '', 7),
       ('Montaż mebli naściennych', 'amount' ,7),
       ('Naprawa kuchenki', '', 7),
       ('Montaż kuchenki', '', 7),
       ('Naprawa lodówki', '', 7),
       ('Naprawa pralki', '', 7),
       ('Montaż pralki', '', 7),
       ('Naprawa telewizora', '', 7),
       ('Naprawa zmywarki', '', 7),
       ('Montaż zmywarki', '', 7),

       ('Naprawa drukarki', '', 8),
       ('Naprawa laptopa', '', 8),
       ('Naprawa telefonu', '', 8),
       ('Instalacja systemu w laptopie', '', 8);

--
-- Data for Name: specialists_services; Type: TABLE DATA; Schema: public; Owner: -
--
INSERT INTO public.specialists_services (price_min, price_max, specialist_id, service_id)
VALUES (300, 600, 1, 1),
       (500, 100, 1, 2),
       (30, 100, 1, 5);

--
-- Name: cities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--
SELECT pg_catalog.setval('public.cities_id_seq', 5, true);

--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--
SELECT pg_catalog.setval('public.users_id_seq', 2, true);

--
-- Name: clients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--
SELECT pg_catalog.setval('public.clients_id_seq', 1, true);

--
-- Name: specialists_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--
SELECT pg_catalog.setval('public.specialists_id_seq', 1, true);

--
-- Name: clients_addresses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--
SELECT pg_catalog.setval('public.clients_addresses_id_seq', 1, true);

--
-- Name: specializations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--
SELECT pg_catalog.setval('public.specializations_id_seq', 8, true);

--
-- Name: services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--
SELECT pg_catalog.setval('public.services_id_seq', 64, true);

--
-- Name: specialists_services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--
SELECT pg_catalog.setval('public.specialists_services_id_seq', 3, true);

--
-- Name: availabilities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--
SELECT pg_catalog.setval('public.availabilities_id_seq', 1, true);

--
-- Name: visits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--
SELECT pg_catalog.setval('public.visits_id_seq', 1, true);

--
-- Name: offers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--
SELECT pg_catalog.setval('public.offers_id_seq', 1, true);

--
-- Name: offers_auctions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--
SELECT pg_catalog.setval('public.offers_auctions_id_seq', 1, true);

--
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--
SELECT pg_catalog.setval('public.messages_id_seq', 1, true);

--
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--
SELECT pg_catalog.setval('public.reviews_id_seq', 1, true);

--
-- Name: users users_role; Type: CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE public.users
    ADD CONSTRAINT users_role CHECK ( role IN ('client', 'specialist'));

--
-- Name: services services_price_per; Type: CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE public.services
    ADD CONSTRAINT service_price_per CHECK ( price_per IN ('meter', 'amount', ''));


--
-- Name: visits visit_status; Type: CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE public.visits
    ADD CONSTRAINT visit_status CHECK ( visits.status IN ('accepted', 'declined', 'specialist_action_required',
                                                          'client_action_required'));
--
-- Name: clients clients_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_user_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON
UPDATE CASCADE
ON
DELETE
CASCADE;

--
-- Name: clients specialists_city_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.specialists
    ADD CONSTRAINT specialists_city_id_fk FOREIGN KEY (city_id) REFERENCES public.cities(id) ON
UPDATE CASCADE
ON
DELETE
CASCADE;

--
-- Name: clients specialists_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.specialists
    ADD CONSTRAINT specialists_user_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON
UPDATE CASCADE
ON
DELETE
CASCADE;

--
-- Name: clients specialists_specialization_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.specialists
    ADD CONSTRAINT specialists_specialization_id_fk FOREIGN KEY (specialization_id) REFERENCES public.specializations(id) ON
UPDATE CASCADE
ON
DELETE
CASCADE;

--
-- Name: clients clients_addresses_city_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.clients_addresses
    ADD CONSTRAINT clients_addresses_city_id_fk FOREIGN KEY (city_id) REFERENCES public.cities(id) ON
UPDATE CASCADE
ON
DELETE
CASCADE;

--
-- Name: clients clients_addresses_client_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.clients_addresses
    ADD CONSTRAINT clients_addresses_client_id_fk FOREIGN KEY (client_id) REFERENCES public.clients(id) ON
UPDATE CASCADE
ON
DELETE
CASCADE;

--
-- Name: clients services_specialization_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.services
    ADD CONSTRAINT specialization_user_id_fk FOREIGN KEY (specialization_id) REFERENCES public.specializations(id) ON
UPDATE CASCADE
ON
DELETE
CASCADE;

--
-- Name: clients specialists_services_service_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.specialists_services
    ADD CONSTRAINT specialists_services_service_id_fk FOREIGN KEY (service_id) REFERENCES public.services(id) ON
UPDATE CASCADE
ON
DELETE
CASCADE;

--
-- Name: clients specialists_services_specialist_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.specialists_services
    ADD CONSTRAINT specialists_services_specialist_id_fk FOREIGN KEY (specialist_id) REFERENCES public.specialists(id) ON
UPDATE CASCADE
ON
DELETE
CASCADE;

--
-- Name: availabilities availability_specialist_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.availabilities
    ADD CONSTRAINT availability_specialist_id_fk FOREIGN KEY (specialist_id) REFERENCES public.specialists(id) ON
UPDATE CASCADE
ON
DELETE
CASCADE;

--
-- Name: visits visits_availability_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.visits
    ADD CONSTRAINT visits_availability_id_fk FOREIGN KEY (availability_id) REFERENCES public.availabilities(id) ON
UPDATE CASCADE
ON
DELETE
CASCADE;

--
-- Name: visits visits_client_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.visits
    ADD CONSTRAINT visits_client_id_fk FOREIGN KEY (client_id) REFERENCES public.clients(id) ON
UPDATE CASCADE
ON
DELETE
CASCADE;

--
-- Name: visits visits_specialist_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.visits
    ADD CONSTRAINT visits_specialist_id_fk FOREIGN KEY (specialist_id) REFERENCES public.specialists(id) ON
UPDATE CASCADE
ON
DELETE
CASCADE;

--
-- Name: visits visits_specialist_service_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.visits
    ADD CONSTRAINT visits_specialist_service_id_fk FOREIGN KEY (specialist_service_id) REFERENCES public.specialists_services(id) ON
UPDATE CASCADE
ON
DELETE
CASCADE;

--
-- Name: offers offers_client_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.offers
    ADD CONSTRAINT offers_client_id_fk FOREIGN KEY (client_id) REFERENCES public.clients(id) ON
UPDATE CASCADE
ON
DELETE
CASCADE;

--
-- Name: offers_auctions offers_auctions_specialist_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.offers_auctions
    ADD CONSTRAINT offers_auctions_specialist_id_fk FOREIGN KEY (specialist_id) REFERENCES public.specialists(id) ON
UPDATE CASCADE
ON
DELETE
CASCADE;

--
-- Name: offers_auctions offers_auctions_offer_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.offers_auctions
    ADD CONSTRAINT offers_auctions_offer_id_fk FOREIGN KEY (offer_id) REFERENCES public.offers(id) ON
UPDATE CASCADE
ON
DELETE
CASCADE;

--
-- Name: messages messages_specialist_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_specialist_id_fk FOREIGN KEY (specialist_id) REFERENCES public.specialists(id) ON
UPDATE CASCADE
ON
DELETE
CASCADE;

--
-- Name: messages messages_client_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_client_id_fk FOREIGN KEY (client_id) REFERENCES public.clients(id) ON
UPDATE CASCADE
ON
DELETE
CASCADE;

--
-- Name: reviews reviews_specialist_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_specialist_id_fk FOREIGN KEY (specialist_id) REFERENCES public.specialists(id) ON
UPDATE CASCADE
ON
DELETE
CASCADE;

--
-- Name: reviews reviews_service_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_service_id_fk FOREIGN KEY (service_id) REFERENCES public.services(id) ON
UPDATE CASCADE
ON
DELETE
CASCADE;

--
-- PostgreSQL database dump complete
--
