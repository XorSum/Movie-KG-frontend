import {Component, OnInit} from '@angular/core';
import {HttpService} from '../http.service';

import {map} from 'rxjs/operators';
import {RawData} from '../raw-data';
import {GraphNode} from './graph-node';


@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {

  rawDatas: RawData[] = [];

  name = '功夫';

  nodes: GraphNode[] = [];

  edges: object[] = [];

  echartsIntance = null; // 图表

  shouldRefresh = true;

  shouldDrew = false;

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
      animation: true,
      label: {
        normal: {
          show: true,
          position: 'inside',
          formatter: '{b}'
        }
      },
      force: {
        initLayout: 'circular',
        gravity: 0,
        repulsion: 200,
        edgeLength: 200
      },
      roam: true,
      data: this.nodes,
      edges: this.edges,
    }]
  };


  constructor(private httpService: HttpService) {
  }

  ngOnInit() {
  }

  public refresh() {
    this.rawDatas.forEach(x => {
      let flag = true;
      this.nodes.forEach(y => {
        if (x._id == y.id) {
          flag = false;
        }
      });
      if (flag == true) {
        if (x.title != null) {
          this.nodes.push(new GraphNode(x._id, x.title, 'movie'));
        } else {
          this.nodes.push(new GraphNode(x._id, x.name, 'person'));
        }
      }
      if (x.title != null) {
        x.casts.forEach(cast => {
          this.edges.push({
            source: cast,
            target: x._id
          });
        });
      } else {
        x.works.forEach(work => {
          this.edges.push({source: x._id, target: work.id});
        });
      }
    });
    console.log(this.nodes);
    console.log(this.rawDatas);
    this.echartsIntance.setOption(this.chartOption);
  }

  onChartInit(ec) {
    this.echartsIntance = ec;
    this.echartsIntance.setOption(this.chartOption);
    setInterval(() => {
      if (this.shouldRefresh) {
        this.shouldRefresh = false;
        this.refresh();
      }
    }, 50);
  }

  onChartClick(ec) {
    if (ec.data.id !== undefined) {
      console.log(ec.data);
      if (ec.data.category == 'movie') {
        this.extendMovie(ec.data.id);
      } else {
        this.extendPerson(ec.data.id);
      }
    } else {
      console.log('link');
    }
  }

  public start() {
    this.httpService.getMovie(null, this.name).subscribe(res => {
      // console.log(res);
      if (res._id != null) {
        this.extendMovie(res._id);
        this.shouldDrew = true;
      }
    });
  }

  public addNode(node: RawData) {
    let flag = false;
    this.rawDatas.forEach(x => {
      if (x._id == node._id) {
        flag = true;
      }
    });
    if (flag == false) {
      this.rawDatas.push(node);
    }
  }


  public extendPerson(personId: string) {
    this.httpService.getPerson(personId, null)
      .subscribe(res => {
          if (res._id != null) {
            this.addNode(res);
            res.works.forEach(x => {
              this.httpService.getMovie(x.id, null)
                .subscribe(movie => {
                  if (movie._id != null) {
                    this.addNode(movie);
                    this.shouldRefresh = true;
                  }
                });
            });
          }
        }
      );
  }

  public extendMovie(movieId: string) {
    this.httpService.getMovie(movieId, null)
      .subscribe(res => {
          if (res._id != null) {
            // console.log(res);
            this.addNode(res);
            res.casts.forEach(x => {
              // console.log(x);
              this.httpService.getPerson(x, null)
                .subscribe(person => {
                  if (person._id != null) {
                    this.addNode(person);
                    this.shouldRefresh = true;
                  }
                });
            });
          }
        }
      );
  }
}
