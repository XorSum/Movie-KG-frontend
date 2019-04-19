export class Rdf {
  subject: string;
  predicate: string;
  object: string;

  constructor(subject: string, predicate: string, object: string) {
    this.subject = subject;
    this.predicate = predicate;
    this.object = object;
  }
}
