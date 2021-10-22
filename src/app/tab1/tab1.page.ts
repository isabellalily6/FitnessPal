import { Component, ViewChild, ElementRef } from '@angular/core';
import {FirebaseAuthService} from '../services/firebase-auth.service'
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  userDetail: string;
  weeklyData: any;

  @ViewChild('barCanvas') barCanvas: ElementRef;
  private barChart: Chart;

  constructor(public authService: FirebaseAuthService) {
  }

  ionViewDidEnter(){
    this.authService.getweeklyTracks().subscribe(res => {
      if(res){
        this.weeklyData = res
        .map(e=>{
          return {
            id: e.payload.doc.id,
            distance: e.payload.doc.data()['distance'],
            path: e.payload.doc.data()['path'],
            speed: e.payload.doc.data()['speed'],
            times: {
              startTime: e.payload.doc.data()['times'].startTime.toDate().toString().split(' ').slice(0, 5).join(' '),
              finishTime: e.payload.doc.data()['times'].finishTime.toDate().toString().split(' ').slice(0, 5).join(' '),
              timeDiff: e.payload.doc.data()['times'].timeDiff
          }
        }
        })   
        console.log(this.weeklyData);
        this.getBarChartData()
      }  
    });
  }

  async ngOnInit() {

  }

  getBarChartData(){
    let date = new Date();
    date.setDate(date.getDate() - 7);
    let labels = [];
    let objectData: any = {};
    
    for(let i = 0; i < 7; i++){
      date.setDate(date.getDate() + 1);
      let currentDate = date.toLocaleDateString();
      labels.push(currentDate);
      objectData[currentDate] = 0;
    }

    console.log(labels);
    console.log(objectData);

    date.setDate(date.getDate() - 6);
    console.log(date.toLocaleDateString());

    this.weeklyData.forEach( (element) => {
      let currentDate = new Date(element.times.startTime).toLocaleDateString();

      let currentDistance = objectData[currentDate];
      console.log(currentDistance);
      objectData[currentDate] = currentDistance + element.distance;
  });

  let data = []

  labels.forEach(element => {
    data.push(objectData[element])
  });

  console.log(data);
  this.barChartMethod(labels, data);

  }

  barChartMethod(labels, data) { this.barChart = new Chart(this.barCanvas.nativeElement, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: "Distance Travelled",
          data: data,
          borderColor:  "rgba(255, 99, 132, 0.2)",
          backgroundColor: "rgba(255,99,132,1)",
          borderWidth: 1
        }
      ]
    }
  });
  }
}