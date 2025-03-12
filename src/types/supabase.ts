export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      business_hours: {
        Row: {
          business_id: string
          close_time: string | null
          closed: boolean | null
          created_at: string | null
          day: string
          id: string
          open_time: string | null
          rest_end: string | null
          rest_start: string | null
          updated_at: string | null
        }
        Insert: {
          business_id: string
          close_time?: string | null
          closed?: boolean | null
          created_at?: string | null
          day: string
          id?: string
          open_time?: string | null
          rest_end?: string | null
          rest_start?: string | null
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          close_time?: string | null
          closed?: boolean | null
          created_at?: string | null
          day?: string
          id?: string
          open_time?: string | null
          rest_end?: string | null
          rest_start?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_hours_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      business_payments: {
        Row: {
          auto_invoice: boolean | null
          auto_receipt: boolean | null
          business_id: string
          created_at: string | null
          id: string
          in_person_card: boolean | null
          in_person_cash: boolean | null
          in_person_qr: boolean | null
          invoice_prefix: string | null
          stripe_account_id: string | null
          stripe_enabled: boolean | null
          tax_id: string | null
          tax_name: string | null
          tax_rate: number | null
          updated_at: string | null
        }
        Insert: {
          auto_invoice?: boolean | null
          auto_receipt?: boolean | null
          business_id: string
          created_at?: string | null
          id?: string
          in_person_card?: boolean | null
          in_person_cash?: boolean | null
          in_person_qr?: boolean | null
          invoice_prefix?: string | null
          stripe_account_id?: string | null
          stripe_enabled?: boolean | null
          tax_id?: string | null
          tax_name?: string | null
          tax_rate?: number | null
          updated_at?: string | null
        }
        Update: {
          auto_invoice?: boolean | null
          auto_receipt?: boolean | null
          business_id?: string
          created_at?: string | null
          id?: string
          in_person_card?: boolean | null
          in_person_cash?: boolean | null
          in_person_qr?: boolean | null
          invoice_prefix?: string | null
          stripe_account_id?: string | null
          stripe_enabled?: boolean | null
          tax_id?: string | null
          tax_name?: string | null
          tax_rate?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_payments_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      business_profiles: {
        Row: {
          banner_url: string | null
          booking_page_url: string | null
          business_description: string | null
          business_logo: string | null
          business_name: string
          contact_number: string | null
          country: string | null
          created_at: string | null
          currency: string | null
          custom_domain: string | null
          date_format: string | null
          email: string
          id: string
          language: string | null
          logo_url: string | null
          other_links: Json | null
          owner_id: string
          page_description: string | null
          page_title: string | null
          phone_number: string | null
          price_format: string | null
          show_testimonials: boolean | null
          social_links: Json | null
          theme_color: string | null
          time_format: string | null
          timezone: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          banner_url?: string | null
          booking_page_url?: string | null
          business_description?: string | null
          business_logo?: string | null
          business_name: string
          contact_number?: string | null
          country?: string | null
          created_at?: string | null
          currency?: string | null
          custom_domain?: string | null
          date_format?: string | null
          email: string
          id?: string
          language?: string | null
          logo_url?: string | null
          other_links?: Json | null
          owner_id: string
          page_description?: string | null
          page_title?: string | null
          phone_number?: string | null
          price_format?: string | null
          show_testimonials?: boolean | null
          social_links?: Json | null
          theme_color?: string | null
          time_format?: string | null
          timezone?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          banner_url?: string | null
          booking_page_url?: string | null
          business_description?: string | null
          business_logo?: string | null
          business_name?: string
          contact_number?: string | null
          country?: string | null
          created_at?: string | null
          currency?: string | null
          custom_domain?: string | null
          date_format?: string | null
          email?: string
          id?: string
          language?: string | null
          logo_url?: string | null
          other_links?: Json | null
          owner_id?: string
          page_description?: string | null
          page_title?: string | null
          phone_number?: string | null
          price_format?: string | null
          show_testimonials?: boolean | null
          social_links?: Json | null
          theme_color?: string | null
          time_format?: string | null
          timezone?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          active: boolean | null
          business_id: string | null
          category: string | null
          created_at: string | null
          description: string | null
          duration: number | null
          id: string
          name: string
          price: number | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          business_id?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          name: string
          price?: number | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          business_id?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          name?: string
          price?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          amount: number | null
          cancel_at_period_end: boolean | null
          canceled_at: number | null
          created_at: string
          currency: string | null
          current_period_end: number | null
          current_period_start: number | null
          custom_field_data: Json | null
          customer_cancellation_comment: string | null
          customer_cancellation_reason: string | null
          customer_id: string | null
          ended_at: number | null
          ends_at: number | null
          id: string
          interval: string | null
          metadata: Json | null
          price_id: string | null
          started_at: number | null
          status: string | null
          stripe_id: string | null
          stripe_price_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          cancel_at_period_end?: boolean | null
          canceled_at?: number | null
          created_at?: string
          currency?: string | null
          current_period_end?: number | null
          current_period_start?: number | null
          custom_field_data?: Json | null
          customer_cancellation_comment?: string | null
          customer_cancellation_reason?: string | null
          customer_id?: string | null
          ended_at?: number | null
          ends_at?: number | null
          id?: string
          interval?: string | null
          metadata?: Json | null
          price_id?: string | null
          started_at?: number | null
          status?: string | null
          stripe_id?: string | null
          stripe_price_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          cancel_at_period_end?: boolean | null
          canceled_at?: number | null
          created_at?: string
          currency?: string | null
          current_period_end?: number | null
          current_period_start?: number | null
          custom_field_data?: Json | null
          customer_cancellation_comment?: string | null
          customer_cancellation_reason?: string | null
          customer_id?: string | null
          ended_at?: number | null
          ends_at?: number | null
          id?: string
          interval?: string | null
          metadata?: Json | null
          price_id?: string | null
          started_at?: number | null
          status?: string | null
          stripe_id?: string | null
          stripe_price_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      testimonials: {
        Row: {
          approved: boolean | null
          business_id: string | null
          client_email: string | null
          client_name: string
          content: string
          created_at: string | null
          id: string
          rating: number | null
          updated_at: string | null
        }
        Insert: {
          approved?: boolean | null
          business_id?: string | null
          client_email?: string | null
          client_name: string
          content: string
          created_at?: string | null
          id?: string
          rating?: number | null
          updated_at?: string | null
        }
        Update: {
          approved?: boolean | null
          business_id?: string | null
          client_email?: string | null
          client_name?: string
          content?: string
          created_at?: string | null
          id?: string
          rating?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          credits: string | null
          email: string | null
          full_name: string | null
          id: string
          image: string | null
          name: string | null
          subscription: string | null
          token_identifier: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          credits?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          image?: string | null
          name?: string | null
          subscription?: string | null
          token_identifier: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          credits?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          image?: string | null
          name?: string | null
          subscription?: string | null
          token_identifier?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          created_at: string
          data: Json | null
          event_type: string
          id: string
          modified_at: string
          stripe_event_id: string | null
          type: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          event_type: string
          id?: string
          modified_at?: string
          stripe_event_id?: string | null
          type: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          event_type?: string
          id?: string
          modified_at?: string
          stripe_event_id?: string | null
          type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
