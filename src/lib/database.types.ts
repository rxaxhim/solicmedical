// ============================================================================
// Supabase database types — Solic Medical
//
// This file is hand-written to match supabase/migrations/0001_initial_schema.sql.
// Once your schema is live, you can REGENERATE it from the source of truth with:
//
//   npx supabase gen types typescript --project-id <your-project-ref> \
//     --schema public > src/lib/database.types.ts
//
// (See README.md → "Regenerating database types".) Keep this file in sync with
// the migrations so the typed clients stay accurate.
// ============================================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          display_order: number;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          display_order?: number;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          display_order?: number;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          model_code: string | null;
          description: string | null;
          category_id: string | null;
          subcategory_id: string | null;
          brand: string | null;
          featured: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          model_code?: string | null;
          description?: string | null;
          category_id?: string | null;
          subcategory_id?: string | null;
          brand?: string | null;
          featured?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          model_code?: string | null;
          description?: string | null;
          category_id?: string | null;
          subcategory_id?: string | null;
          brand?: string | null;
          featured?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "products_subcategory_id_fkey";
            columns: ["subcategory_id"];
            referencedRelation: "subcategories";
            referencedColumns: ["id"];
          },
        ];
      };
      subcategories: {
        Row: {
          id: string;
          category_id: string;
          name: string;
          slug: string;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          name: string;
          slug: string;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          name?: string;
          slug?: string;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "subcategories_category_id_fkey";
            columns: ["category_id"];
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          image_url: string;
          alt_text: string | null;
          is_primary: boolean;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          image_url: string;
          alt_text?: string | null;
          is_primary?: boolean;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          image_url?: string;
          alt_text?: string | null;
          is_primary?: boolean;
          display_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      product_overview: {
        Row: {
          id: string;
          product_id: string;
          content: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          content: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          content?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_overview_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      product_configurations: {
        Row: {
          id: string;
          product_id: string;
          config_name: string;
          config_details: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          config_name: string;
          config_details?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          config_name?: string;
          config_details?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_configurations_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      product_documents: {
        Row: {
          id: string;
          product_id: string;
          title: string;
          pdf_url: string;
          document_type: string;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          title: string;
          pdf_url: string;
          document_type?: string;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          title?: string;
          pdf_url?: string;
          document_type?: string;
          display_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_documents_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      product_videos: {
        Row: {
          id: string;
          product_id: string;
          title: string;
          youtube_url: string;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          title: string;
          youtube_url: string;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          title?: string;
          youtube_url?: string;
          display_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_videos_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      accessories: {
        Row: {
          id: string;
          product_id: string;
          name: string;
          product_code: string | null;
          description: string | null;
          image_url: string | null;
          accessory_category_id: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          name: string;
          product_code?: string | null;
          description?: string | null;
          image_url?: string | null;
          accessory_category_id?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          name?: string;
          product_code?: string | null;
          description?: string | null;
          image_url?: string | null;
          accessory_category_id?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "accessories_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "accessories_accessory_category_id_fkey";
            columns: ["accessory_category_id"];
            referencedRelation: "accessory_categories";
            referencedColumns: ["id"];
          },
        ];
      };
      accessory_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      related_products: {
        Row: {
          id: string;
          product_id: string;
          related_product_id: string;
          display_order: number;
        };
        Insert: {
          id?: string;
          product_id: string;
          related_product_id: string;
          display_order?: number;
        };
        Update: {
          id?: string;
          product_id?: string;
          related_product_id?: string;
          display_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: "related_products_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "related_products_related_product_id_fkey";
            columns: ["related_product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

// ----------------------------------------------------------------------------
// Convenience helpers — import these for cleaner call sites, e.g.
//   import type { Tables } from '@/lib/database.types';
//   type Product = Tables<'products'>;
// ----------------------------------------------------------------------------
type PublicSchema = Database["public"];

export type Tables<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Row"];

export type TablesInsert<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Insert"];

export type TablesUpdate<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Update"];
