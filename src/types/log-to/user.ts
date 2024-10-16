export interface User {
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
  hasPassword: boolean
  ssoIdentities: SsoIdentity[]
}

export interface CustomData {}

export interface Identities {
  additionalProperty1: AdditionalProperty1
  additionalProperty2: AdditionalProperty2
}

export interface AdditionalProperty1 {
  userId: string
  details: Details
}

export interface Details {}

export interface AdditionalProperty2 {
  userId: string
  details: Details2
}

export interface Details2 {}

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

export interface SsoIdentity {
  tenantId: string
  id: string
  userId: string
  issuer: string
  identityId: string
  detail: Detail
  createdAt: number
  ssoConnectorId: string
}

export interface Detail {}
