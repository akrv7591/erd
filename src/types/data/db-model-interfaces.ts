export interface IErd {
  id: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
  name: string
  description: string | null;
  isPublic: boolean;
  tableNameCase: "snake" | "pascal" | "camel";
  columnNameCase: "snake" | "camel";
  data: Object
  entityCount: number
  teamId: string
  userId: string

  // Foreign Keys
  thumbnailId: string

  // Relations
  thumbnail?: IStaticFile
}

export interface IStaticFile {
  id: string;
  key: string;
  mime: string;
  name: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  // Relations
  erd?: IErd[]
}

export interface Resources {
  erd: IErd
  staticFile: IStaticFile
}
