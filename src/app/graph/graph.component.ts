import {Component, OnInit} from '@angular/core';
import {HttpService} from '../http.service';
import {Rdf} from '../rdf';
import {tap, map} from 'rxjs/operators';


@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {

  rdfs: Set<Rdf> = new Set<Rdf>();

  entitys: Map<string, string> = new Map<string, string>();

  // nodeId: Map<string, number> = new Map<string, number>();

  url: string;

  nodes: object[] = [];

  edges: object[] = [];

  echartsIntance = null; // 图表

  public chartOption = {
    backgroundColor: '#2c343c',
    title: {
      text: 'Movie Knowledge Graph',
      left: 'center',
      top: 20,
      textStyle: {
        color: '#ccc'
      }
    },
    tooltop: {},
    animation: false,
    series: [{
      type: 'graph',
      layout: 'force',
      // animation: false,
      label: {
        normal: {
          show: true,
          position: 'right',
          formatter: '{b}'
        }
      },
      force: {
        initLayout: 'circular',
        gravity: 2,
        repulsion: 20,
        edgeLength: 5
      },
      roam: true,
      data: this.nodes,
      edges: this.edges
    }]
  };


  constructor(private httpService: HttpService) {
  }

  ngOnInit() {
  }

  onChartClick(ec) {
    console.log(ec.data);
    if (ec.data.id != undefined) {
      console.log('node');
      this.extend(ec.data.id);
    } else {
      console.log('link');
    }
  }
  onChartInit(ec) {
    this.echartsIntance = ec;
  }

  // url = http://editme.top#movie/13688

  public extend(url) {
    this.extendFrom(url);
    this.extendTo(url);
  }

  public refresh() {
    this.chartOption.series[0].data = this.nodes;
    this.chartOption.series[0].edges = this.edges;
    this.echartsIntance.setOption(this.chartOption);
  }

  addEntity(url: string) {
    if (!this.entitys.has(url)
      && url.startsWith('http://editme.top#')) {
      this.entitys.set(url, 'loading');
      this.nodes.push({
        x: 0,
        y: 0,
        name: 'loading',
        id: url,
        clickable: true,
        draggable: true,
        category: 'qwe',
      });
      const current_index = this.nodes.length - 1;
      this.httpService.getName(url).subscribe(name => {
          this.entitys.set(url, name);
          this.nodes[current_index] = {
            x: 0,
            y: 0,
            name: name,
            id: url,
            clickable: true,
            draggable: true,
            category: 'qwe',
          };
          this.echartsIntance.setOption(this.chartOption);
        }
      );
    }
  }

  addEdge(subject: string, predicate: string, object: string) {
    let rdf = new Rdf();
    rdf.subject = subject;
    rdf.predicate = predicate;
    rdf.object = object;
    if (!this.rdfs.has(rdf)) {
      this.rdfs.add(rdf);
      if (subject.startsWith('http://editme.top#') && object.startsWith('http://editme.top#')) {
        this.edges.push({
          source: subject,
          target: object
        });
        this.echartsIntance.setOption(this.chartOption);
        console.log(this.edges);
      }
    }
  }

  public extendTo(subject) {
    this.httpService.getRelationTo(subject)
      .pipe(
        map(x => x.results.bindings)
      ).subscribe(bindings => {
      this.addEntity(subject);
      bindings.forEach(x => {
        this.addEntity(x.object.value);
        this.addEdge(subject, x.predicate.value, x.object.value);
      });
      console.log(this.rdfs);
    });
  }

  public extendFrom(object) {
    this.httpService.getRelationFrom(object)
      .subscribe(res => {
        let bindings = res.results.bindings;
        this.addEntity(object);
        bindings.forEach(x => {
          this.addEntity(x.subject.value);
          this.addEdge(x.subject.value, x.predicate.value, object);
        });
        console.log(this.rdfs);
      });
  }

}
