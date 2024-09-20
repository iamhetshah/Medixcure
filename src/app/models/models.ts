// CustomUser model
export interface User {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  password: string; // Typically, you wouldn't handle the password directly in the frontend
  date_of_birth?: string;
  gender?: 'male' | 'female' | string;
  profile_photo?: string; // URL to the profile photo
  role?: 'P' | 'D';
}

// Token model
export interface Token {
  id: number;
  user: User;
  key: string;
  created_at: Date;
  expires_at: Date;
}

// Hospital model
export interface Hospital {
  id?: number;
  name: string;
  address: string;
  photo?: string; // URL to the hospital photo
}

// Doctor model
export interface Doctor {
  id?: number;
  user: User;
  license_number: string;
  years_of_experience: number;
  qualification: string;
  hospital: Hospital;
}

// AppointmentSlot model
export interface AppointmentSlot {
  id?: number;
  doctor?: Doctor;
  start_time: number;
  price: number;
  status: 'available' | 'booked';
}

// Appointment model
export interface Appointment {
  id: number;
  appointment_slot: AppointmentSlot;
  user: User;
}

// AppointmentHistory model
export interface AppointmentHistory {
  id: number;
  user: User;
  doctor: Doctor;
  price: number;
  date: Date;
}

// Prescription model
export interface Prescription {
  id: number;
  appointment_history: AppointmentHistory;
  notes: string;
}

// MedicationMaster model
export interface MedicationMaster {
  id: number;
  name: string;
  category: string;
  dosage_form:
    | 'Cream'
    | 'Injection'
    | 'Ointment'
    | 'Syrup'
    | 'Tablet'
    | 'Inhaler'
    | 'Capsule'
    | 'Drops';
  strength: string;
  manufacturer: string;
  indication:
    | 'Virus'
    | 'Infection'
    | 'Wound'
    | 'Pain'
    | 'Fungus'
    | 'Diabetes'
    | 'Depression'
    | 'Fever';
  classification: string;
}

// MedicinePrescription model
export interface MedicinePrescription {
  id: number;
  prescription: Prescription;
  medicine: MedicationMaster;
  dosage: string;
  frequency: ('Morning' | 'Afternoon' | 'Evening' | 'Night')[];
  empty_stomach: boolean;
}

export interface SignUpData extends User {
  password: string;
  specialities: string[];
  years_of_experience: number;
  qualification: string;
  hospital: Hospital;
  license_number: number;
}

export interface LoginResponse extends User {
  token: string;
  error?: string | 'Username and password are required' | 'Invalid credentials';
}
export interface LoginData {
  username: string;
  password: string;
}

export interface LogoutResponse {
  error?: string | 'Invalid request method.' | 'Invalid token';
  message?: 'Logout successful';
}

export interface SignUpResponse {
  message: string;
  user: LoginResponse;
  error?:
    | string
    | 'Missing required fields'
    | 'Email already exists'
    | 'Username already exists'
    | 'Invalid JSON format';
}

export interface MedicinesResponse {
  classification: string;
  dosage: string;
  dosage_form: string;
  empty_stomach: true;
  frequency: ('Morning' | 'Afternoon' | 'Evening' | 'Night')[];
  indication:
    | 'Virus'
    | 'Infection'
    | 'Wound'
    | 'Pain'
    | 'Fungus'
    | 'Diabetes'
    | 'Depression'
    | 'Fever';
  manufacturer: string;
  medicine_name: string;
  strength: string;
}

export interface AppointmentResponse {
  book_slot_id: number;
  booked_at: string;
  start_time: string;
  person?: {
    first_name: string;
    last_name: string;
    qualification?: string;
    years_of_experience?: number;
    email: string;
    gender: string;
  };
  doctor?: {
    first_name: string;
    last_name: string;
    email: string;
    qualification: string;
    years_of_experience: number;
    profile_photo?: string;
  };
  hospital: Hospital;
  appointment_slot: {
    start_time: string | Date;
    price: string;
    status: 'booked' | 'available';
  };
}

export interface DoctorsResponse {
  doctor: {
    first_name: string;
    last_name: string;
    license_number?: string;
    years_of_experience: number;
    hospital: Hospital;
    specialities: string[];
    profile_photo?: string;
    doctor_id: number;
    user_id: number;
    qualification?: string;
  };
  appointment_slots: AppointmentSlot[];
}

export interface PrescriptionResponse {
  user?: {
    email: string;
    first_name: string;
    last_name: string;
  };
  doctor?: {
    first_name: string;
    last_name: string;
    license_number: string;
    years_of_experience: number;
    hospital: Hospital;
    profile_photo?: string;
  };
  medicines: {
    medicine_name: string;
    dosage: string;
    frequency: ('Morning' | 'Afternoon' | 'Evening' | 'Night')[];
    empty_stomach: boolean;
  }[];
  notes: string;
  date: string | Date; // or Date
}

export interface DoctorsRequest {
  q: string;
  specialities: string[];
}

export interface Prescribe {
  book_id: number;
  note: string;
  medicines: {
    name: string;
    medicine_id: number;
    dosage: string;
    frequency: {
      morning: boolean;
      afternoon: boolean;
      evening: boolean;
      night: boolean;
    };
    empty_stomach: boolean;
  }[];
}
