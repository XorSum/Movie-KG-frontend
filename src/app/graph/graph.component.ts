import {Component, OnInit} from '@angular/core';
import {HttpService} from '../http.service';
import {Rdf} from '../rdf';
import {map} from 'rxjs/operators';
import {GraphNode} from './GraphNode';
import {GraphEdge} from './GraphEdge';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {

  rdfs: Set<Rdf> = new Set<Rdf>();

  rdf_prefix = environment.rdf_prefix;

  entitys: Map<string, string> = new Map<string, string>();

  startName = '功夫';

  nodes: GraphNode[] = [];

  edges: GraphEdge[] = [];

  echartsIntance = null; // 图表

  shouldRefresh = true;

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
      roam: true,
      data: this.nodes,
      edges: this.edges,
      categories: undefined,
      animation: true,
      label: {
        normal: {
          show: true,
          position: 'right',
          formatter: '{b}'
        }
      },
      force: {
        initLayout: 'circular',
        gravity: 0,
        repulsion: 200,
        edgeLength: 500
      },
    }]
  };


  constructor(private httpService: HttpService) {
  }

  ngOnInit() {
  }

  onChartClick(ec) {
    if (ec.data.id !== undefined) {
      // 判断是node还是edge, 是node则扩展它的关系
      this.extend(ec.data.id);
    }
  }

  onChartInit(ec) {
    this.echartsIntance = ec;
    var categories = [];
    for (var i = 0; i < 10; i++) {
      categories[i] = {
        name: '类型' + i
      };
    }
    this.chartOption.series[0].categories = categories;

    setInterval(() => {
      if (this.shouldRefresh) {
        this.shouldRefresh = false;
        this.echartsIntance.setOption(this.chartOption);
      }
    }, 50);
  }

  // url = http://editme.top#movie/13688

  public start() {
    this.httpService.getUrl(this.startName)
      .subscribe(url => {
        this.extend(url);
      });
  }

  public extend(url) {
    this.extendFrom(url);
    this.extendTo(url);
  }

  public refresh() {
    this.echartsIntance.setOption(this.chartOption);
  }

  addEntity(url: string) {
    if (!this.entitys.has(url)
      && url.startsWith(this.rdf_prefix)) {
      this.entitys.set(url, 'loading');
      this.httpService.getName(url).subscribe(name => {
          let category = url.slice(this.rdf_prefix.length).split('/')[0];
          console.log(category);
          // TODO 不应该使用length
          this.nodes.push(new GraphNode(name, url, category.length));
          this.entitys.set(url, name);
          this.shouldRefresh = true;
        }
      );
    }
  }

  addEdge(subject: string, predicate: string, object: string) {
    const rdf = new Rdf(subject, predicate, object);
    if (!this.rdfs.has(rdf)) {
      this.rdfs.add(rdf);
      if (subject.startsWith(this.rdf_prefix) && object.startsWith(this.rdf_prefix)) {
        this.edges.push(new GraphEdge(subject, object));
        this.shouldRefresh = true;
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
        const bindings = res.results.bindings;
        this.addEntity(object);
        bindings.forEach(x => {
          this.addEntity(x.subject.value);
          this.addEdge(x.subject.value, x.predicate.value, object);
        });
        console.log(this.rdfs);
      });
  }

}
