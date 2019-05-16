export class GraphNode {
  public id: string;
  public name: string;
  public category: string;
  public draggable: true;
  public clickable: true;

  constructor(id: string, name: string, category: string) {
    this.id = id;
    this.name = name;
    this.category = category;
  }
}
