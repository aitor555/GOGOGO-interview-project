-- Enable uuid_generate_v4() function
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Ensure public schema exists
CREATE SCHEMA IF NOT EXISTS public;

-- Drop tables in correct order (child tables first)
DROP TABLE IF EXISTS public.moves CASCADE;
DROP TABLE IF EXISTS public.games CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Table: public.users
CREATE TABLE IF NOT EXISTS public.users
(
    id uuid NOT NULL,
    username text NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT users_pkey PRIMARY KEY (id)
);

ALTER TABLE public.users OWNER TO postgres;

-- Table: public.games
CREATE TABLE IF NOT EXISTS public.games
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    player_black uuid,
    player_white uuid,
    status text,
    created_at timestamp without time zone DEFAULT now(),
    room_code text NOT NULL,
    CONSTRAINT games_pkey PRIMARY KEY (id),
    CONSTRAINT games_player_black_fkey FOREIGN KEY (player_black)
        REFERENCES public.users (id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT games_player_white_fkey FOREIGN KEY (player_white)
        REFERENCES public.users (id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT games_status_check CHECK (status = ANY (ARRAY['waiting', 'active', 'finished']))
);

ALTER TABLE public.games OWNER TO postgres;

-- Table: public.moves
CREATE TABLE IF NOT EXISTS public.moves
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    game_id uuid,
    player_id uuid,
    x integer,
    y integer,
    move_number integer,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT moves_pkey PRIMARY KEY (id),
    CONSTRAINT moves_game_id_fkey FOREIGN KEY (game_id)
        REFERENCES public.games (id)
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT moves_player_id_fkey FOREIGN KEY (player_id)
        REFERENCES public.users (id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

ALTER TABLE public.moves OWNER TO postgres;
