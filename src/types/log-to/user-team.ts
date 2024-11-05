import {Roles} from "@/types/log-to/roles";

export interface UserTeam {
  tenantId: string
  id: string
  name: string
  description: string
  customData: CustomData
  isMfaRequired: boolean
  branding: Branding
  createdAt: number
  organizationRoles: OrganizationRole[]
}

interface CustomData {
  isPersonal: boolean
  owner: string
}

interface Branding {
  logoUrl: string
  darkLogoUrl: string
  favicon: string
  darkFavicon: string
}

interface OrganizationRole {
  id: string
  name: Roles['name']
}
