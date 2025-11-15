export interface AppUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: 'driver' | 'vendor' | 'admin';
  isKycCompleted: boolean;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}
