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
      books: {
        Row: {
          created_at: string
          deleted_at: string | null
          firestore_id: string | null
          id: number
          title: string
          updated_at: string | null
          uuid: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          firestore_id?: string | null
          id?: number
          title: string
          updated_at?: string | null
          uuid?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          firestore_id?: string | null
          id?: number
          title?: string
          updated_at?: string | null
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
            foreignKeyName: "public_books_attributes_attribute_id_fkey"
            columns: ["attribute_id"]
            isOneToOne: false
            referencedRelation: "books_attributes_view"
            referencedColumns: ["attribute_id"]
          },
          {
            foreignKeyName: "public_books_attributes_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "public_books_attributes_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books_contents_view"
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
          updated_at: string | null
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
          updated_at?: string | null
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
          updated_at?: string | null
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
            foreignKeyName: "public_contents_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books_contents_view"
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
    }
    Views: {
      books_attributes_view: {
        Row: {
          attribute_id: string | null
          book_id: string | null
          key: string | null
          value: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_books_attributes_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "public_books_attributes_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books_contents_view"
            referencedColumns: ["uuid"]
          },
        ]
      }
      books_contents_view: {
        Row: {
          contents: number | null
          id: number | null
          title: string | null
          uuid: string | null
        }
        Relationships: []
      }
      contents_link: {
        Row: {
          book_id: string | null
          created_at: string | null
          deleted_at: string | null
          firestore_id: string | null
          id: number | null
          link: Json | null
          link_id: string | null
          title: string | null
          updated_at: string | null
          uuid: string | null
        }
        Insert: {
          book_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          firestore_id?: string | null
          id?: number | null
          link?: never
          link_id?: string | null
          title?: string | null
          updated_at?: string | null
          uuid?: string | null
        }
        Update: {
          book_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          firestore_id?: string | null
          id?: number | null
          link?: never
          link_id?: string | null
          title?: string | null
          updated_at?: string | null
          uuid?: string | null
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
            foreignKeyName: "public_contents_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books_contents_view"
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

