import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.css'],
  imports: [CommonModule, RouterModule]
})
export class LanguageSelectorComponent {
  plate: string = '';
  folderName: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {
    this.plate = this.route.snapshot.paramMap.get('plate') || '';
    this.folderName = this.route.snapshot.paramMap.get('folderName') || '';
  }
}
