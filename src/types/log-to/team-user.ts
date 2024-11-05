import {Roles} from "@/types/log-to/roles";

export interface TeamUser {
  id: string
  username: string
  primaryEmail: string
  primaryPhone: string
  name: string
  avatar: string
  customData: CustomData
  identities: Identities
  lastSignInAt: number
  createdAt: number
  updatedAt: number
  profile: Profile
  applicationId: string
  isSuspended: boolean
  organizationRoles: OrganizationRole[]
}

export interface CustomData {}

export interface Identities {
  userId: string
  details: Details
}

export interface Details {}

export interface Profile {
  familyName: string
  givenName: string
  middleName: string
  nickname: string
  preferredUsername: string
  profile: string
  website: string
  gender: string
  birthdate: string
  zoneinfo: string
  locale: string
  address: Address
}

export interface Address {
  formatted: string
  streetAddress: string
  locality: string
  region: string
  postalCode: string
  country: string
}

export interface OrganizationRole {
  id: string
  name: Roles['name']
}
