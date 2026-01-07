set names 'utf8';
set session_replication_role = 'replica';

create table "user" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "email" varchar(255) not null, "password" varchar(255) not null, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "is_admin" bool not null, "role" varchar(50) not null default 'people', "photo" bytea null, "company" varchar(255) not null, "card_number" varchar(255) not null, "phone_number" varchar(255) not null, "is_basic" bool not null);

create table "testimonial" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "title" varchar(255) not null, "message" varchar(255) not null);

create table "product" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "category" varchar(255) not null, "photo_url" varchar(255) not null, "name" varchar(255) not null, "description" varchar(255) null, "views_count" int DEFAULT 0);

set session_replication_role = 'origin';
--password is admin
INSERT INTO "user" (created_at, updated_at, email, password, first_name, last_name, is_admin, role, photo, company, card_number, phone_number, is_basic) VALUES (now(), now(), 'admin', '$argon2id$v=19$m=65536,t=3,p=4$jmtTCTEcjngErif00RfYAg$biS59Ixnrz+dHeJrJ91ybmHt+4wrVgcH3RXvfaqZtNI', 'admin', 'admin', true, 'super_admin', null, 'Demon Slayer Corps', '1234 5678 9012 3456', '+1 234 567 890', true);
--password is admin123
INSERT INTO "user" (created_at, updated_at, email, password, first_name, last_name, is_admin, role, photo, company, card_number, phone_number, is_basic) VALUES (now(), now(), 'admin@demonslayer.com', '$argon2id$v=19$m=65536,t=3,p=4$vqx/3hdO1SNt5UZk1Tf5CQ$/KYG5l9TGF3mB8ryur5Eh4fVXTWBR3gLS44atkFjScE', 'Super', 'Admin', true, 'super_admin', null, 'Demon Slayer Corps', '1234 5678 9012 3456', '+1 234 567 890', true);
INSERT INTO "user" (created_at, updated_at, email, password, first_name, last_name, is_admin, role, photo, company, card_number, phone_number, is_basic) VALUES (now(), now(), 'user', '$argon2id$v=19$m=65536,t=3,p=4$hJX1v2kH3UFlEOhZFZn3RQ$oXDFhwgoxosiunmy720fBEBGiin0XNeTvDlDk3dUAT4', 'user', 'user', false, 'people', null, 'Demon Slayer Corps', '1234 5678 9012 3456', '+1 234 567 890', true);
--password is user123 (hash will be generated on first login or can be created via API)
-- Note: This hash is a placeholder. The actual hash should be generated using argon2.hash('user123')
-- For now, users can register via the signup page or the hash will be updated on first password change
INSERT INTO "user" (created_at, updated_at, email, password, first_name, last_name, is_admin, role, photo, company, card_number, phone_number, is_basic) VALUES (now(), now(), 'user@demonslayer.com', '$argon2id$v=19$m=65536,t=3,p=4$hJX1v2kH3UFlEOhZFZn3RQ$oXDFhwgoxosiunmy720fBEBGiin0XNeTvDlDk3dUAT4', 'Regular', 'User', false, 'people', null, 'Demon Slayer Corps', '1234 5678 9012 3456', '+1 234 567 890', true);

--insert default products into the table
INSERT INTO "product" ("created_at", "category", "photo_url", "name", "description") VALUES (now(), 'Healing', '/api/file?path=config/products/crystals/amethyst.jpg&type=image/jpg', 'Amethyst', 'a violet variety of quartz');
INSERT INTO "product" ("created_at", "category", "photo_url", "name", "description") VALUES (now(), 'Gemstones', '/api/file?path=config/products/crystals/ruby.jpg&type=image/jpg', 'Ruby', 'an intense heart crystal');
INSERT INTO "product" ("created_at", "category", "photo_url", "name", "description") VALUES (now(), 'Healing', '/api/file?path=config/products/crystals/opal.jpg&type=image/jpg', 'Opal', 'the precious stone');
INSERT INTO "product" ("created_at", "category", "photo_url", "name", "description") VALUES (now(), 'Jewellery', '/api/file?path=config/products/crystals/sapphire.jpg&type=image/jpg', 'Sapphire', '');
INSERT INTO "product" ("created_at", "category", "photo_url", "name", "description") VALUES (now(), 'Healing', '/api/file?path=config/products/crystals/amber.jpg&type=image/jpg', 'Amber', 'fossilized tree resin');
INSERT INTO "product" ("created_at", "category", "photo_url", "name", "description") VALUES (now(), 'Jewellery', '/api/file?path=config/products/crystals/emerald.jpg&type=image/jpg', 'Emerald', 'symbol of fertility and life');
INSERT INTO "product" ("created_at", "category", "photo_url", "name", "description") VALUES (now(), 'Jewellery', '/api/file?path=config/products/crystals/shattuckite.jpg&type=image/jpg', 'Shattuckite', 'mistery');
INSERT INTO "product" ("created_at", "category", "photo_url", "name", "description") VALUES (now(), 'Gemstones', '/api/file?path=config/products/crystals/bismuth.jpg&type=image/jpg', 'Bismuth', 'rainbow');
INSERT INTO "product" ("created_at", "category", "photo_url", "name", "description") VALUES ('2005-01-10 12:00:00', 'Gemstones', '/api/file?path=config/products/crystals/labradorite.jpg&type=image/jpg', 'Labradorite', 'rainbow');
INSERT INTO "product" ("created_at", "category", "photo_url", "name", "description") VALUES ('2023-12-10 12:00:00', 'Gemstones', '/api/file?path=config/products/crystals/axinite.jpg&type=image/jpg', 'Axinite', 'brown');
INSERT INTO "product" ("created_at", "category", "photo_url", "name", "description") VALUES ('2020-11-18 12:00:00', 'Gemstones', '/api/file?path=config/products/crystals/pietersite.jpg&type=image/jpg', 'Pietersite', 'blue');

CREATE INDEX IF NOT EXISTS "IDX_users_email" ON "user" ("email");

-- Create mission table
create table "mission" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title" varchar(255) not null, "description" text not null, "mission_type" varchar(50) not null default 'kill_demon', "status" varchar(50) not null default 'pending', "assigned_by_id" int not null, "assigned_to_id" int null, "location" varchar(255) null, "notes" text null, "completed_at" timestamptz(0) null);

-- Create chat_message table
create table "chat_message" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "message" text not null, "sender_id" int not null, "sender_role" varchar(50) null, "recipient_id" int null, "is_public" bool not null default false, "hashira_image" varchar(255) null);

-- Create system_logs table
create table "system_logs" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "level" varchar(20) not null, "message" text not null, "context" jsonb null);
INSERT INTO "system_logs" ("level", "message", "context") VALUES ('info', 'System initialized', '{}');
INSERT INTO "system_logs" ("level", "message", "context") VALUES ('warn', 'High memory usage detected', '{"memory": "85%"}');
INSERT INTO "system_logs" ("level", "error", "message", "context") VALUES ('error', 'Database connection failed', '{"retries": 3}');
