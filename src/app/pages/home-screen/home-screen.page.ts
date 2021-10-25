import { Component, ViewChild, ElementRef } from '@angular/core';
import { FirebaseAuthService } from '../../services/firebase-auth.service'
import Chart from 'chart.js/auto';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home-screen',
  templateUrl: 'home-screen.page.html',
  styleUrls: ['home-screen.page.scss']
})

export class HomeScreenPage {
  // stores the user data
  userDetail: any = { activitiesGoal: 0 };
  // stores the users weekly track data
  weeklyData: any = [];
  // stores information about the bar chart
  @ViewChild('barCanvas') barCanvas: ElementRef;
  private barChart: Chart;

  constructor(
    public authService: FirebaseAuthService,
    private loadingController: LoadingController) {
  }

  ngOnInit() { }

  async ionViewWillEnter() {
    // show the loading symbol while data is being loaded
    let dataLoaded: number = 0;
    const loading = await this.loadingController.create();
    await loading.present();

    // get the users detail
    this.authService.getUserDetails().subscribe(res => {
      this.userDetail = res.data();
      // when all the data has been loaded, dismiss the loading symbol
      dataLoaded += 1;
      if (dataLoaded == 2) {
        loading.dismiss();
      }
    })

    // get the users weekly tracks information
    this.authService.getweeklyTracks().subscribe(res => {
      if (res) {
        // format and store the weekly track information
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
        // load the bar chart data
        this.getBarChartData();
        // when all the data has been loaded, dismiss the loading symbol
        dataLoaded += 1;
        if (dataLoaded == 2) {
          loading.dismiss();
        }
      }
    });
  }

  /*
  * Load and process the data to show on the bar chart
  */
  getBarChartData() {
    // get the date from a week ago
    let date = new Date();
    date.setDate(date.getDate() - 7);

    let labels = [];
    let objectData: any = {};

    // get a list containing each day from the past week
    for (let i = 0; i < 7; i++) {
      date.setDate(date.getDate() + 1);
      let currentDate = date.toLocaleDateString();
      labels.push(currentDate);
      objectData[currentDate] = 0;
    }

    // reset the date to a week ago
    date.setDate(date.getDate() - 6);

    // loop through each element of the users weekly data to get the distance and date
    this.weeklyData.forEach((element: any) => {
      let currentDate = new Date(element.times.startTime).toLocaleDateString();
      let currentDistance = objectData[currentDate];

      // update the datas distance for the specific date
      objectData[currentDate] = currentDistance + element.distance;
    });

    let data = []

    // add all the distances into a list
    labels.forEach(element => {
      data.push(objectData[element])
    });

    // build the bar chart with the labels and the data
    this.barChartMethod(labels, data);
  }

  /*
  * Build the bar chart
  */
  barChartMethod(labels: Array<string>, data: Array<number>) {
    // if a bar chart already exisits, destroy it so a new one can be build
    if (this.barChart != null) {
      this.barChart.destroy();
    }

    // create the new bar chart with the relevant data
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: "Distance Travelled (m)",
            data: data,
            borderColor: "rgba(255, 99, 132, 0.2)",
            backgroundColor: "rgba(255,99,132,1)",
            borderWidth: 1
          }
        ]
      }
    });
  }
}