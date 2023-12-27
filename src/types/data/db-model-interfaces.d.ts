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
  tableId: string;

  // Relations
  table?: ITable
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

  //Relations
  users?: IUser[]
  teams?: ITeam[]
  tables?: ITable[]
  relations?: IRelation[]
  userErds?: IUserErd[]
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


export interface ITable {
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


export interface ITeamErd {
  createdAt: Date
  updatedAt: Date

  // Permissions
  canRead: boolean
  canWrite: boolean
  canDelete: boolean

  //Foreign keys
  teamId: string
  erdId: string

  //Relations
  team?: ITeam
  erd?: IErd
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
  UserErd?: IUserErd
}


export interface IUserErd {
  // id: string
  createdAt: Date
  updatedAt: Date
  canRead: boolean
  canWrite: boolean
  canDelete: boolean
  isAdmin: boolean

  //Foreign keys
  userId: string
  erdId: string

  //Relations
  user?: IUser
  erd?: IErd
}


export interface IUserTeam {
  //Composite primary keys
  userId: string
  teamId: string

  createdAt: Date
  updatedAt: Date
  isAdmin: boolean

  //Relations
  user?: IUser
  team?: ITeam
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

export interface ICTable extends Optional<ITable, 'id' | 'createdAt' | 'updatedAt'> {
}

export interface ICTeam extends Optional<ITeam, 'id' | 'createdAt'> {
}

export interface ICTeamErd extends Optional<ITeamErd, 'createdAt' | 'updatedAt'> {
}

export interface ICUser extends Optional<IUser, 'id' | 'createdAt' | 'updatedAt' | 'emailVerified'> {
}

export interface ICUserErd extends Optional<IUserErd, 'createdAt' | 'updatedAt' | 'canRead' | 'canWrite' | 'canDelete'> {
}

export interface ICUserTeam extends Optional<IUserTeam, 'createdAt' | 'updatedAt'> {
}
