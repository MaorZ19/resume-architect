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
      job_cache: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          parsed_content: Json
          url: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          parsed_content: Json
          url: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          parsed_content?: Json
          url?: string
        }
        Relationships: []
      }
      optimizations: {
        Row: {
          analysis: Json
          ats_score: number | null
          company_name: string | null
          created_at: string | null
          exported_files: Json | null
          id: string
          job_description: Json
          job_title: string | null
          job_url: string | null
          optimized_resume: Json
          original_resume: Json
          resume_id: string | null
          session_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          analysis: Json
          ats_score?: number | null
          company_name?: string | null
          created_at?: string | null
          exported_files?: Json | null
          id?: string
          job_description: Json
          job_title?: string | null
          job_url?: string | null
          optimized_resume: Json
          original_resume: Json
          resume_id?: string | null
          session_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          analysis?: Json
          ats_score?: number | null
          company_name?: string | null
          created_at?: string | null
          exported_files?: Json | null
          id?: string
          job_description?: Json
          job_title?: string | null
          job_url?: string | null
          optimized_resume?: Json
          original_resume?: Json
          resume_id?: string | null
          session_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      resumes: {
        Row: {
          created_at: string | null
          id: string
          original_file_url: string | null
          parsed_content: Json
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          original_file_url?: string | null
          parsed_content: Json
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          original_file_url?: string | null
          parsed_content?: Json
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          analysis_data: Json | null
          answers: Json | null
          created_at: string | null
          current_step: number | null
          expires_at: string | null
          id: string
          job_description: Json | null
          resume_data: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          analysis_data?: Json | null
          answers?: Json | null
          created_at?: string | null
          current_step?: number | null
          expires_at?: string | null
          id?: string
          job_description?: Json | null
          resume_data?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          analysis_data?: Json | null
          answers?: Json | null
          created_at?: string | null
          current_step?: number | null
          expires_at?: string | null
          id?: string
          job_description?: Json | null
          resume_data?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
          updated_at?: string | null
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  TableName extends keyof DefaultSchema["Tables"]
> = DefaultSchema["Tables"][TableName]["Row"]

export type TablesInsert<
  TableName extends keyof DefaultSchema["Tables"]
> = DefaultSchema["Tables"][TableName]["Insert"]

export type TablesUpdate<
  TableName extends keyof DefaultSchema["Tables"]
> = DefaultSchema["Tables"][TableName]["Update"]
