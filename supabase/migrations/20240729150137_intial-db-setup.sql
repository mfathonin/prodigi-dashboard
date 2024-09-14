create extension if not exists "moddatetime" with schema "extensions";


create sequence if not exists "public"."attributes_id_seq";

create sequence if not exists "public"."books_attributes_id_seq";

create sequence if not exists "public"."books_id_seq";

create sequence if not exists "public"."contents_id_seq";

create sequence if not exists "public"."link_id_seq";

create table if not exists "public"."attributes" (
    "id" bigint not null default nextval('attributes_id_seq'::regclass),
    "uuid" text,
    "key" text,
    "value" text
);


create table if not exists "public"."books" (
    "id" bigint not null default nextval('books_id_seq'::regclass),
    "firestore_id" text,
    "uuid" text,
    "created_at" text,
    "updated_at" text,
    "title" text
);


create table if not exists "public"."books_attributes" (
    "id" bigint not null default nextval('books_attributes_id_seq'::regclass),
    "book_id" text,
    "attribute_id" text
);


create table if not exists "public"."contents" (
    "id" bigint not null default nextval('contents_id_seq'::regclass),
    "title" text,
    "firestore_id" text,
    "uuid" text,
    "link_id" text,
    "created_at" text,
    "updated_at" text,
    "book_id" text
);


create table if not exists "public"."link" (
    "id" bigint not null default nextval('link_id_seq'::regclass),
    "uuid" text,
    "target_url" text,
    "path" text
);


alter sequence "public"."attributes_id_seq" owned by "public"."attributes"."id";

alter sequence "public"."books_attributes_id_seq" owned by "public"."books_attributes"."id";

alter sequence "public"."books_id_seq" owned by "public"."books"."id";

alter sequence "public"."contents_id_seq" owned by "public"."contents"."id";

alter sequence "public"."link_id_seq" owned by "public"."link"."id";

CREATE UNIQUE INDEX if not exists attributes_pkey ON public.attributes USING btree (id);

CREATE UNIQUE INDEX if not exists books_attributes_pkey ON public.books_attributes USING btree (id);

CREATE UNIQUE INDEX if not exists books_pkey ON public.books USING btree (id);

CREATE UNIQUE INDEX if not exists contents_pkey ON public.contents USING btree (id);

CREATE UNIQUE INDEX if not exists link_pkey ON public.link USING btree (id);

alter table "public"."attributes" add constraint "attributes_pkey" PRIMARY KEY using index "attributes_pkey";

alter table "public"."books" add constraint "books_pkey" PRIMARY KEY using index "books_pkey";

alter table "public"."books_attributes" add constraint "books_attributes_pkey" PRIMARY KEY using index "books_attributes_pkey";

alter table "public"."contents" add constraint "contents_pkey" PRIMARY KEY using index "contents_pkey";

alter table "public"."link" add constraint "link_pkey" PRIMARY KEY using index "link_pkey";

grant delete on table "public"."attributes" to "anon";

grant insert on table "public"."attributes" to "anon";

grant references on table "public"."attributes" to "anon";

grant select on table "public"."attributes" to "anon";

grant trigger on table "public"."attributes" to "anon";

grant truncate on table "public"."attributes" to "anon";

grant update on table "public"."attributes" to "anon";

grant delete on table "public"."attributes" to "authenticated";

grant insert on table "public"."attributes" to "authenticated";

grant references on table "public"."attributes" to "authenticated";

grant select on table "public"."attributes" to "authenticated";

grant trigger on table "public"."attributes" to "authenticated";

grant truncate on table "public"."attributes" to "authenticated";

grant update on table "public"."attributes" to "authenticated";

grant delete on table "public"."attributes" to "service_role";

grant insert on table "public"."attributes" to "service_role";

grant references on table "public"."attributes" to "service_role";

grant select on table "public"."attributes" to "service_role";

grant trigger on table "public"."attributes" to "service_role";

grant truncate on table "public"."attributes" to "service_role";

grant update on table "public"."attributes" to "service_role";

grant delete on table "public"."books" to "anon";

grant insert on table "public"."books" to "anon";

grant references on table "public"."books" to "anon";

grant select on table "public"."books" to "anon";

grant trigger on table "public"."books" to "anon";

grant truncate on table "public"."books" to "anon";

grant update on table "public"."books" to "anon";

grant delete on table "public"."books" to "authenticated";

grant insert on table "public"."books" to "authenticated";

grant references on table "public"."books" to "authenticated";

grant select on table "public"."books" to "authenticated";

grant trigger on table "public"."books" to "authenticated";

grant truncate on table "public"."books" to "authenticated";

grant update on table "public"."books" to "authenticated";

grant delete on table "public"."books" to "service_role";

grant insert on table "public"."books" to "service_role";

grant references on table "public"."books" to "service_role";

grant select on table "public"."books" to "service_role";

grant trigger on table "public"."books" to "service_role";

grant truncate on table "public"."books" to "service_role";

grant update on table "public"."books" to "service_role";

grant delete on table "public"."books_attributes" to "anon";

grant insert on table "public"."books_attributes" to "anon";

grant references on table "public"."books_attributes" to "anon";

grant select on table "public"."books_attributes" to "anon";

grant trigger on table "public"."books_attributes" to "anon";

grant truncate on table "public"."books_attributes" to "anon";

grant update on table "public"."books_attributes" to "anon";

grant delete on table "public"."books_attributes" to "authenticated";

grant insert on table "public"."books_attributes" to "authenticated";

grant references on table "public"."books_attributes" to "authenticated";

grant select on table "public"."books_attributes" to "authenticated";

grant trigger on table "public"."books_attributes" to "authenticated";

grant truncate on table "public"."books_attributes" to "authenticated";

grant update on table "public"."books_attributes" to "authenticated";

grant delete on table "public"."books_attributes" to "service_role";

grant insert on table "public"."books_attributes" to "service_role";

grant references on table "public"."books_attributes" to "service_role";

grant select on table "public"."books_attributes" to "service_role";

grant trigger on table "public"."books_attributes" to "service_role";

grant truncate on table "public"."books_attributes" to "service_role";

grant update on table "public"."books_attributes" to "service_role";

grant delete on table "public"."contents" to "anon";

grant insert on table "public"."contents" to "anon";

grant references on table "public"."contents" to "anon";

grant select on table "public"."contents" to "anon";

grant trigger on table "public"."contents" to "anon";

grant truncate on table "public"."contents" to "anon";

grant update on table "public"."contents" to "anon";

grant delete on table "public"."contents" to "authenticated";

grant insert on table "public"."contents" to "authenticated";

grant references on table "public"."contents" to "authenticated";

grant select on table "public"."contents" to "authenticated";

grant trigger on table "public"."contents" to "authenticated";

grant truncate on table "public"."contents" to "authenticated";

grant update on table "public"."contents" to "authenticated";

grant delete on table "public"."contents" to "service_role";

grant insert on table "public"."contents" to "service_role";

grant references on table "public"."contents" to "service_role";

grant select on table "public"."contents" to "service_role";

grant trigger on table "public"."contents" to "service_role";

grant truncate on table "public"."contents" to "service_role";

grant update on table "public"."contents" to "service_role";

grant delete on table "public"."link" to "anon";

grant insert on table "public"."link" to "anon";

grant references on table "public"."link" to "anon";

grant select on table "public"."link" to "anon";

grant trigger on table "public"."link" to "anon";

grant truncate on table "public"."link" to "anon";

grant update on table "public"."link" to "anon";

grant delete on table "public"."link" to "authenticated";

grant insert on table "public"."link" to "authenticated";

grant references on table "public"."link" to "authenticated";

grant select on table "public"."link" to "authenticated";

grant trigger on table "public"."link" to "authenticated";

grant truncate on table "public"."link" to "authenticated";

grant update on table "public"."link" to "authenticated";

grant delete on table "public"."link" to "service_role";

grant insert on table "public"."link" to "service_role";

grant references on table "public"."link" to "service_role";

grant select on table "public"."link" to "service_role";

grant trigger on table "public"."link" to "service_role";

grant truncate on table "public"."link" to "service_role";

grant update on table "public"."link" to "service_role";
