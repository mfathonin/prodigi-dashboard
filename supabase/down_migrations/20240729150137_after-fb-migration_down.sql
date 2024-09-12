DROP TABLE IF EXISTS "public"."link";
DROP TABLE IF EXISTS "public"."contents";
DROP TABLE IF EXISTS "public"."books_attributes";
DROP TABLE IF EXISTS "public"."books";
DROP TABLE IF EXISTS "public"."attributes";

DROP SEQUENCE IF EXISTS "public"."link_id_seq";
DROP SEQUENCE IF EXISTS "public"."contents_id_seq";
DROP SEQUENCE IF EXISTS "public"."books_id_seq";
DROP SEQUENCE IF EXISTS "public"."books_attributes_id_seq";
DROP SEQUENCE IF EXISTS "public"."attributes_id_seq";

DROP EXTENSION IF EXISTS "moddatetime";