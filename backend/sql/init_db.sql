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
    created_at  date                   NOT NULL,
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
    name character varying(255) NOT NULL,
    img  character varying(500) NOT NULL
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
-- Name: time_off; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public.time_off
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
    client_address_id     integer                not NULL,
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
    id            integer PRIMARY KEY      NOT NULL,
    rating        integer                  NOT NULL,
    description   text                     NOT NULL,
    specialist_id integer                  NOT NULL,
    client_id     integer                  NOT NULL,
    created_at    timestamp with time zone NOT NULL,
    service_id    integer                  NOT NULL
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
ALTER TABLE public.time_off ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.time_off_id_seq
    START WITH 2
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
INSERT INTO public.users (name, second_name, email, password, role, created_at)
VALUES ('Marek', 'Nowak', 'marek@gmail.com', 'marek1', 'client', '2021-03-23'),
       ('Stanisław', 'Cięciwka', 'stas@gmail.com', 'stas1', 'specialist', '2018-07-05'),
       ('Janusz', 'Kręcek', 'januszkrecek@gmail.com', 'janusz1', 'specialist', '2022-01-15'),
       ('Janina', 'Lipska', 'janinalipska@gmail.com', 'janina1', 'specialist', '2016-11-29');

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
        1, 2, 1),
       ('812774912',
        'Mam wieloletnie doświadczenie w pracy. Swoje doświadczenie czerpałem o najlepszych specjalistów. Wszyscy klienci zawsze chętnie do mnie wracają',
        2, 3, 1),
       ('699132992',
        'Jestem spokojną osobą, która nie boi się żadnej pracy. Sprzątnę nawet największy kurz. Działam od wielu lat i w tym czasie zaufało mi już setki osób',
        1, 4, 6);

--
-- Data for Name: clients_addresses; Type: TABLE DATA; Schema: public; Owner: -
--
INSERT INTO public.clients_addresses (street, building_nr, flat_nr, city_id, client_id)
VALUES ('Bieszczadzka', 10, 27, 1, 1),
       ('Słoneczna', 2, 0, 1, 1);

--
-- Data for Name: specializations; Type: TABLE DATA; Schema: public; Owner: -
--
INSERT INTO public.specializations (name, img)
VALUES ('Elektryk',
        'https://img.freepik.com/free-photo/man-electrical-technician-working-switchboard-with-fuses-uses-tablet_169016-23790.jpg?t=st=1718547655~exp=1718551255~hmac=d8ddb8e4c4512f6737aa353f27bdff791575a7a8c0f2aa8c4ae7c9ff28d55442&w=1380'),
       ('Hydraulik',
        'https://img.freepik.com/free-photo/man-fixing-kitchen-sink_53876-13430.jpg?t=st=1718547755~exp=1718551355~hmac=49baf7b49ca2644f935a7769c286fc979e09ebf3f21d47d6647405284b91ddc2&w=1060'),
       ('Ogrodnik',
        'https://img.freepik.com/free-photo/smiling-young-female-gardener-uniform-wearing-gardening-hat-gloves-holds-flowerpot-spade-shoulder-isolated-olive-green-wall-with-copy-space_141793-93584.jpg?t=st=1718547822~exp=1718551422~hmac=a274fd686440f665c040a2bed2fb25c47e8e8b2a862e8b90e4a40dfac0b30bf5&w=996'),
       ('Malarz',
        'https://img.freepik.com/free-photo/portrait-repairer-woman-with-painting-roller-isolated_1303-14259.jpg?t=st=1718547605~exp=1718551205~hmac=1e0b4ff0f2d9f0be3ce62db446e044773dc128c2facf8154126a5b3dbb62d7cf&w=1380'),
       ('Tapicer',
        'https://img.freepik.com/free-photo/man-doing-professional-home-cleaning-service_23-2150359024.jpg?t=st=1718547943~exp=1718551543~hmac=be5c0f0242cb4dffe499b1419a128da733d9a0c0e67991ea6fbd4e13e1d8209d&w=1380'),
       ('Sprzątacz',
        'https://img.freepik.com/free-photo/cheerful-young-female-cleaner-wearing-uniform-bandana-rubber-gloves-holding-brush-cleanser-crossed-looking-camera-laughing-isolated-blue-background_141793-140482.jpg?t=st=1718548068~exp=1718551668~hmac=805acaf638a14c8fb0091f836a0c0ca73f3219cd1b7263685f1d0c320a499dd8&w=1380'),
       ('Złota rączka',
        'https://img.freepik.com/free-photo/part-male-construction-worker_329181-3734.jpg?t=st=1718548006~exp=1718551606~hmac=bdb6b6aa6aa843e6bb30b7dd0396a3ac851894a5c67f8c1139e88896eb620e4c&w=1380'),
       ('Informatyk',
        'https://img.freepik.com/free-photo/business-young-successful-male-entrepreneur-showing-thumb-up-while-working-laptop-standing_1258-26461.jpg?t=st=1718548211~exp=1718551811~hmac=12e89cc6af824a1811cdf633b95f2127a2fad072cf4ab930137db4f6373f5d82&w=1380');

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
       ('Malowanie mebli', 'amount', 4),

       ('Pranie i czyszczenie tapicerki samochodowej', 'amount', 5),
       ('Pranie i czyszczenie wykładzin dywanowych', 'meter', 5),
       ('Pranie i czyszczenie tapicerki skórzanej', 'amount', 5),
       ('Pranie krzeseł/puf', 'amount', 5),
       ('Pranie foteli/sof', 'amount', 5),
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
       ('Montaż mebli naściennych', 'amount', 7),
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
       (50, 100, 1, 2),
       (30, 100, 1, 5),
       (50, 70, 2, 2),
       (80, 120, 2, 4),
       (40, 110, 2, 5),
       (40, 80, 3, 32),
       (30, 70, 3, 33),
       (35, 90, 3, 34);

--
-- Data for Name: time_off; Type: TABLE DATA; Schema: public; Owner: -
--
INSERT INTO public.time_off (start_date, end_date, specialist_id)
VALUES ('2024-07-17 08:00:00', '2024-07-17 16:00:00', 1),
       ('2024-07-20 06:00:00', '2024-07-20 22:00:00', 1);

--
-- Data for Name: visits; Type: TABLE DATA; Schema: public; Owner: -
--
INSERT INTO public.visits (start_date, end_date, price, description, status, client_address_id, client_id, specialist_id,
                           specialist_service_id)
VALUES ('2024-07-18 12:00:00', '2024-07-18 15:00:00', 300, 'Potrzebuje zrobić to w kilku pomieszczeniach, w tym w kuchni i łazience', 'accepted', 1, 1, 1, 2),
       ('2024-07-19 08:00:00', '2024-07-19 10:00:00', 500, 'Gniazdka w kuchni i łazience', 'accepted', 2, 1, 1, 5),
       ('2024-07-21 15:00:00', '2024-07-21 20:00:00', 200, 'Gniazdka w garażu i piwnicy', 'specialist_action_required', 1, 1, 1, 5);

--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: -
--
INSERT INTO public.reviews (rating, description, specialist_id, client_id, created_at, service_id)
VALUES (4, 'Bardzo dobry specjalista, zna się na fachu', 1, 1, '2023-12-13 12:23:22', 2),
       (5, 'Pan poradził sobie z zadaniem jak mało kto', 1, 1, '2024-03-23 20:49:00', 5),
       (4, 'Ok', 1, 1, '2024-02-05 18:05:12', 1),
       (3, 'Mogło być lepiej', 1, 1, '2024-01-16 07:49:50', 1),
       (4, 'Pan bardzo rzetelny', 2, 1, '2021-05-13 18:55:12', 4),
       (5, 'Lepiej nie mogłem trafić, najlepszy specjalista w okolicy!', 2, 1, '2023-08-02 22:02:42', 5),
       (5, 'Bardzo porządna Pani, prace wykonuje od deski do deski', 3, 1, '2024-02-12 08:22:02', 33);

--
-- Name: cities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--
SELECT pg_catalog.setval('public.cities_id_seq', 5, true);

--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--
SELECT pg_catalog.setval('public.users_id_seq', 4, true);

--
-- Name: clients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--
SELECT pg_catalog.setval('public.clients_id_seq', 1, true);

--
-- Name: specialists_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--
SELECT pg_catalog.setval('public.specialists_id_seq', 3, true);

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
SELECT pg_catalog.setval('public.specialists_services_id_seq', 9, true);

--
-- Name: time_offvi_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--
SELECT pg_catalog.setval('public.time_off_id_seq', 1, true);

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
SELECT pg_catalog.setval('public.reviews_id_seq', 7, true);

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
-- Name: time_off time_off_specialist_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.time_off
    ADD CONSTRAINT time_off_specialist_id_fk FOREIGN KEY (specialist_id) REFERENCES public.specialists(id) ON
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
-- Name: visits visits_client_address_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.visits
    ADD CONSTRAINT visits_client_address_id_fk FOREIGN KEY (client_address_id) REFERENCES public.clients_addresses(id) ON
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
-- Name: reviews reviews_client_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_client_id_fk FOREIGN KEY (client_id) REFERENCES public.clients(id) ON
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
