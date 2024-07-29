alter table "public"."attributes" alter column "key" set not null;

alter table "public"."attributes" alter column "uuid" set default gen_random_uuid();

alter table "public"."attributes" alter column "uuid" set not null;

alter table "public"."attributes" alter column "uuid" set data type uuid using "uuid"::uuid;

alter table "public"."attributes" alter column "value" set not null;

alter table "public"."books" add column "deleted_at" timestamp with time zone;

alter table "public"."books" alter column "created_at" set default now();

alter table "public"."books" alter column "created_at" set not null;

alter table "public"."books" alter column "created_at" set data type timestamp with time zone using "created_at"::timestamp with time zone;

alter table "public"."books" alter column "title" set not null;

alter table "public"."books" alter column "updated_at" set not null;

alter table "public"."books" alter column "updated_at" set data type timestamp with time zone using "updated_at"::timestamp with time zone;

alter table "public"."books" alter column "uuid" set default gen_random_uuid();

alter table "public"."books" alter column "uuid" set not null;

alter table "public"."books" alter column "uuid" set data type uuid using "uuid"::uuid;

alter table "public"."books_attributes" alter column "attribute_id" set not null;

alter table "public"."books_attributes" alter column "attribute_id" set data type uuid using "attribute_id"::uuid;

alter table "public"."books_attributes" alter column "book_id" set not null;

alter table "public"."books_attributes" alter column "book_id" set data type uuid using "book_id"::uuid;

alter table "public"."contents" add column "deleted_at" timestamp with time zone;

alter table "public"."contents" alter column "book_id" set not null;

alter table "public"."contents" alter column "book_id" set data type uuid using "book_id"::uuid;

alter table "public"."contents" alter column "created_at" set default now();

alter table "public"."contents" alter column "created_at" set not null;

alter table "public"."contents" alter column "created_at" set data type timestamp with time zone using "created_at"::timestamp with time zone;

alter table "public"."contents" alter column "link_id" set not null;

alter table "public"."contents" alter column "link_id" set data type uuid using "link_id"::uuid;

alter table "public"."contents" alter column "title" set not null;

alter table "public"."contents" alter column "updated_at" set not null;

alter table "public"."contents" alter column "updated_at" set data type timestamp with time zone using "updated_at"::timestamp with time zone;

alter table "public"."contents" alter column "uuid" set default gen_random_uuid();

alter table "public"."contents" alter column "uuid" set not null;

alter table "public"."contents" alter column "uuid" set data type uuid using "uuid"::uuid;

alter table "public"."link" alter column "path" set not null;

alter table "public"."link" alter column "target_url" set not null;

alter table "public"."link" alter column "uuid" set default gen_random_uuid();

alter table "public"."link" alter column "uuid" set not null;

alter table "public"."link" alter column "uuid" set data type uuid using "uuid"::uuid;

CREATE INDEX attributes_key_value_idx ON public.attributes USING btree (key, value);

CREATE UNIQUE INDEX attributes_uuid_key ON public.attributes USING btree (uuid);

CREATE INDEX books_attributes_book_id_attribute_id_idx ON public.books_attributes USING btree (book_id, attribute_id);

CREATE UNIQUE INDEX books_uuid_key ON public.books USING btree (uuid);

CREATE UNIQUE INDEX contents_uuid_key ON public.contents USING btree (uuid);

CREATE UNIQUE INDEX link_uuid_key ON public.link USING btree (uuid);

alter table "public"."attributes" add constraint "attributes_uuid_key" UNIQUE using index "attributes_uuid_key";

alter table "public"."books" add constraint "books_uuid_key" UNIQUE using index "books_uuid_key";

alter table "public"."books_attributes" add constraint "public_books_attributes_attribute_id_fkey" FOREIGN KEY (attribute_id) REFERENCES attributes(uuid) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."books_attributes" validate constraint "public_books_attributes_attribute_id_fkey";

alter table "public"."books_attributes" add constraint "public_books_attributes_book_id_fkey" FOREIGN KEY (book_id) REFERENCES books(uuid) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."books_attributes" validate constraint "public_books_attributes_book_id_fkey";

alter table "public"."contents" add constraint "contents_uuid_key" UNIQUE using index "contents_uuid_key";

alter table "public"."contents" add constraint "public_contents_book_id_fkey" FOREIGN KEY (book_id) REFERENCES books(uuid) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."contents" validate constraint "public_contents_book_id_fkey";

alter table "public"."contents" add constraint "public_contents_link_id_fkey" FOREIGN KEY (link_id) REFERENCES link(uuid) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."contents" validate constraint "public_contents_link_id_fkey";

alter table "public"."link" add constraint "link_uuid_key" UNIQUE using index "link_uuid_key";

CREATE TRIGGER handle_books_updated_at BEFORE UPDATE ON public.books FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

CREATE TRIGGER handle_contents_updated_at BEFORE UPDATE ON public.contents FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');
