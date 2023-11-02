import { format } from 'sql-formatter';

type Column = {
  name: string;
  type: string;
  constraints?: string[];
  comment?: string;
  default?: string;
};

type ForeignKey = {
  fromColumn: string;
  toTable: string;
  toColumn: string;
};

export type Table = {
  name: string;
  columns: Column[];
  primaryKeys?: string[];
  foreignKeys?: ForeignKey[];
};

export class MysqlParser {
  private sql: string

  constructor(sql: string) {
    this.sql = format(sql, {
      language: "mysql",
    })
  }
  parse(): Table[] {
    const tables: Table[] = [];
    let match: RegExpExecArray | null;

    // const createTableRegex = /CREATE TABLE `([^`]+)` \(([^;]+)\);/g;
    const createTableRegex = /CREATE TABLE\s+`([^`]+)`\s+\(([\s\S]+?)\)\s*;/g;

    while ((match = createTableRegex.exec(this.sql))) {
      const tableName = match[1].trim();
      const columnText = match[2].trim();

      const columns: Column[] = this.parseColumns(columnText);
      tables.push({name: tableName, columns});
    }

    // const alterTableRegex = /ALTER TABLE `([^`]+)` ADD CONSTRAINT `([^`]+)` (PRIMARY KEY|FOREIGN KEY) \(([^)]+)\)(?:\nREFERENCES `([^`]+)` \(([^)]+)\))?;/g;
    const alterTableRegex = /ALTER TABLE\s+`([^`]+)`\s+ADD CONSTRAINT\s+`([^`]+)`\s+(PRIMARY KEY|FOREIGN KEY)\s+\(`([^)]+)`\)\s*(?:REFERENCES\s+`([^`]+)`\s+\(`([^)]+)`\))?;/g;

    while ((match = alterTableRegex.exec(this.sql.trim()))) {
      const tableName = match[1].trim();
      const type = match[3].trim();
      const columnNames = match[4].split(",").map(s => s.trim().replace(/`/g, ""));

      const table = tables.find(t => t.name === tableName);
      if (!table) continue;

      if (type === "PRIMARY KEY") {
        table.primaryKeys = columnNames;
      } else if (type === "FOREIGN KEY") {
        if (!table.foreignKeys) table.foreignKeys = [];
        const toTable = match[5].trim();
        const toColumns = match[6].split(",").map(s => s.trim().replace(/`/g, ""));
        table.foreignKeys.push({
          fromColumn: columnNames[0],
          toTable,
          toColumn: toColumns[0],
        });
      }
    }

    return tables;
  }

  private parseColumns(columnText: string): Column[] {
    const columns: Column[] = [];
    const lines = columnText.split(",\n");

    lines.forEach(line => {
      line = line.trim().replace(/\t|\r|\n/g, " ");
      const match = line.match(/`([^`]+)`\s+([^ \n]+)([^,]*)/);
      if (!match) return;

      const [, name, type, rest] = match.map(str => str.trim());
      const column: Column = { name, type };

      if (/NOT NULL/.test(rest)) {
        column.constraints = ["NOT NULL"];
      }

      const defaultMatch = rest.match(/DEFAULT ([^ \n]+)/);
      if (defaultMatch) {
        column.default = defaultMatch[1].trim();
      }

      const commentMatch = rest.match(/COMMENT '([^']+)'/);
      if (commentMatch) {
        column.comment = commentMatch[1].trim();
      }

      columns.push(column);
    });

    return columns;
  }

}
