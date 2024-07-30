import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailsComponent implements OnInit {
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef

  ) {}
  id: any;
  user: any;
  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getUserById(this.id);    
  }



  getUserById(id:any): void {
    this.userService.getUserById(id).subscribe({
      next: (res: any) => {
        this.user = res.data;
        this.cdr.markForCheck();  // Manually mark for check

      },
    });
  }
}
