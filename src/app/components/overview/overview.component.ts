import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent {

  // Selected filter (default: day)
  filter: string = 'day';
  role : string = 'USER';
  // Stats
  userCount: number = 0;
  appointmentsCount: number = 0;
  revenue: number = 0;

  private apiUrl = 'http://localhost:8080/admin'; // adjust if needed

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadData();
  }

  /**
   * Called when dropdown value changes
   */
  onFilterChange(newFilter: string): void {
    this.filter = newFilter;
    this.loadData();
  }



  private getAuthHeaders(): HttpHeaders {
  const token = localStorage.getItem('token'); // wherever you store the JWT
  return new HttpHeaders({
    Authorization: `Bearer ${token}`
  });
}


  /**
   * Fetch all stats (users, appointments, revenue)
   */
  private loadData(): void {
     this.getUserCount();
     this.getAppointmentsCount();
     this.getRevenue();
  }

  /**
   * API call: Get total user count
   */
  private getUserCount(): void {
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders().set('Authorization',`Bearer ${token}`);
    console.log("start getUser count method ->");
    this.http.get<any>(`${this.apiUrl}/count?role=${this.role}`,{headers}).subscribe({
      next: (res) => {
        this.userCount = res.data;
      },
      error: (err) => console.error('Error fetching user count:', err)
    });
  }

  /**
   * API call: Get appointments count for current filter
   */
private getAppointmentsCount(): void {
  const token = localStorage.getItem('authToken');
  this.http.get<any>(
    `${this.apiUrl}/appointments/counts?filter=${this.filter}`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  ).subscribe({
    next: (res) => this.appointmentsCount = res.data,
    error: (err) => console.error('Error fetching appointments count:', err)
  });
}


  /**
   * API call: Get revenue for current filter
   */
  private getRevenue(): void {
    console.log("start get revenue method : ");
    const token = localStorage.getItem("authToken");
    this.http.get<any>(`${this.apiUrl}/revenue?filter=${this.filter}`,
  { 
    headers : { Authorization : `Bearer ${token}`}
  }

    ).subscribe({
      next: (res) => {
        this.revenue = res.data;
        console.log("this revenue ->"+this.revenue)
      },
      error: (err) => console.error('Error fetching revenue:', err)
    });
  }

  labels: string[] = [
    'Haircut',
    'Coloring',
    'Styling',
    'Treatments',
    'Manicure/Pedicure',
    'Others'
  ];

  // Example values (replace with real API data)
  values: number[] = [320, 180, 140, 90, 70, 30];

  // Chart.js data
  pieChartData: ChartData<'pie'> = {
    labels: this.labels,
    datasets: [
      {
        data: this.values,
        backgroundColor: [
          '#3b82f6',
          '#06b6d4',
          '#8b5cf6',
          '#10b981',
          '#f59e0b',
          '#ef4444'
        ],
        borderWidth: 1
      }
    ]
  };

  // Chart.js options
  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: { size: 14 }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            const total = this.values.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1) + '%';
            return `${context.label}: ${value} (${percentage})`;
          }
        }
      }
    }
  };

}
