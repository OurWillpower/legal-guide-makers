export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          created_at: string
          event_name: string
          id: string
          path: string | null
          properties: Json
          referrer: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          event_name: string
          id?: string
          path?: string | null
          properties?: Json
          referrer?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          event_name?: string
          id?: string
          path?: string | null
          properties?: Json
          referrer?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      booking_events: {
        Row: {
          actor: string | null
          booking_id: string
          created_at: string
          event_type: string
          id: string
          meta: Json
        }
        Insert: {
          actor?: string | null
          booking_id: string
          created_at?: string
          event_type: string
          id?: string
          meta?: Json
        }
        Update: {
          actor?: string | null
          booking_id?: string
          created_at?: string
          event_type?: string
          id?: string
          meta?: Json
        }
        Relationships: [
          {
            foreignKeyName: "booking_events_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_settings: {
        Row: {
          blocked_dates: Json
          buffer_days: number
          consultation_duration_minutes: number
          id: string
          time_slots: Json
          timezone: string
          updated_at: string
        }
        Insert: {
          blocked_dates?: Json
          buffer_days?: number
          consultation_duration_minutes?: number
          id?: string
          time_slots?: Json
          timezone?: string
          updated_at?: string
        }
        Update: {
          blocked_dates?: Json
          buffer_days?: number
          consultation_duration_minutes?: number
          id?: string
          time_slots?: Json
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          cancellation_reason: string | null
          cancelled_at: string | null
          company: string | null
          created_at: string
          email: string
          google_event_id: string | null
          id: string
          manage_token: string
          message: string | null
          name: string
          payment_amount: number
          payment_currency: string
          payment_reference: string | null
          payment_status: string
          phone: string | null
          preferred_date: string
          preferred_time: string
          reminder_24h_sent_at: string | null
          reminder_2h_sent_at: string | null
          reschedule_count: number
          service: string
          status: string
          user_id: string | null
          whatsapp_24h_sent_at: string | null
          whatsapp_2h_sent_at: string | null
          whatsapp_opt_in: boolean
        }
        Insert: {
          cancellation_reason?: string | null
          cancelled_at?: string | null
          company?: string | null
          created_at?: string
          email: string
          google_event_id?: string | null
          id?: string
          manage_token?: string
          message?: string | null
          name: string
          payment_amount?: number
          payment_currency?: string
          payment_reference?: string | null
          payment_status?: string
          phone?: string | null
          preferred_date: string
          preferred_time: string
          reminder_24h_sent_at?: string | null
          reminder_2h_sent_at?: string | null
          reschedule_count?: number
          service: string
          status?: string
          user_id?: string | null
          whatsapp_24h_sent_at?: string | null
          whatsapp_2h_sent_at?: string | null
          whatsapp_opt_in?: boolean
        }
        Update: {
          cancellation_reason?: string | null
          cancelled_at?: string | null
          company?: string | null
          created_at?: string
          email?: string
          google_event_id?: string | null
          id?: string
          manage_token?: string
          message?: string | null
          name?: string
          payment_amount?: number
          payment_currency?: string
          payment_reference?: string | null
          payment_status?: string
          phone?: string | null
          preferred_date?: string
          preferred_time?: string
          reminder_24h_sent_at?: string | null
          reminder_2h_sent_at?: string | null
          reschedule_count?: number
          service?: string
          status?: string
          user_id?: string | null
          whatsapp_24h_sent_at?: string | null
          whatsapp_2h_sent_at?: string | null
          whatsapp_opt_in?: boolean
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          created_at: string
          description: string | null
          html: string
          id: string
          subject: string
          template_key: string
          text: string
          updated_at: string
          variables: string[]
        }
        Insert: {
          created_at?: string
          description?: string | null
          html: string
          id?: string
          subject: string
          template_key: string
          text?: string
          updated_at?: string
          variables?: string[]
        }
        Update: {
          created_at?: string
          description?: string | null
          html?: string
          id?: string
          subject?: string
          template_key?: string
          text?: string
          updated_at?: string
          variables?: string[]
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          created_at: string
          id: string
          published: boolean
          question: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          published?: boolean
          question: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          published?: boolean
          question?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      internal_secrets: {
        Row: {
          created_at: string
          name: string
          value: string
        }
        Insert: {
          created_at?: string
          name: string
          value: string
        }
        Update: {
          created_at?: string
          name?: string
          value?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          active: boolean
          created_at: string
          description: string
          icon: string
          id: string
          slug: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description: string
          icon?: string
          id?: string
          slug: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string
          icon?: string
          id?: string
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          author_name: string
          author_role: string | null
          avatar_url: string | null
          created_at: string
          id: string
          published: boolean
          quote: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          author_name: string
          author_role?: string | null
          avatar_url?: string | null
          created_at?: string
          id?: string
          published?: boolean
          quote: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          author_name?: string
          author_role?: string | null
          avatar_url?: string | null
          created_at?: string
          id?: string
          published?: boolean
          quote?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      webinar_registrations: {
        Row: {
          challenge: string | null
          company: string | null
          consent: boolean
          created_at: string
          designation: string | null
          email: string
          full_name: string
          id: string
          mobile: string | null
          reported_at: string | null
          updated_at: string
          webinar_slug: string
          website: string | null
        }
        Insert: {
          challenge?: string | null
          company?: string | null
          consent?: boolean
          created_at?: string
          designation?: string | null
          email: string
          full_name: string
          id?: string
          mobile?: string | null
          reported_at?: string | null
          updated_at?: string
          webinar_slug?: string
          website?: string | null
        }
        Update: {
          challenge?: string | null
          company?: string | null
          consent?: boolean
          created_at?: string
          designation?: string | null
          email?: string
          full_name?: string
          id?: string
          mobile?: string | null
          reported_at?: string | null
          updated_at?: string
          webinar_slug?: string
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
