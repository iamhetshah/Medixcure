// Custom User model
export interface User {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: string | null;
  gender: 'M' | 'F' | 'O' | null;
  profile_photo?: string;
  role: 'D' | 'P';
  license_number?: string;
  username: string;
}

// Hospital model
export interface Hospital {
  id: number;
  name: string;
  address: string;
  photo?: string; // Path to the hospital photo
}

// Doctor model
export interface Doctor {
  id: number;
  user: User; // One-to-One relation to User
  license_number: string;
  years_of_experience: number;
  qualification: string;
  hospital: Hospital; // Foreign key to Hospital
}

// Appointment Slot model
export interface AppointmentSlot {
  id: number;
  doctor: Doctor; // Foreign key to Doctor
  start_time: string; // DateTimeField in ISO format
  price: number; // DecimalField mapped to number
  status: 'available' | 'booked'; // Enum for status choices
}

// Appointment model
export interface Appointment {
  id: number;
  appointment_slot: AppointmentSlot; // Foreign key to AppointmentSlot
  user: User; // Foreign key to User
}

// Appointment History model
export interface AppointmentHistory {
  id: number;
  user: User; // Foreign key to User
  doctor: Doctor; // Foreign key to Doctor
  price: number; // DecimalField for price
  date: string; // DateTimeField in ISO format
}

// Prescription model
export interface Prescription {
  id: number;
  appointment_history: AppointmentHistory; // Foreign key to AppointmentHistory
  notes: string; // Notes field
}

// Medication Master model
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
    | 'Drops'; // Enum for dosage form
  strength: string; // e.g., 500mg
  manufacturer: string;
  indication:
    | 'Virus'
    | 'Infection'
    | 'Wound'
    | 'Pain'
    | 'Fungus'
    | 'Diabetes'
    | 'Depression'
    | 'Fever'; // Enum for indication
  classification: string; // e.g., Antibiotic
}

// Medicine Prescription model
export interface MedicinePrescription {
  id: number;
  prescription: Prescription; // Foreign key to Prescription
  medicine: MedicationMaster; // Foreign key to MedicationMaster
  dosage: string; // e.g., 1 tablet
  frequency: 'Morning' | 'Afternoon' | 'Evening' | 'Night'; // Enum for frequency choices
  when?: ('Morning' | 'Afternoon' | 'Evening' | 'Night')[]; // MultiSelectField for multiple choices
}

export interface SignUpData extends User {
  password: string;
}

export interface LoginResponse extends User {
  token: string;
}
export interface LoginData {
  username: string;
  password: string;
}

export interface ErrorAuth {
  message: 'Username already taken.' | null;
}

export interface LogoutResponse {
  error?: string | 'No user is logged in.';
  message?: string;
}
