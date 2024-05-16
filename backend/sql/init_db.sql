--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5 (Debian 14.5-1.pgdg110+1)
-- Dumped by pg_dump version 14.5 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;
SET default_tablespace = '';
SET default_table_access_method = heap;

--
-- Name: cities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cities
(
    id        integer PRIMARY KEY  NOT NULL,
    name      character varying(55) NOT NULL
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
-- Data for Name: cities; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.cities (name) VALUES
                                     ('Gdańsk'),
                                     ('Kraków'),
                                     ('Poznań'),
                                     ('Rzeszów'),
                                     ('Warszawa');

-- COPY public.cities (id, name) FROM stdin;
-- 1	Kraków
-- 2	Warszawa
-- 3	Poznań
-- 4	Gdańsk
-- 5	Rzeszów
-- \.

--
-- Name: cities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cities_id_seq', 5, true);


-- --
-- -- Name: cities cities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
-- --
--
-- ALTER TABLE ONLY public.cities
--     ADD CONSTRAINT cities_pkey PRIMARY KEY (id);
--

--
-- PostgreSQL database dump complete
--
