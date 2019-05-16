export class RawData {
  _id: string;
  title: string;
  name: string;
  casts: string[];
  works: { id: string; roles: string[]; }[];
}
