const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const defaultPool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DEFAULT_DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const initializeDatabase = async () => {
  try {
    const client = await defaultPool.connect();
    const dbName = "uniza-parking-system";

    // Check if the database already exists
    const dbExists = await client.query(
      "SELECT 1 FROM pg_database WHERE datname='uniza-parking-system'"
    );

    if (dbExists.rows.length === 0) {
      // Database does not exist, create it
      await client.query(`
        CREATE DATABASE "uniza-parking-system"
        WITH
        OWNER = 'postgres'
        ENCODING = 'UTF8'
        LC_COLLATE = 'English_United Kingdom.1250'
        LC_CTYPE = 'English_United Kingdom.1250'
        TABLESPACE = pg_default
        CONNECTION LIMIT = -1;
      `);
      console.log('Database "uniza-parking-system" created successfully.');

      // After creating the database, connect to it
      const newPool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: dbName,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
      });

      const pool2 = await newPool.connect();

      // Create the sequences
      await pool2.query(`
        CREATE SEQUENCE IF NOT EXISTS parking_spots_parking_spot_id_seq;
        CREATE SEQUENCE IF NOT EXISTS parking_spot_histories_id_seq;
        CREATE SEQUENCE IF NOT EXISTS users_user_id_seq;
        CREATE SEQUENCE IF NOT EXISTS updates_id_seq;
        CREATE SEQUENCE IF NOT EXISTS notifications_notification_id_seq;
        CREATE SEQUENCE IF NOT EXISTS reported_bugs_id_seq;
      `);

      // Create db tables
      await pool2.query(`
        CREATE TABLE IF NOT EXISTS public.parking_spots
        (
          parking_spot_id integer NOT NULL DEFAULT nextval('parking_spots_parking_spot_id_seq'::regclass),
          name character varying(255) COLLATE pg_catalog."default" NOT NULL,
          occupied boolean,
          updated_at timestamp with time zone NOT NULL DEFAULT now(),
          CONSTRAINT parking_spots_pkey PRIMARY KEY (parking_spot_id)
        )
        TABLESPACE pg_default;
        ALTER TABLE IF EXISTS public.parking_spots
          OWNER to postgres;

        CREATE TABLE IF NOT EXISTS public.parking_spot_histories
        (
          history_id integer NOT NULL DEFAULT nextval('parking_spot_histories_id_seq'::regclass),
          parking_spot_id integer NOT NULL,
          occupied boolean NOT NULL,
          updated_at timestamp with time zone NOT NULL DEFAULT now(),
          CONSTRAINT fk_spot_id FOREIGN KEY (parking_spot_id)
            REFERENCES public.parking_spots (parking_spot_id) MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE NO ACTION
            NOT VALID
        )
        TABLESPACE pg_default;
        ALTER TABLE IF EXISTS public.parking_spot_histories
          OWNER to postgres;

        CREATE TABLE IF NOT EXISTS public.parking_spot_coordinates
        (
          parking_spot_id integer NOT NULL,
          coordinates point NOT NULL,
          CONSTRAINT fk_parking_spot_id FOREIGN KEY (parking_spot_id)
            REFERENCES public.parking_spots (parking_spot_id) MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE NO ACTION
            NOT VALID
        )
        TABLESPACE pg_default;
        ALTER TABLE IF EXISTS public.parking_spot_coordinates
          OWNER to postgres;

        CREATE TABLE IF NOT EXISTS public.detection_updates
        (
          id integer NOT NULL DEFAULT nextval('updates_id_seq'::regclass),
          success boolean NOT NULL,
          updated_at timestamp with time zone NOT NULL,
          CONSTRAINT updates_pkey PRIMARY KEY (id)
        )
        TABLESPACE pg_default;
        ALTER TABLE IF EXISTS public.detection_updates
          OWNER to postgres;

        CREATE TABLE IF NOT EXISTS public.users
        (
          user_id integer NOT NULL DEFAULT nextval('users_user_id_seq'::regclass),
          email character varying(255) COLLATE pg_catalog."default" NOT NULL,
          password character varying(255) COLLATE pg_catalog."default" NOT NULL,
          created_at timestamp with time zone NOT NULL DEFAULT now(),
          updated_at timestamp with time zone,
          favourite_spot_id integer,
          push_token character varying(255) COLLATE pg_catalog."default",
          CONSTRAINT users_pkey PRIMARY KEY (user_id),
          CONSTRAINT fk_favourite_spot_id FOREIGN KEY (favourite_spot_id)
            REFERENCES public.parking_spots (parking_spot_id) MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE NO ACTION
            NOT VALID
        )
        TABLESPACE pg_default;
        ALTER TABLE IF EXISTS public.users
          OWNER to postgres;

        CREATE TABLE IF NOT EXISTS public.notifications
        (
          notification_id integer NOT NULL DEFAULT nextval('notifications_notification_id_seq'::regclass),
          parking_spot_id integer NOT NULL,
          user_id integer NOT NULL,
          created_at timestamp with time zone NOT NULL DEFAULT now(),
          CONSTRAINT notifications_pkey PRIMARY KEY (notification_id),
          CONSTRAINT fk_spot_id FOREIGN KEY (parking_spot_id)
            REFERENCES public.parking_spots (parking_spot_id) MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE NO ACTION
            NOT VALID,
          CONSTRAINT fk_user_id FOREIGN KEY (user_id)
            REFERENCES public.users (user_id) MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE NO ACTION
            NOT VALID
        )
        TABLESPACE pg_default;
        ALTER TABLE IF EXISTS public.notifications
          OWNER to postgres;

        CREATE TABLE IF NOT EXISTS public.reports
        (
          id integer NOT NULL DEFAULT nextval('reported_bugs_id_seq'::regclass),
          user_id integer,
          message character varying(255) COLLATE pg_catalog."default" NOT NULL,
          category character varying(20) COLLATE pg_catalog."default" NOT NULL,
          created_at timestamp with time zone NOT NULL DEFAULT now(),
          CONSTRAINT reported_bugs_pkey PRIMARY KEY (id)
        )
        TABLESPACE pg_default;
        ALTER TABLE IF EXISTS public.reports
          OWNER to postgres;
      `);
      console.log("Tables created successfully.");
      pool2.release();
    } else {
      console.log('Database "uniza-parking-system" already exists.');
    }

    client.release();
  } catch (error) {
    console.error("Database initialization failed:", error);
  }
};

module.exports = { pool, initializeDatabase };
