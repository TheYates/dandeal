CREATE TABLE "partners" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"icon" text NOT NULL,
	"order" text DEFAULT '0',
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Insert default partners
INSERT INTO "partners" ("name", "icon", "order", "is_active") VALUES
('JCTRANS', '🚚', '0', true),
('Global Logistics', '🌍', '1', true),
('JCTRANS Orange', '📦', '2', true),
('NAFL', '✈️', '3', true),
('DP World', '🏢', '4', true),
('FAEFA', '🌐', '5', true),
('GIFF', '📋', '6', true),
('Shipping Authority', '⚓', '7', true),
('DF Alliance', '🤝', '8', true);

