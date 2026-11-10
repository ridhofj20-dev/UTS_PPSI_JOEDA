export type UserRole = 'SUPER_ADMIN' | 'AGENCY_ADMIN' | 'OFFICER' | 'CITIZEN';

export type ComplaintStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'REJECTED'
  | 'CLOSED';

export type ComplaintPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface UserProfile {
  id: string;
  role: UserRole;
  full_name: string;
  email: string;
  phone?: string;
  nik?: string;
  agency_id?: string;
  agency_name?: string;
}

export interface AuthResponse {
  token: string;
  token_type: string;
  user: UserProfile;
}

export interface PublicComplaint {
  ticket_number: string;
  title: string;
  description: string;
  category_name: string;
  agency_name: string;
  region_name?: string;
  address_detail?: string;
  latitude: number;
  longitude: number;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  created_at: string;
  updated_at: string;
}

export interface ComplaintDetail {
  id: string;
  ticket_number: string;
  title: string;
  description: string;
  address_detail?: string;
  latitude: number;
  longitude: number;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  visibility: 'PUBLIC' | 'PRIVATE';
  rejection_reason?: string;
  category_id: string;
  category_name: string;
  agency_id: string;
  agency_name: string;
  region_id?: string;
  region_name?: string;
  complainant_name?: string;
  created_at: string;
  updated_at: string;
  timeline: StatusHistoryItem[];
}

export interface StatusHistoryItem {
  id: string;
  from_status?: string;
  to_status: string;
  changed_by_name?: string;
  notes?: string;
  created_at: string;
}

export interface RegionItem {
  id: string;
  parent_id?: string;
  name: string;
  region_type: string;
  administrative_code?: string;
}

export interface AgencyItem {
  id: string;
  name: string;
  code: string;
  contact_phone?: string;
  contact_email?: string;
  is_active: boolean;
}

export interface CategoryItem {
  id: string;
  agency_id: string;
  agency_name?: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  is_active: boolean;
}
