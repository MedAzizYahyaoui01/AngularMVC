import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Car } from '../car.model';
import { VideoSummary } from '../video-summary.model';
import { Devis } from '../devis.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BASE_URL } from '../../config';

@Component({
  selector: 'app-client-portal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-portal.component.html',
  styleUrls: ['./client-portal.component.css']
})
export class ClientPortalComponent implements OnInit {
  baseUrl = BASE_URL;
  plate: string | null = null;
  car: Car | null = null;
  videoSummary: VideoSummary | null = null;
  devis: Devis | null = null;
  labor: any[] = [];
  comment: string = '';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.plate = this.route.snapshot.paramMap.get('plate');
    if (!this.plate) return;

    const encodedPlate = encodeURIComponent(this.plate.trim());
    const headers = new HttpHeaders({ 'Accept': 'application/json' });

    this.http.get<Car>(`${this.baseUrl}/api/cars/${encodedPlate}`, { headers }).subscribe({
      next: (data) => this.car = data,
      error: (err) => console.error('Car error:', err)
    });

    this.http.get<any>(`${this.baseUrl}/api/advisor/summary/${encodedPlate}`, { headers }).subscribe({
      next: (data) => {
        this.videoSummary = {
          videoPath: data.videoPath,
          comment: data.comment
        };

        this.devis = {
           devisId: data.devisId,
          items: data.items.map((item: any) => ({ ...item, accepted: true })),
          subtotal: data.devis.subtotal,
          discount: data.devis.discount,
          tax: data.devis.tax,
          total: data.devis.total
        };

        this.labor = data.labor || [];
      },
      error: (err) => console.error('Summary error:', err)
    });
  }

  submitResponse() {
    console.log('📤 Submit button clicked');
    


    if (!this.plate || !this.devis) {
      console.warn('❌ Missing plate or devis');
      return;
    }


    const responses: { [key: string]: string } = {};
      this.devis.items.forEach((item, index) => {
      const key = item.id
        ? item.id.toString()
        : item.description || item.partNumber || `item-${index}`;
      responses[key] = item.accepted ? 'accepted' : 'rejected';
    });


    const body = {
      plate: this.plate,
      devisId: this.devis.devisId,
      responses,
      comment: this.comment
    };

    this.http.post(`${this.baseUrl}/api/client/submit`, body).subscribe({
      next: () => {
        console.log('✅ API call success. Redirecting...');
        window.location.href = '/assets/thank-you.html';
      },
      error: (err) => {
        console.error('❌ Submit error:', err);
        alert('Submission failed.');
      }
    });
  }
    get grandTotal(): number {
    const devisTotal = this.devis?.total ?? 0;
    const laborTotal = this.labor?.reduce((sum, l) => sum + (l.amount || 0), 0);
    return devisTotal + laborTotal;
  }




}
