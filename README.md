registraction table:
====================

-- Table: public.registration

-- DROP TABLE IF EXISTS public.registration;

CREATE TABLE IF NOT EXISTS public.registration
(
    email_id character varying COLLATE pg_catalog."default" NOT NULL,
    first_name character varying COLLATE pg_catalog."default",
    last_name character varying COLLATE pg_catalog."default",
    phone_number character varying COLLATE pg_catalog."default",
    password character varying COLLATE pg_catalog."default",
    confirm_password character varying COLLATE pg_catalog."default",
    CONSTRAINT registration_pkey PRIMARY KEY (email_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.registration
    OWNER to postgres;


Bokking Details:
==================================

CREATE TABLE public.booking_details (
    id SERIAL PRIMARY KEY NOT NULL,
	name VARCHAR(255),
	date DATE,
	time TIMESTAMP WITHOUT TIME ZONE,
	status VARCHAR(255)
)
