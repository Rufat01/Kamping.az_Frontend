export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ListingImage {
  id: number;
  image: string;
  is_cover: boolean;
}

export interface Amenity {
  id: number;
  name: string;
  icon?: string;
}

export interface Listing {
  id: number;
  title: string;
  description: string;
  cover_image: string | null;
  images: ListingImage[];
  listing_type: string;
  listing_type_display: string;
  city: string;
  address: string;
  latitude: string;
  longitude: string;
  price_per_night: number | null;
  entry_fee: number | null;
  is_free: boolean;
  max_guests: number;
  rating: number;
  review_count: number;
  owner_name: string;
  owner_phone: string | null;
  amenities: Amenity[];
  view_count?: number;
}

export interface MapListing {
  id: number;
  title: string;
  listing_type: string;
  listing_type_display: string;
  latitude: string;
  longitude: string;
  cover_image: string | null;
  price_per_night: number | null;
  rating: number;
  max_guests: number;
  city: string;
}

export interface MapLocation {
  id: number;
  title: string;
  location_type: string;
  location_type_display: string;
  latitude: string;
  longitude: string;
  cover_image_url?: string;
  city?: string;
}

export type TourStatus = "draft" | "published" | "inactive" | "pending" | "rejected" | "pending_edit";

export interface Tour {
  id: number;
  title: string;
  description: string;
  cover_image: string | null;
  images?: ListingImage[];
  price: number | null;
  duration?: string;
  max_participants?: number;
  location?: string;
  difficulty?: string;
  owner_name?: string;
  owner_phone?: string | null;
  view_count?: number;
  itinerary?: string;
  includes?: string[];
  excludes?: string[];
  meeting_point?: string;
  start_date?: string;
  status?: TourStatus;
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  phone?: string | null;
  profile_completed?: boolean;
}

export interface RegisterData {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  password_confirm: string;
  role: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  recaptcha_token?: string;
}

export interface ReservationData {
  listing: number;
  check_in: string;
  check_out: string;
  guests: number;
}

export interface ReservationIntent {
  id: number;
  user_full_name: string;
  user_email: string;
  user_phone: string;
  tour_title: string;
  tour_id: number;
  status: "pending" | "confirmed" | "cancelled";
  notes: string;
  created_at: string;
}

export interface OfflineRegionInfo {
  name: string;
  date: string;
  size: string;
  tileCount: number;
}
