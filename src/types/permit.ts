export type PermitCategory = string;

export type PermitStatus = 'pending' | 'approved' | 'conditional' | 'rejected';

export interface ActivityCategory {
  id: string;
  label: string;
  iconName: string;
  defaultTitle: string;
  defaultLocation?: string;
}

export interface PermitLetter {
  id: string;
  letterNumber: string;
  applicantName: string; // Rizki Ramadan
  approverName: string;  // Lisa Suryani Purba
  category: PermitCategory;
  categoryName?: string;
  title: string;
  activityDescription: string;
  location: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  companions: string;
  promises: string[];
  customPromise?: string;
  applicantSignature?: string;
  applicantSignedAt?: string;

  // Review
  status: PermitStatus;
  approverNotes?: string;
  demands: string[];
  approverSignature?: string;
  decidedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CoupleProfile {
  maleName: string;
  femaleName: string;
  relationshipDate?: string;
  whatsappMale?: string;
  whatsappFemale?: string;
  supabaseUrl?: string;
  supabaseKey?: string;
}
