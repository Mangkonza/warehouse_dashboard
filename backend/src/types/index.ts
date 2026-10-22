export type UserRole = 'admin' | 'viewer';

export interface AuthUser {
  id: string;
  nontriAccount: string;
  email?: string;
  nameTh: string;
  facultyName?: string;
  departmentName?: string;
  campus?: string;
  typePerson?: string;
  role: UserRole;
}

export interface KUUserProfile {
  sub?: string;
  thainame?: string;
  'first-name'?: string;
  'last-name'?: string;
  cn?: string;
  givenname?: string;
  surname?: string;
  thaiprename?: string;
  jobtype?: string;
  'type-person'?: string | number;
  position?: string;
  'position-id'?: string;
  campus?: string;
  faculty?: string;
  'ku-faculty-en'?: string;
  department?: string;
  'ku-department-en'?: string;
  idcode?: string;
  mail?: string;
  'google-mail'?: string;
  'office365-mail'?: string;
  userprincipalname?: string;
  uid?: string;
  'ku-faculty-code'?: string;
  'ku-department-code'?: string;
}

export interface JWTPayload {
  sub: string;
  nontriAccount: string;
  email?: string;
  nameTh: string;
  facultyName?: string;
  departmentName?: string;
  campus?: string;
  typePerson?: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
