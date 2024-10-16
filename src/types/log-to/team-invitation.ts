export interface TeamInvitationRequestBody {
  invitee: string,
  teamId: string,
  teamName: string,
  roleId: string
}

export interface TeamInvitationResponse {
  tenantId: string
  id: string
  inviterId: string
  invitee: string
  acceptedUserId: string
  organizationId: string
  status: string
  createdAt: number
  updatedAt: number
  expiresAt: number
  organizationRoles: OrganizationRole[]
}

export interface OrganizationRole {
  id: string
  name: string
}
