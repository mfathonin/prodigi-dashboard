export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      answer_sheets: {
        Row: {
          answers: Json
          book_id: string
          counts: number
          created_at: string
          id: number
          n_options: number[]
          points: number[]
          updated_at: string
          uuid: string
        }
        Insert: {
          answers: Json
          book_id: string
          counts: number
          created_at?: string
          id?: number
          n_options: number[]
          points: number[]
          updated_at?: string
          uuid?: string
        }
        Update: {
          answers?: Json
          book_id?: string
          counts?: number
          created_at?: string
          id?: number
          n_options?: number[]
          points?: number[]
          updated_at?: string
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "answer_sheets_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["uuid"]
          },
        ]
      }
      attributes: {
        Row: {
          id: number
          key: string
          uuid: string
          value: string
        }
        Insert: {
          id?: number
          key: string
          uuid?: string
          value: string
        }
        Update: {
          id?: number
          key?: string
          uuid?: string
          value?: string
        }
        Relationships: []
      }
      banner: {
        Row: {
          id: number
          image: string
          url: string
          uuid: string
        }
        Insert: {
          id?: number
          image: string
          url: string
          uuid?: string
        }
        Update: {
          id?: number
          image?: string
          url?: string
          uuid?: string
        }
        Relationships: []
      }
      books: {
        Row: {
          created_at: string
          deleted_at: string | null
          firestore_id: string | null
          id: number
          title: string
          updated_at: string
          uuid: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          firestore_id?: string | null
          id?: number
          title: string
          updated_at?: string
          uuid?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          firestore_id?: string | null
          id?: number
          title?: string
          updated_at?: string
          uuid?: string
        }
        Relationships: []
      }
      books_attributes: {
        Row: {
          attribute_id: string
          book_id: string
          id: number
        }
        Insert: {
          attribute_id: string
          book_id: string
          id?: number
        }
        Update: {
          attribute_id?: string
          book_id?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_books_attributes_attribute_id_fkey"
            columns: ["attribute_id"]
            isOneToOne: false
            referencedRelation: "attributes"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "public_books_attributes_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["uuid"]
          },
        ]
      }
      contents: {
        Row: {
          book_id: string
          created_at: string
          deleted_at: string | null
          firestore_id: string | null
          id: number
          link_id: string
          title: string
          type: Database["public"]["Enums"]["content_type"]
          updated_at: string
          uuid: string
        }
        Insert: {
          book_id: string
          created_at?: string
          deleted_at?: string | null
          firestore_id?: string | null
          id?: number
          link_id: string
          title: string
          type?: Database["public"]["Enums"]["content_type"]
          updated_at?: string
          uuid?: string
        }
        Update: {
          book_id?: string
          created_at?: string
          deleted_at?: string | null
          firestore_id?: string | null
          id?: number
          link_id?: string
          title?: string
          type?: Database["public"]["Enums"]["content_type"]
          updated_at?: string
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_contents_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "public_contents_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "link"
            referencedColumns: ["uuid"]
          },
        ]
      }
      link: {
        Row: {
          id: number
          path: string
          target_url: string
          uuid: string
        }
        Insert: {
          id?: number
          path: string
          target_url: string
          uuid?: string
        }
        Update: {
          id?: number
          path?: string
          target_url?: string
          uuid?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: string
        }
        Insert: {
          created_at?: string | null
          id: string
          role: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      jsonb_to_int_array_replace_nested: {
        Args: { data: Json }
        Returns: number[]
      }
    }
    Enums: {
      content_type: "content" | "answer_sheet" | "exercise"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      content_type: ["content", "answer_sheet", "exercise"],
    },
  },
} as const

