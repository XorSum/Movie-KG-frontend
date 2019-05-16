export class GraphNode {
  name: string;
  id: string;
  clickable = true;
  draggable = true;
  category: number;


  constructor(name: string, id: string, category: number) {
    this.name = name;
    this.id = id;
    this.category = category;
  }
}
