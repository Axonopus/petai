export interface BusinessProfile {
  id: string;
  owner_id: string;
  business_logo?: string;
  business_name: string;
  business_description?: string;
  email: string;
  phone_number?: string;
  website?: string;
  country?: string;
  language?: string;
  currency?: string;
  price_format?: string;
  date_format?: string;
  time_format?: string;
  timezone?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BusinessHours {
  id: string;
  business_id: string;
  day: string;
  open_time: string | null;
  close_time: string | null;
  rest_start: string | null;
  rest_end: string | null;
  closed: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface BusinessProfileWithHours {
  profile: BusinessProfile;
  hours: BusinessHours[];
}
