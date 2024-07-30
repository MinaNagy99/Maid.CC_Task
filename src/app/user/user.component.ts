import { UserService } from './../user.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { HttpClientModule } from '@angular/common/http';

import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { LoaderComponent } from '../loader/loader.component';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const users: User[] = [];

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    HttpClientModule,
    MatTableModule,
    CommonModule,
    RouterLink,
    FormsModule,
    MatPaginatorModule,
    LoaderComponent,
  ],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  users: User[] = [];
  allUsers: User[] = [];

  displayedColumns: string[] = [
    'id',
    'avatar',
    'first_name',
    'last_name',
    'email',
    'view',
  ];
  dataSource = this.users;
  total_pages: number | null = null;
  total: number | null = null;
  per_page: number = 6;
  page: number = 1;
  isLoading: boolean = true;
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getUsers(this.page, this.per_page);
    this.getAllUsersForSearch();
  }

  getUsers(page: number, per_page: number): void {
    this.userService.getAllUsers(page, per_page).subscribe({
      next: (res: any) => {
        this.users = res.data;
        this.total_pages = res.total_pages;
        this.total = res.total;
        this.page = res.page;
        this.per_page = res.per_page;
        this.dataSource = this.users;
        this.isLoading = false; // Set loading to false when data is received
      },
      error: () => {
        this.isLoading = false; // Set loading to false in case of error
      },
    });
  }
  getAllUsersForSearch(): void {
    this.userService.getAllUsersForSearch().subscribe({
      next: (res: any) => {
        this.allUsers = res.data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false; // Set loading to false in case of error
      },
    });
  }
  searchTerm: string = '';

  onSearchChange(searchValue: string): void {
    this.dataSource = this.allUsers.filter(
      (user) =>
        user.first_name.toLowerCase().includes(searchValue.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }

  pageSizeOption(total: any): number[] {
    let arr = [];
    for (let i = 0; i < total; i++) {
      arr.push(i + 1);
    }
    return arr;
  }
  onPageChange(event: PageEvent): void {
    this.getUsers(event.pageIndex + 1, event.pageSize);
  }

  title = 'maid.cc';
}
