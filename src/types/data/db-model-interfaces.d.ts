import {ROLE} from "@/enums/role.ts";

export type Optional<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>

export interface IAccount {
  id: string
  type: string
  provider: string
  providerAccountId: string
  refreshToken: string | null
  accessToken: string | null
  expiresAt: Date
  tokenType: string | null
  scope: string | null
  idToken: string | null
  sessionState: string | null
  createdAt: Date | any

  //Foreign key
  userId: string

  //Relations
  user?: IUser
}


export interface IColumn {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  primary: boolean;
  type: string;
  foreignKey: boolean;
  null: boolean;
  unique: boolean;
  unsigned: boolean;
  autoIncrement: boolean;
  comment: string;
  order: number;

  // Foreign key
  entityId: string;

  // Relations
  entity?: IEntity
}


export interface IEmailVerificationToken {
  id: string
  token: string
  expiresAt: Date | any
  createdAt: Date | any

  //Foreign key
  userId: string

  //Relations
  user?: IUser
}


export interface IErd {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  description: string | null;
  isPublic: boolean;
  teamId: string
  tableNameCase: "snake" | "pascal" | "camel";
  columnNameCase: "snake" | "camel";

  //Relations
  team?: ITeam
  entities?: IEntity[]
  relations?: IRelation[]
  memos?: IMemo
}


export interface IRefreshToken {
  id: string
  token: string
  createdAt: Date | any

  //Foreign key
  userId: string

  //Relations
  user?: IUser
}


export interface IRelation {
  id: string;
  source: string;
  target: string;
  createdAt: string;
  markerEnd: string;

  // Foreign key
  erdId: string;

  // Relations
  erd?: IErd
}


export interface IResetToken {
  id: string
  token: string
  expiresAt: Date | any
  createdAt: Date | any

  //Foreign key
  userId: string

  //Relations
  user?: IUser
}


export interface INodePosition {
  x: number,
  string: number
}


export interface IEntity {
  id: string;
  createdAt: string;
  updatedAt: string;

  name: string;
  color: string;
  position: INodePosition;
  type: string;

  // Foreign key
  erdId: string;

  // Relations
  erd?: IErd
  columns?: IColumn[]
}


export interface ITeam {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string

  //Relations
  users?: IUser[]
  erds?: IErd[]
  UserTeam?: IUserTeam
}


export interface IUser {
  id: string
  name: string
  email: string
  password: string | null
  emailVerified?: Date | null
  createdAt: Date
  updatedAt: Date

  //Relations
  accounts?: IAccount[]
  emailVerificationTokens?: IEmailVerificationToken[]
  refreshTokens?: IRefreshToken[]
  resetTokens?: IResetToken[]
  teams?: ITeam[]
  UserTeam?: IUserTeam
  memos?: IMemo
}



export interface IUserTeam {
  //Composite primary keys
  userId: string
  teamId: string
  role: ROLE
  pending: boolean

  createdAt: Date
  updatedAt: Date

  //Relations
  user?: IUser
  team?: ITeam
}

export interface IMemo {
  id: string;
  content: string;
  color: string;
  createdAt: string;
  updatedAt: string;

  // Foreign Key
  erdId: string;
  userId: string | null;

  // Relations
  erd?: IErd;
  user?: IUser;
}

export interface ICAccount extends Optional<IAccount, 'id' | 'createdAt' | 'refreshToken' | 'accessToken' | 'tokenType' | 'scope' | 'idToken' | 'sessionState'> {
}

export interface ICColumn extends Optional<IColumn, 'id' | 'createdAt' | 'updatedAt'> {
}

export interface ICEmailVerificationToken extends Optional<IEmailVerificationToken, 'id' | 'createdAt'> {
}

export interface ICErd extends Optional<IErd, 'id' | 'createdAt' | 'description'> {
}

export interface ICRefreshToken extends Optional<IRefreshToken, 'id' | 'createdAt'> {
}

export interface ICRelation extends Optional<IRelation, 'createdAt'> {
}

export interface ICResetToken extends Optional<IResetToken, 'id' | 'createdAt'> {
}

export interface ICEntity extends Optional<IEntity, 'id' | 'createdAt' | 'updatedAt'> {
}

export interface ICTeam extends Optional<ITeam, 'id' | 'createdAt'> {
}

export interface ICUser extends Optional<IUser, 'id' | 'createdAt' | 'updatedAt' | 'emailVerified'> {
}

export interface ICUserTeam extends Optional<IUserTeam, 'createdAt' | 'updatedAt'> {
}
export interface ICMemo extends Optional<IMemo, 'id' | 'createdAt' | 'updatedAt'> {}
