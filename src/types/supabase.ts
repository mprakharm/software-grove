
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      bundle_products: {
        Row: {
          id: string
          bundle_id: string
          product_id: string
          individual_price: number
          bundle_price: number
          created_at: string
        }
        Insert: {
          id?: string
          bundle_id: string
          product_id: string
          individual_price: number
          bundle_price: number
          created_at?: string
        }
        Update: {
          id?: string
          bundle_id?: string
          product_id?: string
          individual_price?: number
          bundle_price?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bundle_products_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "bundles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bundle_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      bundles: {
        Row: {
          id: string
          name: string
          description: string
          category: string
          target_user: string
          image: string
          savings: number
          is_customizable: boolean
          is_limited_time: boolean
          expiry_date: string | null
          color: string
          purchases: number
          min_products: number | null
          max_products: number | null
          required_product_ids: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          category: string
          target_user: string
          image: string
          savings: number
          is_customizable: boolean
          is_limited_time?: boolean
          expiry_date?: string | null
          color: string
          purchases?: number
          min_products?: number | null
          max_products?: number | null
          required_product_ids?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          category?: string
          target_user?: string
          image?: string
          savings?: number
          is_customizable?: boolean
          is_limited_time?: boolean
          expiry_date?: string | null
          color?: string
          purchases?: number
          min_products?: number | null
          max_products?: number | null
          required_product_ids?: string[] | null
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string
          category: string
          logo: string
          price: number
          featured_benefit: string | null
          benefits: string[] | null
          integration: string[] | null
          popularity: number | null
          rating: number | null
          reviews: number | null
          users: number | null
          in_stock: boolean
          is_hot: boolean | null
          banner: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          category: string
          logo: string
          price: number
          featured_benefit?: string | null
          benefits?: string[] | null
          integration?: string[] | null
          popularity?: number | null
          rating?: number | null
          reviews?: number | null
          users?: number | null
          in_stock: boolean
          is_hot?: boolean | null
          banner?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          category?: string
          logo?: string
          price?: number
          featured_benefit?: string | null
          benefits?: string[] | null
          integration?: string[] | null
          popularity?: number | null
          rating?: number | null
          reviews?: number | null
          users?: number | null
          in_stock?: boolean
          is_hot?: boolean | null
          banner?: string | null
          created_at?: string
        }
      }
      purchases: {
        Row: {
          id: string
          user_id: string
          product_id: string | null
          bundle_id: string | null
          plan_id: string
          date: string
          amount: number
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id?: string | null
          bundle_id?: string | null
          plan_id: string
          date: string
          amount: number
          status: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string | null
          bundle_id?: string | null
          plan_id?: string
          date?: string
          amount?: number
          status?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchases_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "bundles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchases_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchases_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          product_id: string | null
          bundle_id: string | null
          plan_id: string
          start_date: string
          end_date: string
          auto_renew: boolean
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id?: string | null
          bundle_id?: string | null
          plan_id: string
          start_date: string
          end_date: string
          auto_renew: boolean
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string | null
          bundle_id?: string | null
          plan_id?: string
          start_date?: string
          end_date?: string
          auto_renew?: boolean
          price?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "bundles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          id: string
          email: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          created_at?: string
        }
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
  }
}
