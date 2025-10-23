CREATE TYPE "public"."dropdown_type" AS ENUM('services', 'shipping_methods', 'cargo_types');--> statement-breakpoint
CREATE TABLE "dropdown_options" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "dropdown_type" NOT NULL,
	"label" text NOT NULL,
	"value" text NOT NULL,
	"order" text DEFAULT '0',
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);--> statement-breakpoint
-- Insert default dropdown options
INSERT INTO "dropdown_options" ("type", "label", "value", "order", "is_active") VALUES
('services', 'Shipping', 'shipping', '1', true),
('services', 'Logistics', 'logistics', '2', true),
('services', 'Import', 'import', '3', true),
('services', 'Export', 'export', '4', true),
('services', 'International Procurement', 'procurement', '5', true),
('services', 'Customs Clearance', 'customs', '6', true),
('services', 'Warehousing', 'warehousing', '7', true),
('shipping_methods', 'Air Freight', 'air', '1', true),
('shipping_methods', 'Sea Freight', 'sea', '2', true),
('shipping_methods', 'Land Transport', 'land', '3', true),
('shipping_methods', 'Multimodal', 'multimodal', '4', true),
('cargo_types', 'Electronics', 'electronics', '1', true),
('cargo_types', 'Textiles', 'textiles', '2', true),
('cargo_types', 'Machinery', 'machinery', '3', true),
('cargo_types', 'Chemicals', 'chemicals', '4', true),
('cargo_types', 'Food & Beverages', 'food_beverages', '5', true),
('cargo_types', 'Pharmaceuticals', 'pharmaceuticals', '6', true),
('cargo_types', 'Other', 'other', '7', true);
