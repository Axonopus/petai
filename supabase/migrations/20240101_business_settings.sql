-- Create business_profiles table
CREATE TABLE IF NOT EXISTS public.business_profiles (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_id uuid REFERENCES auth.users(id),
    business_logo text,
    business_name text NOT NULL,
    business_description text,
    email text UNIQUE NOT NULL,
    phone_number text NOT NULL,
    website text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create business_hours table
CREATE TABLE IF NOT EXISTS public.business_hours (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id uuid REFERENCES public.business_profiles(id) ON DELETE CASCADE,
    day text NOT NULL CHECK (day IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
    open_time time NOT NULL,
    close_time time NOT NULL,
    rest_start time,
    rest_end time,
    closed boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(business_id, day)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_hours ENABLE ROW LEVEL SECURITY;

-- Create policies for business_profiles
CREATE POLICY "Users can view their own business profile"
    ON public.business_profiles
    FOR SELECT
    USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert their own business profile"
    ON public.business_profiles
    FOR INSERT
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own business profile"
    ON public.business_profiles
    FOR UPDATE
    USING (auth.uid() = owner_id);

-- Create policies for business_hours
CREATE POLICY "Users can view their business hours"
    ON public.business_hours
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1
            FROM public.business_profiles
            WHERE id = business_hours.business_id
            AND owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their business hours"
    ON public.business_hours
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1
            FROM public.business_profiles
            WHERE id = business_hours.business_id
            AND owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their business hours"
    ON public.business_hours
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1
            FROM public.business_profiles
            WHERE id = business_hours.business_id
            AND owner_id = auth.uid()
        )
    );

-- Create functions for managing business hours
CREATE OR REPLACE FUNCTION public.get_business_hours(business_profile_id uuid)
RETURNS TABLE (
    day text,
    open_time time,
    close_time time,
    rest_start time,
    rest_end time,
    closed boolean
) LANGUAGE sql SECURITY DEFINER AS $$
    SELECT
        day,
        open_time,
        close_time,
        rest_start,
        rest_end,
        closed
    FROM
        public.business_hours
    WHERE
        business_id = business_profile_id
    ORDER BY
        CASE day
            WHEN 'Monday' THEN 1
            WHEN 'Tuesday' THEN 2
            WHEN 'Wednesday' THEN 3
            WHEN 'Thursday' THEN 4
            WHEN 'Friday' THEN 5
            WHEN 'Saturday' THEN 6
            WHEN 'Sunday' THEN 7
        END;
$$;