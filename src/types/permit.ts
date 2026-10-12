export type PermitCategory = 
  | 'futsal' 
  | 'nongkrong' 
  | 'mabar' 
  | 'touring' 
  | 'ngopi' 
  | 'reuni' 
  | 'custom';

export type PermitStatus = 'pending' | 'approved' | 'conditional' | 'rejected';

export interface PermitLetter {
  id: string;
  letterNumber: string;
  applicantName: string; // Cowok
  approverName: string;  // Ayang / Cewek
  category: PermitCategory;
  categoryName?: string;
  title: string;
  activityDescription: string;
  location: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  companions: string; // Teman-teman yang ikut
  promises: string[]; // Pakta integritas (misal: PAP tiap jam)
  customPromise?: string;
  applicantSignature?: string; // Data URL PNG
  applicantSignedAt?: string;

  // Review Ayang
  status: PermitStatus;
  approverNotes?: string;
  demands: string[]; // Tuntutan/syarat ayang (misal: beliin seblak)
  approverSignature?: string; // Data URL PNG
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
