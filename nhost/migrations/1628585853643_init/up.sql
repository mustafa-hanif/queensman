CREATE EXTENSION IF NOT EXISTS plpgsql;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;
SET check_function_bodies = false;
CREATE SCHEMA auth;
CREATE FUNCTION auth.create_constraint_if_not_exists(t_name text, c_name text, constraint_sql text) RETURNS void
    LANGUAGE plpgsql
    AS $$
  BEGIN
    -- Look for our constraint
    IF NOT EXISTS (SELECT constraint_name
                   FROM information_schema.constraint_column_usage
                   WHERE constraint_name = c_name) THEN
        EXECUTE 'ALTER TABLE ' || t_name || ' ADD CONSTRAINT ' || c_name || ' ' || constraint_sql;
    END IF;
  END;
$$;
CREATE FUNCTION public.set_current_timestamp_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
  _new record;
begin
  _new := new;
  _new. "updated_at" = now();
  return _new;
end;
$$;
CREATE TABLE auth.account_providers (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    account_id uuid NOT NULL,
    auth_provider text NOT NULL,
    auth_provider_unique_id text NOT NULL
);
CREATE TABLE auth.account_roles (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    account_id uuid NOT NULL,
    role text NOT NULL
);
CREATE TABLE auth.accounts (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid NOT NULL,
    active boolean DEFAULT false NOT NULL,
    email public.citext,
    new_email public.citext,
    password_hash text,
    default_role text DEFAULT 'user'::text NOT NULL,
    is_anonymous boolean DEFAULT false NOT NULL,
    custom_register_data jsonb,
    otp_secret text,
    mfa_enabled boolean DEFAULT false NOT NULL,
    ticket uuid DEFAULT public.gen_random_uuid() NOT NULL,
    ticket_expires_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT proper_email CHECK ((email OPERATOR(public.~*) '^[A-Za-z0-9._+%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'::public.citext)),
    CONSTRAINT proper_new_email CHECK ((new_email OPERATOR(public.~*) '^[A-Za-z0-9._+%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'::public.citext))
);
CREATE TABLE auth.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE auth.providers (
    provider text NOT NULL
);
CREATE TABLE auth.refresh_tokens (
    refresh_token uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    account_id uuid NOT NULL
);
CREATE TABLE auth.roles (
    role text NOT NULL
);
CREATE TABLE public.admin (
    id integer NOT NULL,
    full_name character varying(50) DEFAULT NULL::character varying NOT NULL,
    email character varying(50) DEFAULT NULL::character varying NOT NULL,
    password character varying(50) DEFAULT NULL::character varying NOT NULL,
    phone character varying(14) DEFAULT NULL::character varying NOT NULL,
    designation character varying(50) DEFAULT NULL::character varying NOT NULL,
    push_token character varying(255) DEFAULT NULL::character varying
);
CREATE SEQUENCE public.admin_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.admin_id_seq OWNED BY public.admin.id;
CREATE TABLE public.callout (
    id integer NOT NULL,
    callout_by integer,
    property_id integer,
    category character varying(255) DEFAULT 'Uncategorized'::character varying NOT NULL,
    job_type character varying(100) DEFAULT NULL::character varying NOT NULL,
    description character varying(1000) DEFAULT NULL::character varying,
    status character varying(255) DEFAULT 'Requested'::character varying NOT NULL,
    planned_time timestamp without time zone,
    request_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    resolved_time timestamp without time zone,
    urgency_level text,
    action character varying(255) DEFAULT NULL::character varying,
    active smallint DEFAULT 1 NOT NULL,
    inserted_by character varying(255) DEFAULT NULL::character varying,
    inserter_id integer,
    picture1 character varying(255) DEFAULT NULL::character varying,
    picture2 character varying(255) DEFAULT NULL::character varying,
    picture3 character varying(255) DEFAULT NULL::character varying,
    picture4 character varying(255) DEFAULT NULL::character varying,
    callout_by_email text,
    video text
);
COMMENT ON COLUMN public.callout.status IS 'only admin can cancel';
COMMENT ON COLUMN public.callout.inserted_by IS 'Callout was recorded from which interface? Values can be ''Admin'', ''Customer'' or ''Ops Team''.';
COMMENT ON COLUMN public.callout.inserter_id IS 'ID can be of admin, ops team or customer who recorded the callout. (Is different from the callout_by that determines the representative of the property).';
CREATE SEQUENCE public.callout_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.callout_id_seq OWNED BY public.callout.id;
CREATE TABLE public.client (
    id integer NOT NULL,
    full_name character varying(50) DEFAULT NULL::character varying NOT NULL,
    email character varying(50) DEFAULT NULL::character varying NOT NULL,
    sec_email character varying(50) DEFAULT NULL::character varying,
    password character varying(50) DEFAULT NULL::character varying,
    phone character varying(14) DEFAULT NULL::character varying NOT NULL,
    sec_phone character varying(14) DEFAULT NULL::character varying,
    stored_device_id character varying(100) DEFAULT NULL::character varying,
    account_type character varying(255) DEFAULT NULL::character varying,
    occupation character varying(50) DEFAULT NULL::character varying,
    organization character varying(50) DEFAULT NULL::character varying,
    age_range character varying(20) DEFAULT NULL::character varying,
    gender character varying(10) DEFAULT NULL::character varying,
    family_size integer,
    ages_of_children character varying(200) DEFAULT NULL::character varying,
    earning_bracket character varying(50) DEFAULT NULL::character varying,
    nationality character varying(20) DEFAULT NULL::character varying,
    years_expatriate integer,
    years_native integer,
    referred_by integer,
    other_properties character varying(200) DEFAULT NULL::character varying,
    contract_start_date date,
    contract_end_date date,
    sign_up_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    active smallint DEFAULT 1 NOT NULL,
    uploaded_by integer DEFAULT 1 NOT NULL,
    expo_token text,
    "hasPlan" boolean DEFAULT false NOT NULL,
    CONSTRAINT client_account_type_check CHECK (((account_type)::text = ANY ((ARRAY['Residential Lessee'::character varying, 'Retail Outlet Lessee'::character varying, 'Commercial Lessee'::character varying, 'Investor'::character varying])::text[])))
);
CREATE SEQUENCE public.client_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.client_id_seq OWNED BY public.client.id;
CREATE TABLE public.contact (
    id integer NOT NULL,
    full_name character varying(50) DEFAULT NULL::character varying NOT NULL,
    email character varying(50) DEFAULT NULL::character varying NOT NULL,
    phone character varying(50) DEFAULT NULL::character varying NOT NULL
);
CREATE SEQUENCE public.contact_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.contact_id_seq OWNED BY public.contact.id;
CREATE TABLE public.documents (
    id integer NOT NULL,
    client_email text NOT NULL,
    document_name text NOT NULL,
    document_zoho_id text NOT NULL
);
CREATE SEQUENCE public.documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.documents_id_seq OWNED BY public.documents.id;
CREATE TABLE public.employees (
    name text NOT NULL,
    email text NOT NULL,
    id integer NOT NULL,
    sid text,
    "Type" text,
    gross_salary bigint,
    allowances bigint,
    "Start_month" date,
    tax_amount bigint,
    end_month date,
    basic_salary bigint,
    account_number text,
    bank_name text,
    cnic text,
    contact_number text
);
CREATE SEQUENCE public.employees_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.employees_id_seq OWNED BY public.employees.id;
CREATE TABLE public.inventory_article (
    id integer NOT NULL,
    inventory_room_id integer NOT NULL,
    type character varying(255) DEFAULT NULL::character varying NOT NULL,
    description character varying(255) DEFAULT NULL::character varying,
    inspection character varying(255) DEFAULT NULL::character varying,
    work_description character varying(255) DEFAULT NULL::character varying,
    remarks character varying(255) DEFAULT NULL::character varying
);
CREATE SEQUENCE public.inventory_article_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.inventory_article_id_seq OWNED BY public.inventory_article.id;
CREATE TABLE public.inventory_picture (
    id integer NOT NULL,
    inventory_room_id integer NOT NULL,
    picture_location character varying(255) DEFAULT NULL::character varying NOT NULL,
    upload_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
CREATE SEQUENCE public.inventory_picture_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.inventory_picture_id_seq OWNED BY public.inventory_picture.id;
CREATE TABLE public.inventory_report (
    id integer NOT NULL,
    property_id integer NOT NULL,
    checked_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ops_team_id integer NOT NULL,
    inspection_done_by character varying(255) DEFAULT NULL::character varying,
    summary text,
    approved smallint DEFAULT 0 NOT NULL
);
CREATE SEQUENCE public.inventory_report_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.inventory_report_id_seq OWNED BY public.inventory_report.id;
CREATE TABLE public.inventory_report_pdf (
    id integer DEFAULT 0 NOT NULL,
    property_id integer NOT NULL,
    owner_id integer NOT NULL,
    report_upload_date date NOT NULL,
    report_location character varying(255) DEFAULT NULL::character varying NOT NULL
);
CREATE TABLE public.inventory_room (
    id integer NOT NULL,
    inventory_report_id integer NOT NULL,
    room character varying(255) DEFAULT NULL::character varying NOT NULL
);
CREATE SEQUENCE public.inventory_room_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.inventory_room_id_seq OWNED BY public.inventory_room.id;
CREATE TABLE public.job (
    callout_id integer NOT NULL,
    instructions character varying(255) DEFAULT NULL::character varying,
    solution character varying(255) DEFAULT NULL::character varying,
    rating integer,
    feedback character varying(100) DEFAULT NULL::character varying,
    signature text,
    assigned_by integer DEFAULT 1 NOT NULL,
    job_tickets_id integer
);
CREATE TABLE public.job_history (
    id integer NOT NULL,
    callout_id integer NOT NULL,
    status_update character varying(50) DEFAULT NULL::character varying NOT NULL,
    updated_by character varying(50),
    "time" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updater_id integer,
    location text
);
CREATE SEQUENCE public.job_history_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.job_history_id_seq OWNED BY public.job_history.id;
CREATE TABLE public.job_notes (
    callout_id integer NOT NULL,
    note character varying(255) DEFAULT NULL::character varying NOT NULL
);
CREATE TABLE public.job_tickets (
    id integer NOT NULL,
    name text,
    description text,
    pictures text[],
    type text NOT NULL,
    callout_id integer,
    acknowledged text,
    worker_email text,
    scheduler_id integer,
    worker_id integer,
    notes jsonb,
    status text,
    created_at timestamp with time zone DEFAULT now(),
    "isVerified" boolean DEFAULT false NOT NULL,
    client_email text
);
CREATE SEQUENCE public.job_tickets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.job_tickets_id_seq OWNED BY public.job_tickets.id;
CREATE TABLE public.job_worker (
    callout_id integer NOT NULL,
    worker_id integer NOT NULL
);
CREATE TABLE public.lease (
    id integer NOT NULL,
    property_id integer NOT NULL,
    lessee_id integer NOT NULL,
    lease_start timestamp without time zone,
    lease_end timestamp without time zone,
    uploaded_by integer NOT NULL,
    active smallint DEFAULT 1 NOT NULL
);
CREATE SEQUENCE public.lease_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.lease_id_seq OWNED BY public.lease.id;
CREATE TABLE public.management_report (
    id integer NOT NULL,
    property_id integer NOT NULL,
    owner_id integer NOT NULL,
    report_upload_date date NOT NULL,
    report_location character varying(255) DEFAULT NULL::character varying NOT NULL
);
CREATE SEQUENCE public.management_report_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.management_report_id_seq OWNED BY public.management_report.id;
CREATE TABLE public.market_report (
    id integer NOT NULL,
    property_id integer NOT NULL,
    owner_id integer NOT NULL,
    report_upload_date date NOT NULL,
    report_location character varying(255) DEFAULT NULL::character varying NOT NULL
);
CREATE SEQUENCE public.market_report_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.market_report_id_seq OWNED BY public.market_report.id;
CREATE TABLE public.material_warranty_report (
    id integer NOT NULL,
    property_id integer NOT NULL,
    owner_id integer NOT NULL,
    report_upload_date date NOT NULL,
    report_location character varying(255) DEFAULT NULL::character varying NOT NULL
);
CREATE SEQUENCE public.material_warranty_report_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.material_warranty_report_id_seq OWNED BY public.material_warranty_report.id;
CREATE TABLE public.monthly_services_report (
    id integer NOT NULL,
    property_id integer NOT NULL,
    owner_id integer NOT NULL,
    report_upload_date date NOT NULL,
    report_location character varying(255) DEFAULT NULL::character varying NOT NULL
);
CREATE SEQUENCE public.monthly_services_report_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.monthly_services_report_id_seq OWNED BY public.monthly_services_report.id;
CREATE TABLE public.notifications (
    id integer NOT NULL,
    text text NOT NULL,
    type text,
    worker_email text,
    client_email text,
    created_at timestamp with time zone DEFAULT now(),
    data json,
    "isRead" boolean DEFAULT false
);
CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;
CREATE TABLE public.post_job_picture (
    id integer NOT NULL,
    callout_id integer NOT NULL,
    picture_location character varying(255) DEFAULT NULL::character varying NOT NULL
);
CREATE SEQUENCE public.post_job_picture_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.post_job_picture_id_seq OWNED BY public.post_job_picture.id;
CREATE TABLE public.pre_job_picture (
    id integer NOT NULL,
    callout_id integer NOT NULL,
    picture_location character varying(255) DEFAULT NULL::character varying NOT NULL
);
CREATE SEQUENCE public.pre_job_picture_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.pre_job_picture_id_seq OWNED BY public.pre_job_picture.id;
CREATE TABLE public.property (
    id integer NOT NULL,
    address character varying(100) DEFAULT NULL::character varying NOT NULL,
    type character varying(100) DEFAULT NULL::character varying,
    community character varying(50) DEFAULT NULL::character varying NOT NULL,
    city character varying(50) DEFAULT NULL::character varying NOT NULL,
    country character varying(50) DEFAULT NULL::character varying NOT NULL,
    comments text,
    uploaded_by integer NOT NULL,
    active smallint DEFAULT 1 NOT NULL
);
COMMENT ON COLUMN public.property.type IS 'It becomes Property Category is property type is Owned/Leased somewhere';
CREATE SEQUENCE public.property_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.property_id_seq OWNED BY public.property.id;
CREATE TABLE public.property_owned (
    id integer NOT NULL,
    property_id integer NOT NULL,
    owner_id integer NOT NULL,
    uploaded_by integer NOT NULL,
    active smallint DEFAULT 1 NOT NULL
);
CREATE SEQUENCE public.property_owned_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.property_owned_id_seq OWNED BY public.property_owned.id;
CREATE TABLE public.salaries (
    id integer NOT NULL,
    total_amount money,
    month text NOT NULL,
    employee_id integer NOT NULL,
    tax_amount money NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    basic_salary text,
    is_post boolean,
    salary_year_id integer,
    account_number text,
    bank_name text,
    cnic text,
    contact_number text
);
CREATE SEQUENCE public.salaries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.salaries_id_seq OWNED BY public.salaries.id;
CREATE TABLE public.salary_year (
    id integer NOT NULL,
    employee_id integer NOT NULL
);
CREATE SEQUENCE public.salary_year_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.salary_year_id_seq OWNED BY public.salary_year.id;
CREATE TABLE public.scheduler (
    id integer NOT NULL,
    callout_id integer,
    worker_id integer,
    notes text,
    date_on_calendar date,
    time_on_calendar time without time zone,
    end_time_on_calendar time without time zone,
    end_date_on_calendar date,
    confirmed boolean DEFAULT false NOT NULL,
    blocked boolean DEFAULT false
);
CREATE SEQUENCE public.scheduler_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.scheduler_id_seq OWNED BY public.scheduler.id;
CREATE TABLE public.team_expertise (
    id integer NOT NULL,
    skill_name text NOT NULL,
    skill_level integer NOT NULL,
    skill_parent integer
);
COMMENT ON TABLE public.team_expertise IS 'The team capability matrix';
CREATE SEQUENCE public.team_expertise_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.team_expertise_id_seq OWNED BY public.team_expertise.id;
CREATE TABLE public.teams (
    id integer NOT NULL,
    team_leader integer NOT NULL,
    team_color text NOT NULL,
    team_expertise jsonb DEFAULT '["Doors/Windows", "Mosquito Nets", "Tiles Grout/Silicon", "Drains Blockage", "Water Leak - Internal", "Water Leak - External", "Pump problems", "Water Tank Clean", "Sanitaryware & Fittings", "Other", "AC not cooling", "AC power issue", "AC leakage", "AC making sound", "AC general service", "AC deep service", "AC duct systems clean-sanitisation", "Lights - bulb change", "Lights - switches issue", "Sockets issue", "Power Loss (part or complete property)", "Breaker Tripping ", "Walls & Ceilings", "Woodwork - Doors etc", "External Boundary Spray", "Internal Gel Application "]'::jsonb
);
CREATE SEQUENCE public.teams_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.teams_id_seq OWNED BY public.teams.id;
CREATE TABLE public.users (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    display_name text,
    avatar_url text
);
CREATE TABLE public.worker (
    id integer NOT NULL,
    full_name character varying(50) DEFAULT NULL::character varying NOT NULL,
    email character varying(50) DEFAULT NULL::character varying NOT NULL,
    password character varying(50) DEFAULT NULL::character varying NOT NULL,
    phone character varying(14) DEFAULT NULL::character varying NOT NULL,
    description character varying(255) DEFAULT NULL::character varying,
    team_id integer,
    active smallint DEFAULT 1 NOT NULL,
    expo_token text,
    role text,
    "isEmergency" boolean DEFAULT false,
    expertise text
);
CREATE SEQUENCE public.worker_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.worker_id_seq OWNED BY public.worker.id;
ALTER TABLE ONLY public.admin ALTER COLUMN id SET DEFAULT nextval('public.admin_id_seq'::regclass);
ALTER TABLE ONLY public.callout ALTER COLUMN id SET DEFAULT nextval('public.callout_id_seq'::regclass);
ALTER TABLE ONLY public.client ALTER COLUMN id SET DEFAULT nextval('public.client_id_seq'::regclass);
ALTER TABLE ONLY public.contact ALTER COLUMN id SET DEFAULT nextval('public.contact_id_seq'::regclass);
ALTER TABLE ONLY public.documents ALTER COLUMN id SET DEFAULT nextval('public.documents_id_seq'::regclass);
ALTER TABLE ONLY public.employees ALTER COLUMN id SET DEFAULT nextval('public.employees_id_seq'::regclass);
ALTER TABLE ONLY public.inventory_article ALTER COLUMN id SET DEFAULT nextval('public.inventory_article_id_seq'::regclass);
ALTER TABLE ONLY public.inventory_picture ALTER COLUMN id SET DEFAULT nextval('public.inventory_picture_id_seq'::regclass);
ALTER TABLE ONLY public.inventory_report ALTER COLUMN id SET DEFAULT nextval('public.inventory_report_id_seq'::regclass);
ALTER TABLE ONLY public.inventory_room ALTER COLUMN id SET DEFAULT nextval('public.inventory_room_id_seq'::regclass);
ALTER TABLE ONLY public.job_history ALTER COLUMN id SET DEFAULT nextval('public.job_history_id_seq'::regclass);
ALTER TABLE ONLY public.job_tickets ALTER COLUMN id SET DEFAULT nextval('public.job_tickets_id_seq'::regclass);
ALTER TABLE ONLY public.lease ALTER COLUMN id SET DEFAULT nextval('public.lease_id_seq'::regclass);
ALTER TABLE ONLY public.management_report ALTER COLUMN id SET DEFAULT nextval('public.management_report_id_seq'::regclass);
ALTER TABLE ONLY public.market_report ALTER COLUMN id SET DEFAULT nextval('public.market_report_id_seq'::regclass);
ALTER TABLE ONLY public.material_warranty_report ALTER COLUMN id SET DEFAULT nextval('public.material_warranty_report_id_seq'::regclass);
ALTER TABLE ONLY public.monthly_services_report ALTER COLUMN id SET DEFAULT nextval('public.monthly_services_report_id_seq'::regclass);
ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);
ALTER TABLE ONLY public.post_job_picture ALTER COLUMN id SET DEFAULT nextval('public.post_job_picture_id_seq'::regclass);
ALTER TABLE ONLY public.pre_job_picture ALTER COLUMN id SET DEFAULT nextval('public.pre_job_picture_id_seq'::regclass);
ALTER TABLE ONLY public.property ALTER COLUMN id SET DEFAULT nextval('public.property_id_seq'::regclass);
ALTER TABLE ONLY public.property_owned ALTER COLUMN id SET DEFAULT nextval('public.property_owned_id_seq'::regclass);
ALTER TABLE ONLY public.salaries ALTER COLUMN id SET DEFAULT nextval('public.salaries_id_seq'::regclass);
ALTER TABLE ONLY public.salary_year ALTER COLUMN id SET DEFAULT nextval('public.salary_year_id_seq'::regclass);
ALTER TABLE ONLY public.scheduler ALTER COLUMN id SET DEFAULT nextval('public.scheduler_id_seq'::regclass);
ALTER TABLE ONLY public.team_expertise ALTER COLUMN id SET DEFAULT nextval('public.team_expertise_id_seq'::regclass);
ALTER TABLE ONLY public.teams ALTER COLUMN id SET DEFAULT nextval('public.teams_id_seq'::regclass);
ALTER TABLE ONLY public.worker ALTER COLUMN id SET DEFAULT nextval('public.worker_id_seq'::regclass);
ALTER TABLE ONLY auth.account_providers
    ADD CONSTRAINT account_providers_account_id_auth_provider_key UNIQUE (account_id, auth_provider);
ALTER TABLE ONLY auth.account_providers
    ADD CONSTRAINT account_providers_auth_provider_auth_provider_unique_id_key UNIQUE (auth_provider, auth_provider_unique_id);
ALTER TABLE ONLY auth.account_providers
    ADD CONSTRAINT account_providers_pkey PRIMARY KEY (id);
ALTER TABLE ONLY auth.account_roles
    ADD CONSTRAINT account_roles_pkey PRIMARY KEY (id);
ALTER TABLE ONLY auth.accounts
    ADD CONSTRAINT accounts_email_key UNIQUE (email);
ALTER TABLE ONLY auth.accounts
    ADD CONSTRAINT accounts_new_email_key UNIQUE (new_email);
ALTER TABLE ONLY auth.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);
ALTER TABLE ONLY auth.accounts
    ADD CONSTRAINT accounts_user_id_key UNIQUE (user_id);
ALTER TABLE ONLY auth.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);
ALTER TABLE ONLY auth.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);
ALTER TABLE ONLY auth.providers
    ADD CONSTRAINT providers_pkey PRIMARY KEY (provider);
ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (refresh_token);
ALTER TABLE ONLY auth.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (role);
ALTER TABLE ONLY auth.account_roles
    ADD CONSTRAINT user_roles_account_id_role_key UNIQUE (account_id, role);
ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.callout
    ADD CONSTRAINT callout_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.client
    ADD CONSTRAINT client_email_key UNIQUE (email);
ALTER TABLE ONLY public.client
    ADD CONSTRAINT client_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.contact
    ADD CONSTRAINT contact_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.inventory_article
    ADD CONSTRAINT inventory_article_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.inventory_picture
    ADD CONSTRAINT inventory_picture_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.inventory_report
    ADD CONSTRAINT inventory_report_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.inventory_room
    ADD CONSTRAINT inventory_room_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.job_history
    ADD CONSTRAINT job_history_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.job_notes
    ADD CONSTRAINT job_notes_pkey PRIMARY KEY (callout_id, note);
ALTER TABLE ONLY public.job
    ADD CONSTRAINT job_pkey PRIMARY KEY (callout_id);
ALTER TABLE ONLY public.job_tickets
    ADD CONSTRAINT job_tickets_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.lease
    ADD CONSTRAINT lease_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.management_report
    ADD CONSTRAINT management_report_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.market_report
    ADD CONSTRAINT market_report_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.material_warranty_report
    ADD CONSTRAINT material_warranty_report_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.monthly_services_report
    ADD CONSTRAINT monthly_services_report_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.post_job_picture
    ADD CONSTRAINT post_job_picture_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.pre_job_picture
    ADD CONSTRAINT pre_job_picture_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.property_owned
    ADD CONSTRAINT property_owned_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.property
    ADD CONSTRAINT property_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.salaries
    ADD CONSTRAINT salaries_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.salary_year
    ADD CONSTRAINT salary_year_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.scheduler
    ADD CONSTRAINT scheduler_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.team_expertise
    ADD CONSTRAINT team_expertise_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.worker
    ADD CONSTRAINT worker_email_key UNIQUE (email);
ALTER TABLE ONLY public.worker
    ADD CONSTRAINT worker_pkey PRIMARY KEY (id);
CREATE INDEX public_callout_callout_by0_idx ON public.callout USING btree (callout_by);
CREATE INDEX public_callout_property_id1_idx ON public.callout USING btree (property_id);
CREATE UNIQUE INDEX public_client_email0_idx ON public.client USING btree (email);
CREATE INDEX public_client_referred_by1_idx ON public.client USING btree (referred_by);
CREATE INDEX public_inventory_article_inventory_room_id0_idx ON public.inventory_article USING btree (inventory_room_id);
CREATE INDEX public_inventory_picture_inventory_room_id0_idx ON public.inventory_picture USING btree (inventory_room_id);
CREATE INDEX public_inventory_report_ops_team_id1_idx ON public.inventory_report USING btree (ops_team_id);
CREATE INDEX public_inventory_report_property_id0_idx ON public.inventory_report USING btree (property_id);
CREATE UNIQUE INDEX public_inventory_room_inventory_report_id0_idx ON public.inventory_room USING btree (inventory_report_id, room);
CREATE INDEX public_inventory_room_inventory_report_id1_idx ON public.inventory_room USING btree (inventory_report_id);
CREATE INDEX public_job_callout_id0_idx ON public.job USING btree (callout_id);
CREATE INDEX public_job_history_callout_id0_idx ON public.job_history USING btree (callout_id);
CREATE INDEX public_job_worker_worker_id0_idx ON public.job_worker USING btree (worker_id);
CREATE INDEX public_lease_lessee_id1_idx ON public.lease USING btree (lessee_id);
CREATE INDEX public_lease_property_id0_idx ON public.lease USING btree (property_id);
CREATE INDEX public_management_report_owner_id1_idx ON public.management_report USING btree (owner_id);
CREATE INDEX public_management_report_property_id0_idx ON public.management_report USING btree (property_id);
CREATE INDEX public_market_report_owner_id0_idx ON public.market_report USING btree (owner_id);
CREATE INDEX public_market_report_property_id1_idx ON public.market_report USING btree (property_id);
CREATE INDEX public_material_warranty_report_owner_id1_idx ON public.material_warranty_report USING btree (owner_id);
CREATE INDEX public_material_warranty_report_property_id0_idx ON public.material_warranty_report USING btree (property_id);
CREATE INDEX public_monthly_services_report_owner_id1_idx ON public.monthly_services_report USING btree (owner_id);
CREATE INDEX public_monthly_services_report_property_id0_idx ON public.monthly_services_report USING btree (property_id);
CREATE INDEX public_post_job_picture_callout_id0_idx ON public.post_job_picture USING btree (callout_id);
CREATE INDEX public_pre_job_picture_callout_id0_idx ON public.pre_job_picture USING btree (callout_id);
CREATE INDEX public_property_owned_owner_id1_idx ON public.property_owned USING btree (owner_id);
CREATE INDEX public_property_owned_property_id0_idx ON public.property_owned USING btree (property_id);
CREATE INDEX public_scheduler_callout_id0_idx ON public.scheduler USING btree (callout_id);
CREATE INDEX public_scheduler_worker_id1_idx ON public.scheduler USING btree (worker_id);
CREATE TRIGGER set_auth_account_providers_updated_at BEFORE UPDATE ON auth.account_providers FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
CREATE TRIGGER set_auth_accounts_updated_at BEFORE UPDATE ON auth.accounts FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
CREATE TRIGGER set_public_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
ALTER TABLE ONLY auth.account_providers
    ADD CONSTRAINT account_providers_account_id_fkey FOREIGN KEY (account_id) REFERENCES auth.accounts(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY auth.account_providers
    ADD CONSTRAINT account_providers_auth_provider_fkey FOREIGN KEY (auth_provider) REFERENCES auth.providers(provider) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY auth.account_roles
    ADD CONSTRAINT account_roles_account_id_fkey FOREIGN KEY (account_id) REFERENCES auth.accounts(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY auth.account_roles
    ADD CONSTRAINT account_roles_role_fkey FOREIGN KEY (role) REFERENCES auth.roles(role) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY auth.accounts
    ADD CONSTRAINT accounts_default_role_fkey FOREIGN KEY (default_role) REFERENCES auth.roles(role) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY auth.accounts
    ADD CONSTRAINT accounts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_account_id_fkey FOREIGN KEY (account_id) REFERENCES auth.accounts(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.callout
    ADD CONSTRAINT callout_callout_by_fkey FOREIGN KEY (callout_by) REFERENCES public.client(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.callout
    ADD CONSTRAINT callout_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.property(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.client
    ADD CONSTRAINT client_referred_by_fkey FOREIGN KEY (referred_by) REFERENCES public.client(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.inventory_article
    ADD CONSTRAINT inventory_article_inventory_room_id_fkey FOREIGN KEY (inventory_room_id) REFERENCES public.inventory_room(id) ON UPDATE RESTRICT ON DELETE CASCADE;
ALTER TABLE ONLY public.inventory_picture
    ADD CONSTRAINT inventory_picture_inventory_room_id_fkey FOREIGN KEY (inventory_room_id) REFERENCES public.inventory_room(id) ON UPDATE RESTRICT ON DELETE CASCADE;
ALTER TABLE ONLY public.inventory_report
    ADD CONSTRAINT inventory_report_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.property(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.inventory_room
    ADD CONSTRAINT inventory_room_inventory_report_id_fkey FOREIGN KEY (inventory_report_id) REFERENCES public.inventory_report(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.job
    ADD CONSTRAINT job_job_tickets_id_fkey FOREIGN KEY (job_tickets_id) REFERENCES public.job_tickets(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.job_tickets
    ADD CONSTRAINT job_tickets_callout_id_fkey FOREIGN KEY (callout_id) REFERENCES public.callout(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.job_tickets
    ADD CONSTRAINT job_tickets_scheduler_id_fkey FOREIGN KEY (scheduler_id) REFERENCES public.scheduler(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.job_tickets
    ADD CONSTRAINT job_tickets_worker_id_fkey FOREIGN KEY (worker_id) REFERENCES public.worker(id);
ALTER TABLE ONLY public.job_worker
    ADD CONSTRAINT job_worker_worker_id_fkey FOREIGN KEY (worker_id) REFERENCES public.worker(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.lease
    ADD CONSTRAINT lease_lessee_id_fkey FOREIGN KEY (lessee_id) REFERENCES public.client(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.lease
    ADD CONSTRAINT lease_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.property(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.management_report
    ADD CONSTRAINT management_report_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.client(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.management_report
    ADD CONSTRAINT management_report_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.property(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.market_report
    ADD CONSTRAINT market_report_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.client(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.market_report
    ADD CONSTRAINT market_report_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.property(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.material_warranty_report
    ADD CONSTRAINT material_warranty_report_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.client(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.material_warranty_report
    ADD CONSTRAINT material_warranty_report_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.property(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.monthly_services_report
    ADD CONSTRAINT monthly_services_report_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.client(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.monthly_services_report
    ADD CONSTRAINT monthly_services_report_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.property(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.property_owned
    ADD CONSTRAINT property_owned_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.client(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.property_owned
    ADD CONSTRAINT property_owned_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.property(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.salaries
    ADD CONSTRAINT salaries_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON UPDATE RESTRICT ON DELETE CASCADE;
ALTER TABLE ONLY public.salary_year
    ADD CONSTRAINT salary_year_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON UPDATE RESTRICT ON DELETE CASCADE;
ALTER TABLE ONLY public.scheduler
    ADD CONSTRAINT scheduler_callout_id_fkey FOREIGN KEY (callout_id) REFERENCES public.callout(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.scheduler
    ADD CONSTRAINT scheduler_worker_id_fkey FOREIGN KEY (worker_id) REFERENCES public.worker(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_team_leader_fkey FOREIGN KEY (team_leader) REFERENCES public.worker(id);


INSERT INTO auth.roles (role)
    VALUES ('user'), ('me'), ('anonymous'), ('client'), ('admin');

INSERT INTO auth.providers (provider)
    VALUES ('github'), ('facebook'), ('twitter'), ('google'), ('apple'), ('linkedin'), ('windowslive'), ('spotify');

