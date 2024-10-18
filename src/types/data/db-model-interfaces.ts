export interface Erd {
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
  thumbnailId: string | null

  // Relations
  thumbnail?: StaticFile
}

export interface StaticFile {
  id: string;
  key: string;
  mime: string;
  name: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  // Relations
  erd?: Erd[]
}

export type Resources = {
  Erd: Erd
  StaticFile: StaticFile
}
