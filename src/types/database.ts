// Supabase 스키마와 동기화된 타입. supabase gen types로 자동 생성하는 것을 권장하지만,
// 보일러플레이트 1차 빌드는 수동 정의로 시작합니다. 스키마 변경 시 함께 업데이트하세요.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type OrderStatus = "pending" | "paid" | "failed";
export type CalendarKind = "solar" | "lunar";
export type GenderKind = "male" | "female";
export type PaymentMethod = "toss" | "bank_transfer" | "free";

// 확장형 리딩 서비스 구분자. 현재 구현: saju(기존) · tarot.
// 향후 oracle / runes / astrology / mbti / physiognomy / palmistry 값만 추가하면 됨.
export type ServiceType = "saju" | "tarot";
// readings.status — 드로우/생성/검수/발행 진행 상태
export type ReadingStatus =
  | "drawn"
  | "generating"
  | "draft"
  | "published"
  | "failed";

type ProfileRow = {
  id: string;
  email: string;
  display_name: string | null;
  phone: string | null;
  is_admin: boolean;
  created_at: string;
};

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  display_order: number;
  is_active: boolean;
  service_type: ServiceType;
  created_at: string;
};

type OrderRow = {
  id: string;
  order_id: string;
  user_id: string | null;
  guest_email: string | null;
  product_id: string;
  amount: number;
  status: OrderStatus;
  payment_method: PaymentMethod;
  depositor_name: string | null;
  toss_payment_key: string | null;
  paid_at: string | null;
  service_type: ServiceType;
  public_token: string | null;
  source: string | null;
  reading_status: ReadingStatus | null;
  created_at: string;
};

// 범용 리딩 입력. payload 는 서비스별(타로: { question, spread }).
type ReadingInputRow = {
  id: string;
  order_id: string;
  service_type: ServiceType;
  payload: Json;
  created_at: string;
};

// 범용 리딩 결과. 사주는 기존 saju_results 를 그대로 쓰고, 신규 서비스만 이 테이블 사용.
type ReadingRow = {
  id: string;
  order_id: string;
  service_type: ServiceType;
  draw_record: Json | null;
  prompt_version: string | null;
  model: string | null;
  raw_response: Json | null;
  draft_result: Json | null;
  final_result: Json | null;
  status: ReadingStatus;
  error_log: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

type SajuInputRow = {
  id: string;
  order_id: string;
  name: string | null;
  birth_date: string;
  birth_time: string | null;
  time_unknown: boolean;
  gender: GenderKind;
  calendar: CalendarKind;
  concerns: string[];
  mbti: string | null;
  created_at: string;
};

type SajuResultRow = {
  id: string;
  order_id: string;
  myeongsik: Json;
  interpretation_md: string;
  llm_provider: string;
  llm_model: string;
  analysis: Json | null;
  created_at: string;
};

type ReviewRow = {
  id: string;
  user_id: string;
  order_id: string;
  product_id: string;
  rating: number;
  content: string;
  is_public: boolean;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: {
          id: string;
          email: string;
          display_name?: string | null;
          phone?: string | null;
          is_admin?: boolean;
          created_at?: string;
        };
        Update: Partial<ProfileRow>;
        Relationships: [];
      };
      products: {
        Row: ProductRow;
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description: string;
          price: number;
          display_order?: number;
          is_active?: boolean;
          service_type?: ServiceType;
          created_at?: string;
        };
        Update: Partial<ProductRow>;
        Relationships: [];
      };
      orders: {
        Row: OrderRow;
        Insert: {
          id?: string;
          order_id: string;
          user_id?: string | null;
          guest_email?: string | null;
          product_id: string;
          amount: number;
          status?: OrderStatus;
          payment_method?: PaymentMethod;
          depositor_name?: string | null;
          toss_payment_key?: string | null;
          paid_at?: string | null;
          service_type?: ServiceType;
          public_token?: string | null;
          source?: string | null;
          reading_status?: ReadingStatus | null;
          created_at?: string;
        };
        Update: Partial<OrderRow>;
        Relationships: [];
      };
      saju_inputs: {
        Row: SajuInputRow;
        Insert: {
          id?: string;
          order_id: string;
          name?: string | null;
          birth_date: string;
          birth_time?: string | null;
          time_unknown?: boolean;
          gender: GenderKind;
          calendar?: CalendarKind;
          concerns?: string[];
          mbti?: string | null;
          created_at?: string;
        };
        Update: Partial<SajuInputRow>;
        Relationships: [];
      };
      saju_results: {
        Row: SajuResultRow;
        Insert: {
          id?: string;
          order_id: string;
          myeongsik: Json;
          interpretation_md: string;
          llm_provider: string;
          llm_model: string;
          analysis?: Json | null;
          created_at?: string;
        };
        Update: Partial<SajuResultRow>;
        Relationships: [];
      };
      reviews: {
        Row: ReviewRow;
        Insert: {
          id?: string;
          user_id: string;
          order_id: string;
          product_id: string;
          rating: number;
          content: string;
          is_public?: boolean;
          created_at?: string;
        };
        Update: Partial<ReviewRow>;
        Relationships: [];
      };
      reading_inputs: {
        Row: ReadingInputRow;
        Insert: {
          id?: string;
          order_id: string;
          service_type: ServiceType;
          payload?: Json;
          created_at?: string;
        };
        Update: Partial<ReadingInputRow>;
        Relationships: [];
      };
      readings: {
        Row: ReadingRow;
        Insert: {
          id?: string;
          order_id: string;
          service_type: ServiceType;
          draw_record?: Json | null;
          prompt_version?: string | null;
          model?: string | null;
          raw_response?: Json | null;
          draft_result?: Json | null;
          final_result?: Json | null;
          status?: ReadingStatus;
          error_log?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<ReadingRow>;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      order_status: OrderStatus;
      calendar_kind: CalendarKind;
      gender_kind: GenderKind;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
