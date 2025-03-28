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
          start_date: string
          end_date: string
          auto_renew: boolean
          price: number
          currency?: string
          created_at: string
          order_id?: string
          payment_id?: string
          status?: string
          plan_name?: string
          product_name?: string
          product_image?: string
          used_storage?: number
          total_storage?: number
        }
        Insert: {
          id?: string
          user_id: string
          product_id?: string
          bundle_id?: string
          plan_id: string
          start_date: string
          end_date: string
          auto_renew: boolean
          price: number
          currency?: string
          created_at?: string
          order_id?: string
          payment_id?: string
          status?: string
          plan_name?: string
          product_name?: string
          product_image?: string
          used_storage?: number
          total_storage?: number
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          bundle_id?: string
          plan_id?: string
          start_date?: string
          end_date?: string
          auto_renew?: boolean
          price?: number
          currency?: string
          created_at?: string
          order_id?: string
          payment_id?: string
          status?: string
          plan_name?: string
          product_name?: string
          product_image?: string
          used_storage?: number
          total_storage?: number
        }
      }
      purchases: {
        Row: {
          id: string
          user_id: string
          product_id?: string
          bundle_id?: string
          plan_id: string
          date: string
          amount: number
          currency?: string
          status: string
          created_at: string
          order_id?: string
          payment_id?: string
          description?: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id?: string
          bundle_id?: string
          plan_id: string
          date: string
          amount: number
          currency?: string
          status: string
          created_at?: string
          order_id?: string
          payment_id?: string
          description?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          bundle_id?: string
          plan_id?: string
          date?: string
          amount?: number
          currency?: string
          status?: string
          created_at?: string
          order_id?: string
          payment_id?: string
          description?: string
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
