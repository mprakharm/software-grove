
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
      products: {
        Row: {
          id: string
          name: string
          description: string
          category: string
          logo: string
          price: number
          currency?: string
          featured_benefit?: string
          benefits?: string[]
          integration?: string[]
          popularity?: number
          rating?: number
          reviews?: number
          users?: number
          in_stock: boolean
          is_hot?: boolean
          banner?: string
          created_at: string
          color?: string
          vendor?: string
          discount?: string
          image?: string
          reviewCount?: number
        }
        Insert: {
          id?: string
          name: string
          description: string
          category: string
          logo: string
          price: number
          currency?: string
          featured_benefit?: string
          benefits?: string[]
          integration?: string[]
          popularity?: number
          rating?: number
          reviews?: number
          users?: number
          in_stock: boolean
          is_hot?: boolean
          banner?: string
          created_at?: string
          color?: string
          vendor?: string
          discount?: string
          image?: string
          reviewCount?: number
        }
        Update: {
          id?: string
          name?: string
          description?: string
          category?: string
          logo?: string
          price?: number
          currency?: string
          featured_benefit?: string
          benefits?: string[]
          integration?: string[]
          popularity?: number
          rating?: number
          reviews?: number
          users?: number
          in_stock?: boolean
          is_hot?: boolean
          banner?: string
          created_at?: string
          color?: string
          vendor?: string
          discount?: string
          image?: string
          reviewCount?: number
        }
      }
      bundles: {
        Row: {
          id: string
          name: string
          description: string
          category: string
          target_user: string
          products: Json
          min_products?: number
          max_products?: number
          required_product_ids?: string[]
          image: string
          savings: number
          is_customizable: boolean
          is_limited_time?: boolean
          expiry_date?: string
          color: string
          purchases?: number
          created_at: string
          currency?: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          category: string
          target_user: string
          products: Json
          min_products?: number
          max_products?: number
          required_product_ids?: string[]
          image: string
          savings: number
          is_customizable: boolean
          is_limited_time?: boolean
          expiry_date?: string
          color: string
          purchases?: number
          created_at?: string
          currency?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          category?: string
          target_user?: string
          products?: Json
          min_products?: number
          max_products?: number
          required_product_ids?: string[]
          image?: string
          savings?: number
          is_customizable?: boolean
          is_limited_time?: boolean
          expiry_date?: string
          color?: string
          purchases?: number
          created_at?: string
          currency?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          product_id?: string
          bundle_id?: string
          plan_id: string
          plan_name: string
          start_date: string
          end_date: string
          auto_renew: boolean
          price: number
          currency?: string
          status: string  // 'active', 'expired', 'cancelled'
          cancellation_date?: string
          cancellation_reason?: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id?: string
          bundle_id?: string
          plan_id: string
          plan_name: string
          start_date: string
          end_date: string
          auto_renew: boolean
          price: number
          currency?: string
          status: string
          cancellation_date?: string
          cancellation_reason?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          bundle_id?: string
          plan_id?: string
          plan_name?: string
          start_date?: string
          end_date?: string
          auto_renew?: boolean
          price?: number
          currency?: string
          status?: string
          cancellation_date?: string
          cancellation_reason?: string
          created_at?: string
        }
      }
      purchases: {
        Row: {
          id: string
          user_id: string
          product_id?: string
          bundle_id?: string
          plan_id: string
          plan_name: string
          date: string
          amount: number
          currency?: string
          status: string
          payment_method: string
          transaction_id: string
          invoice_url?: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id?: string
          bundle_id?: string
          plan_id: string
          plan_name: string
          date: string
          amount: number
          currency?: string
          status: string
          payment_method: string
          transaction_id: string
          invoice_url?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          bundle_id?: string
          plan_id?: string
          plan_name?: string
          date?: string
          amount?: number
          currency?: string
          status?: string
          payment_method?: string
          transaction_id?: string
          invoice_url?: string
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
