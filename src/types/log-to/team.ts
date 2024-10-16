export interface TeamResponse {
  tenantId: string
  id: string
  name: string
  description: string
  customData: CustomData
  isMfaRequired: boolean
  branding: Branding
  createdAt: number
}

export interface CustomData {}

export interface Branding {
  logoUrl: string
  darkLogoUrl: string
  favicon: string
  darkFavicon: string
}
