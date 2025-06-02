import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Car } from '../car.model';
import { VideoSummary } from '../video-summary.model';
import { Devis } from '../devis.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BASE_URL } from '../../config';
import { translations } from './client-portal.translation';

@Component({
  selector: 'app-client-portal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-portal.component.html',
  styleUrls: ['./client-portal.component.css']
})
export class ClientPortalComponent implements OnInit {
  baseUrl = BASE_URL;
  lang: string | null = null;
  plate: string | null = null;
  folderName: string | null = null;
  car: Car | null = null;
  videoSummary: VideoSummary | null = null;
  advisorComment: string = '';
  devis: Devis | null = null;
  labor: any[] = [];
  comment: string = '';
  devisReference: string = '';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.lang = this.route.snapshot.paramMap.get('lang') || 'en';
    this.plate = this.route.snapshot.paramMap.get('plate');
    this.folderName = this.route.snapshot.paramMap.get('folderName');

    if (!this.plate || !this.folderName) return;

    const encodedPlate = encodeURIComponent(this.plate.trim());
    const encodedFolder = encodeURIComponent(this.folderName.trim());
    const headers = new HttpHeaders({ 'Accept': 'application/json' });

    this.http.get<Car>(`${this.baseUrl}/api/cars/${encodedPlate}`, { headers }).subscribe({
      next: (data) => this.car = data,
      error: (err) => console.error('Car error:', err)
    });

    this.http.get<any>(`${this.baseUrl}/api/advisor/summary/${encodedPlate}/${encodedFolder}`, { headers }).subscribe({
      next: (data) => {
        this.folderName = data.folderName || this.folderName;
        const refSuffix = data.devisId?.toString().padStart(4, '0') ?? '0000';
        this.devisReference = `DV-${refSuffix}`;

        this.videoSummary = {
          videoPath: data.videoPath,
          comment: data.comment
        };

        this.advisorComment = data.advisorComment || '';

        this.devis = {
          devisId: data.devisId,
          items: data.items.map((item: any) => ({ ...item, accepted: true })),
          subtotal: data.devis.subtotal,
          discount: data.devis.discount,
          tax: data.devis.tax,
          total: data.devis.total
        };

        this.labor = (data.labor || []).flatMap((group: any) => group.items || []);
      },
      error: (err) => console.error('Summary error:', err)
    });
  }

  submitResponse() {
    if (!this.plate || !this.devis) return;

    const responses: { [key: string]: string } = {};
    this.devis.items.forEach((item, index) => {
      const key = item.description || `item-${index}`;
      responses[key] = item.accepted ? 'accepted' : 'rejected';
    });

    const body = {
      plate: this.plate,
      devisId: this.devis.devisId,
      folderName: this.folderName,
      responses,
      comment: this.comment
    };

    this.http.post(`${this.baseUrl}/api/client/submit`, body).subscribe({
      next: () => window.location.href = '/assets/thank-you.html',
      error: (err) => {
        console.error('Submit error:', err);
        alert('Submission failed.');
      }
    });
  }

  get grandTotal(): number {
    const devisTotal = this.devis?.total ?? 0;
    const laborTotal = this.labor?.reduce((sum, l) => sum + (+l.amount || 0), 0) ?? 0;
    return devisTotal + laborTotal;
  }

  translate(key: string): string {
    return translations[this.lang ?? 'en']?.[key] ?? key;
  }
}
