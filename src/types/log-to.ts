export namespace LOG_TO {

  export enum IDENTITIES {
    GOOGLE = "google",
    GITHUB = "github",
  }
  export interface UserInfoResponse {
    created_at: number
    custom_data: Record<string, any>
    email: string | null
    email_verified: boolean
    identities: Identities
    name: string | null
    organization_data: {}[]
    organization_roles: string[]
    organizations: {}[]
    phone_number: string | null
    phone_number_verified: boolean
    picture: string | null
    roles: {}[]
    sso_identities: {}[]
    sub: string
    updated_at: number
    username: string | null
  }

  export interface UserInfo {
    createdAt: number
    customData: Record<string, any>
    email: string | null
    emailVerified: boolean
    identities: Identities
    name: string | null
    organizationData: {}[]
    organizationRoles: string[]
    organizations: {}[]
    phoneNumber: string | null
    phoneNumberVerified: boolean
    picture: string | null
    roles: {}[]
    ssoIdentities: {}[]
    sub: string
    updatedAt: number
    username: string | null
  }


  export interface Identities {
    [IDENTITIES.GITHUB]: Identity<GithubRawData>
    [IDENTITIES.GOOGLE]: Identity<GoogleRawData>
  }

  interface GoogleRawData extends Record<string, any> {}
  interface GithubRawData extends Record<string, any> {}

  interface Identity<T> {
    userId: string
    details: {
      avatar: string | null
      email: string | null
      id: string
      name: string | null
      rawData: T
    }
  }

  export const userInfoResponseToUserInfo = (response: UserInfoResponse): UserInfo => {
    return {
      createdAt: response.created_at,
      customData: response.custom_data,
      email: response.email,
      emailVerified: response.email_verified,
      identities: response.identities,
      name: response.name,
      organizationData: response.organization_data,
      organizationRoles: response.organization_roles,
      organizations: response.organizations,
      phoneNumber: response.phone_number,
      phoneNumberVerified: response.phone_number_verified,
      picture: response.picture,
      roles: response.roles,
      ssoIdentities: response.sso_identities,
      sub: response.sub,
      updatedAt: response.updated_at,
      username: response.username,
    }
  }
}


