/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from '@angular/core';
import { User } from '@smart-management/shared';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  accountStored: User[];

  constructor() {
    this.accountStored = [];
  }

  findAllCategories(): string[] {
    return [];
  }
}
