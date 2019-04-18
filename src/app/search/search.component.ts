import {Component, OnInit} from '@angular/core';
import {HttpService} from '../http.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  question: string;
  answer: string;

  constructor(private httpService: HttpService) {
  }

  ngOnInit() {
  }

  query() {
    // this.answer = this.question;
    this.httpService.query(this.question)
      .subscribe(x => {
        console.log(x);
        this.answer = x;
        // this.answer = x[0];
      });
  }

  // query() {
  //   // this.answer = this.question;
  //   this.httpService.getRelationTo(this.question)
  //     .subscribe(x => {
  //       console.log(x);
  //       this.answer = x;
  //       // this.answer = x[0];
  //     });
  // }


}
