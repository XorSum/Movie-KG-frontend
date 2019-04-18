import {Component, OnInit} from '@angular/core';
import {HttpService} from '../http.service';
import {Rdf} from '../rdf';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {

  rdfs: Set<Rdf> = new Set<Rdf>();

  entitys: Map<string, string> = new Map<string, string>();

  url: string;

  constructor(private httpService: HttpService) {
  }

  ngOnInit() {
  }

  // url = http://editme.top#movie/13688

  extend(url) {
    this.httpService.getRelationTo(url)
      .subscribe(res => {
        console.log(res);
        let bindings = res.results.bindings;
        console.log(bindings);
        if (!this.entitys.has(url)) {
          this.entitys.set(url, 'init');
        }
        bindings.forEach(x => {
          let rdf = new Rdf();
          rdf.subject = this.url;
          rdf.predicate = x.predicate.value;
          rdf.object = x.object.value;
          // console.log(rdf);
          this.rdfs.add(rdf);
          if (!this.entitys.has(x.object.value)) {
            this.entitys.set(x.object.value, 'init');
          }

        });
      });

    this.httpService.getRelationFrom(url)
      .subscribe(res => {
        console.log(res);
        let bindings = res.results.bindings;
        console.log(bindings);
        if (!this.entitys.has(url)) {
          this.entitys.set(url, 'init');
        }
        bindings.forEach(x => {
          let rdf = new Rdf();
          rdf.subject = x.subject.value;
          rdf.predicate = x.predicate.value;
          rdf.object = this.url;
          // console.log(rdf);
          this.rdfs.add(rdf);
          if (!this.entitys.has(x.subject.value)) {
            this.entitys.set(x.subject.value, 'init');
          }

        });
      });
  }

}
