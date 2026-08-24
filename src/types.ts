export type UserRole = 'student' | 'teacher' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  department?: string;
  id_no?: string;
  semester?: string;
  bio?: string;
  office_hours?: string;
  father_name?: string;
  mother_name?: string;
  blood_group?: string;
  created_at?: string;
  updated_at?: string;
}

export type NoticeCategory = 'academic' | 'administrative' | 'events' | 'sports';

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  category: NoticeCategory;
  author?: string;
  created_at?: string;
}

export type BusStatus = 'active' | 'inactive' | 'delayed';

export interface Bus {
  id: string;
  name: string;
  route: string;
  status: BusStatus;
  current_location: string;
  eta: string;
  schedule: string[];
  created_at?: string;
}

export type FoodCategory = 'breakfast' | 'lunch' | 'snacks' | 'beverage';

export interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  price: number;
  is_vegetarian: boolean;
  is_available: boolean;
  image: string;
  rating: number;
  created_at?: string;
}

export interface CartItem {
  item: FoodItem;
  quantity: number;
}

export type LostFoundStatus = 'lost' | 'found';
export type LostFoundCategory = 'electronics' | 'documents' | 'accessories' | 'others';

export interface LostFoundItem {
  id: string;
  title: string;
  description: string;
  status: LostFoundStatus;
  category: LostFoundCategory;
  location: string;
  date: string;
  contact_name: string;
  contact_phone: string;
  reported_by: string;
  created_at?: string;
}

export type ComplaintCategory = 'academic' | 'facilities' | 'it' | 'transport' | 'cafeteria';
export type ComplaintStatus = 'pending' | 'under_review' | 'resolved';

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  is_anonymous: boolean;
  date: string;
  reported_by: string;
  reported_by_email: string;
  admin_feedback?: string | null;
  created_at?: string;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  order_id: string;
  items: OrderItem[];
  total_price: number;
  status: OrderStatus;
  ordered_by: string;
  date: string;
  created_at?: string;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
}

export type NavigationTab = 
  | 'dashboard'
  | 'notices'
  | 'cafeteria'
  | 'transport'
  | 'lostfound'
  | 'complaints'
  | 'profile'
  | 'settings';
