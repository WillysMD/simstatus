export class Simuconf {
  name: string;
  default: boolean;
  data: string;
  id: number;

  public toString(): string {
    return this.name;
  }
}
