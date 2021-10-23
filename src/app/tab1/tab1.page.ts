import { Component, ViewChild, ElementRef } from '@angular/core';
import { FirebaseAuthService } from '../services/firebase-auth.service'
import Chart from 'chart.js/auto';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  userDetail: any = {activitiesGoal: 0};
  weeklyData: any = [];

  @ViewChild('barCanvas') barCanvas: ElementRef;
  private barChart: Chart;

  constructor(public authService: FirebaseAuthService,
    private loadingController: LoadingController) {
  }

  async ionViewWillEnter() {
    let dataLoaded: number = 0;
    const loading = await this.loadingController.create();
    await loading.present();

    this.authService.getUserDetails().subscribe(res => {
      this.userDetail = res.data();
      dataLoaded += 1;
      if (dataLoaded == 2) {
        loading.dismiss();
      }
    })

    this.authService.getweeklyTracks().subscribe(res => {
      if (res) {
        this.weeklyData = res
          .map(e => {
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
        this.getBarChartData();
        dataLoaded += 1;
        if (dataLoaded == 2) {
          loading.dismiss();
        }
      }
    });
  }

  ngOnInit() {
  }

  getBarChartData() {
    let date = new Date();
    date.setDate(date.getDate() - 7);
    let labels = [];
    let objectData: any = {};

    for (let i = 0; i < 7; i++) {
      date.setDate(date.getDate() + 1);
      let currentDate = date.toLocaleDateString();
      labels.push(currentDate);
      objectData[currentDate] = 0;
    }

    date.setDate(date.getDate() - 6);

    this.weeklyData.forEach((element) => {
      let currentDate = new Date(element.times.startTime).toLocaleDateString();

      let currentDistance = objectData[currentDate];
      objectData[currentDate] = currentDistance + element.distance;
    });

    let data = []

    labels.forEach(element => {
      data.push(objectData[element])
    });

    this.barChartMethod(labels, data);

  }

  barChartMethod(labels, data) {
    if (this.barChart != null) {
      this.barChart.destroy();
    }

    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: "Distance Travelled",
            data: data,
            borderColor: "rgba(255, 99, 132, 0.2)",
            backgroundColor: "rgba(255,99,132,1)",
            borderWidth: 1
          }
        ]
      },
    });
  }
}