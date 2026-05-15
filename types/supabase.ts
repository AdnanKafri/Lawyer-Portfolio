export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type Row<T> = T;
type Insert<T> = T;
type Update<T> = Partial<T>;

export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: Row<{
          id: string;
          name: string;
          slug: string;
          business_type: string;
          default_locale: "en" | "ar";
          is_active: boolean;
          created_at: string;
          updated_at: string;
        }>;
        Insert: Insert<{
          id?: string;
          name: string;
          slug: string;
          business_type?: string;
          default_locale?: "en" | "ar";
          is_active?: boolean;
        }>;
        Update: Update<{
          name: string;
          slug: string;
          business_type: string;
          default_locale: "en" | "ar";
          is_active: boolean;
          updated_at: string;
        }>;
      };
      admin_users: {
        Row: Row<{
          id: string;
          organization_id: string;
          auth_user_id: string;
          email: string;
          full_name: string | null;
          role: "super_admin" | "editor";
          is_active: boolean;
          created_at: string;
          updated_at: string;
        }>;
        Insert: Insert<{
          id?: string;
          organization_id: string;
          auth_user_id: string;
          email: string;
          full_name?: string | null;
          role?: "super_admin" | "editor";
          is_active?: boolean;
        }>;
        Update: Update<{
          email: string;
          full_name: string | null;
          role: "super_admin" | "editor";
          is_active: boolean;
          updated_at: string;
        }>;
      };
      media_assets: {
        Row: Row<{
          id: string;
          organization_id: string;
          locale: "en" | "ar" | null;
          bucket: string;
          path: string;
          file_name: string;
          mime_type: string;
          alt_text: string | null;
          size_bytes: number;
          width: number | null;
          height: number | null;
          is_active: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        }>;
        Insert: Insert<{
          id?: string;
          organization_id: string;
          locale?: "en" | "ar" | null;
          bucket?: string;
          path: string;
          file_name: string;
          mime_type: string;
          alt_text?: string | null;
          size_bytes?: number;
          width?: number | null;
          height?: number | null;
          is_active?: boolean;
          created_by?: string | null;
        }>;
        Update: Update<{
          locale: "en" | "ar" | null;
          alt_text: string | null;
          width: number | null;
          height: number | null;
          is_active: boolean;
          updated_at: string;
        }>;
      };
      pages: {
        Row: Row<{
          id: string;
          organization_id: string;
          page_key: string;
          locale: "en" | "ar";
          slug: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        }>;
        Insert: Insert<{
          id?: string;
          organization_id: string;
          page_key: string;
          locale: "en" | "ar";
          slug: string;
          is_active?: boolean;
        }>;
        Update: Update<{
          slug: string;
          is_active: boolean;
          updated_at: string;
        }>;
      };
      hero_sections: {
        Row: Row<{
          id: string;
          organization_id: string;
          locale: "en" | "ar";
          eyebrow: string;
          title: string;
          description: string;
          primary_cta_label: string;
          primary_cta_href: string;
          secondary_cta_label: string;
          secondary_cta_href: string;
          trust_points: Json;
          hero_asset_id: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        }>;
        Insert: Insert<{
          id?: string;
          organization_id: string;
          locale: "en" | "ar";
          eyebrow: string;
          title: string;
          description: string;
          primary_cta_label: string;
          primary_cta_href?: string;
          secondary_cta_label: string;
          secondary_cta_href?: string;
          trust_points?: Json;
          hero_asset_id?: string | null;
          is_active?: boolean;
        }>;
        Update: Update<{
          eyebrow: string;
          title: string;
          description: string;
          primary_cta_label: string;
          primary_cta_href: string;
          secondary_cta_label: string;
          secondary_cta_href: string;
          trust_points: Json;
          hero_asset_id: string | null;
          is_active: boolean;
          updated_at: string;
        }>;
      };
      services: {
        Row: Row<{
          id: string;
          organization_id: string;
          locale: "en" | "ar";
          slug: string;
          title: string;
          description: string;
          icon_key: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        }>;
        Insert: Insert<{
          id?: string;
          organization_id: string;
          locale: "en" | "ar";
          slug: string;
          title: string;
          description: string;
          icon_key?: string | null;
          sort_order?: number;
          is_active?: boolean;
        }>;
        Update: Update<{
          slug: string;
          title: string;
          description: string;
          icon_key: string | null;
          sort_order: number;
          is_active: boolean;
          updated_at: string;
        }>;
      };
      about_sections: {
        Row: Row<{
          id: string;
          organization_id: string;
          locale: "en" | "ar";
          eyebrow: string;
          title: string;
          summary: string;
          years_experience: number | null;
          languages: string[];
          certifications_summary: string | null;
          profile_asset_id: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        }>;
        Insert: Insert<{
          id?: string;
          organization_id: string;
          locale: "en" | "ar";
          eyebrow: string;
          title: string;
          summary: string;
          years_experience?: number | null;
          languages?: string[];
          certifications_summary?: string | null;
          profile_asset_id?: string | null;
          is_active?: boolean;
        }>;
        Update: Update<{
          eyebrow: string;
          title: string;
          summary: string;
          years_experience: number | null;
          languages: string[];
          certifications_summary: string | null;
          profile_asset_id: string | null;
          is_active: boolean;
          updated_at: string;
        }>;
      };
      credentials: {
        Row: Row<{
          id: string;
          organization_id: string;
          locale: "en" | "ar";
          title: string;
          description: string;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        }>;
        Insert: Insert<{
          id?: string;
          organization_id: string;
          locale: "en" | "ar";
          title: string;
          description: string;
          sort_order?: number;
          is_active?: boolean;
        }>;
        Update: Update<{
          title: string;
          description: string;
          sort_order: number;
          is_active: boolean;
          updated_at: string;
        }>;
      };
      statistics: {
        Row: Row<{
          id: string;
          organization_id: string;
          locale: "en" | "ar";
          label: string;
          value: string;
          description: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        }>;
        Insert: Insert<{
          id?: string;
          organization_id: string;
          locale: "en" | "ar";
          label: string;
          value: string;
          description?: string | null;
          sort_order?: number;
          is_active?: boolean;
        }>;
        Update: Update<{
          label: string;
          value: string;
          description: string | null;
          sort_order: number;
          is_active: boolean;
          updated_at: string;
        }>;
      };
      testimonials: {
        Row: Row<{
          id: string;
          organization_id: string;
          locale: "en" | "ar";
          author_name: string;
          author_role: string | null;
          quote: string;
          rating: number | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        }>;
        Insert: Insert<{
          id?: string;
          organization_id: string;
          locale: "en" | "ar";
          author_name: string;
          author_role?: string | null;
          quote: string;
          rating?: number | null;
          sort_order?: number;
          is_active?: boolean;
        }>;
        Update: Update<{
          author_name: string;
          author_role: string | null;
          quote: string;
          rating: number | null;
          sort_order: number;
          is_active: boolean;
          updated_at: string;
        }>;
      };
      faqs: {
        Row: Row<{
          id: string;
          organization_id: string;
          locale: "en" | "ar";
          question: string;
          answer: string;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        }>;
        Insert: Insert<{
          id?: string;
          organization_id: string;
          locale: "en" | "ar";
          question: string;
          answer: string;
          sort_order?: number;
          is_active?: boolean;
        }>;
        Update: Update<{
          question: string;
          answer: string;
          sort_order: number;
          is_active: boolean;
          updated_at: string;
        }>;
      };
      contact_info: {
        Row: Row<{
          id: string;
          organization_id: string;
          locale: "en" | "ar";
          eyebrow: string | null;
          title: string | null;
          description: string | null;
          phone: string | null;
          whatsapp: string | null;
          email: string | null;
          address: string | null;
          map_embed_url: string | null;
          response_time_label: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        }>;
        Insert: Insert<{
          id?: string;
          organization_id: string;
          locale: "en" | "ar";
          eyebrow?: string | null;
          title?: string | null;
          description?: string | null;
          phone?: string | null;
          whatsapp?: string | null;
          email?: string | null;
          address?: string | null;
          map_embed_url?: string | null;
          response_time_label?: string | null;
          is_active?: boolean;
        }>;
        Update: Update<{
          eyebrow: string | null;
          title: string | null;
          description: string | null;
          phone: string | null;
          whatsapp: string | null;
          email: string | null;
          address: string | null;
          map_embed_url: string | null;
          response_time_label: string | null;
          is_active: boolean;
          updated_at: string;
        }>;
      };
      social_links: {
        Row: Row<{
          id: string;
          organization_id: string;
          platform: string;
          label: string | null;
          url: string;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        }>;
        Insert: Insert<{
          id?: string;
          organization_id: string;
          platform: string;
          label?: string | null;
          url: string;
          sort_order?: number;
          is_active?: boolean;
        }>;
        Update: Update<{
          platform: string;
          label: string | null;
          url: string;
          sort_order: number;
          is_active: boolean;
          updated_at: string;
        }>;
      };
      seo_settings: {
        Row: Row<{
          id: string;
          organization_id: string;
          locale: "en" | "ar";
          page_key: string;
          meta_title: string;
          meta_description: string;
          og_title: string | null;
          og_description: string | null;
          og_image_asset_id: string | null;
          canonical_path: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        }>;
        Insert: Insert<{
          id?: string;
          organization_id: string;
          locale: "en" | "ar";
          page_key: string;
          meta_title: string;
          meta_description: string;
          og_title?: string | null;
          og_description?: string | null;
          og_image_asset_id?: string | null;
          canonical_path?: string | null;
          is_active?: boolean;
        }>;
        Update: Update<{
          meta_title: string;
          meta_description: string;
          og_title: string | null;
          og_description: string | null;
          og_image_asset_id: string | null;
          canonical_path: string | null;
          is_active: boolean;
          updated_at: string;
        }>;
      };
      site_settings: {
        Row: Row<{
          id: string;
          organization_id: string;
          site_name: string;
          tagline: string | null;
          primary_phone: string | null;
          primary_email: string | null;
          office_address: string | null;
          logo_asset_id: string | null;
          favicon_asset_id: string | null;
          created_at: string;
          updated_at: string;
        }>;
        Insert: Insert<{
          id?: string;
          organization_id: string;
          site_name: string;
          tagline?: string | null;
          primary_phone?: string | null;
          primary_email?: string | null;
          office_address?: string | null;
          logo_asset_id?: string | null;
          favicon_asset_id?: string | null;
        }>;
        Update: Update<{
          site_name: string;
          tagline: string | null;
          primary_phone: string | null;
          primary_email: string | null;
          office_address: string | null;
          logo_asset_id: string | null;
          favicon_asset_id: string | null;
          updated_at: string;
        }>;
      };
      legal_pages: {
        Row: Row<{
          id: string;
          organization_id: string;
          locale: "en" | "ar";
          page_type: "privacy" | "terms";
          title: string;
          body: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        }>;
        Insert: Insert<{
          id?: string;
          organization_id: string;
          locale: "en" | "ar";
          page_type: "privacy" | "terms";
          title: string;
          body: string;
          is_active?: boolean;
        }>;
        Update: Update<{
          title: string;
          body: string;
          is_active: boolean;
          updated_at: string;
        }>;
      };
      lead_submissions: {
        Row: Row<{
          id: string;
          organization_id: string;
          locale: "en" | "ar";
          full_name: string;
          email: string;
          phone: string | null;
          message: string;
          source: string;
          status: "new" | "contacted" | "closed";
          notes: string | null;
          created_at: string;
          updated_at: string;
        }>;
        Insert: Insert<{
          id?: string;
          organization_id: string;
          locale: "en" | "ar";
          full_name: string;
          email: string;
          phone?: string | null;
          message: string;
          source?: string;
          status?: "new" | "contacted" | "closed";
          notes?: string | null;
        }>;
        Update: Update<{
          email: string;
          phone: string | null;
          message: string;
          source: string;
          status: "new" | "contacted" | "closed";
          notes: string | null;
          updated_at: string;
        }>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_any_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      current_user_has_org_role: {
        Args: {
          target_organization: string;
          allowed_roles: string[];
        };
        Returns: boolean;
      };
      current_user_same_org: {
        Args: {
          target_organization: string;
        };
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
