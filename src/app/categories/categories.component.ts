import { Component, OnInit } from '@angular/core';

import { Category } from '../category';
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories: Category[];

  constructor(private categoryService: CategoryService) { }

  ngOnInit() {
    this.getCategories();
  }

  getCategories(): void {
    this.categoryService.getCategories()
    .subscribe(categories => this.categories = categories._embedded.categories);
  }

  add(name: string, abbreviation: string, message: string): void {
    name = name.trim();
    if (!name) { return; }
    this.categoryService.addCategory({ name, abbreviation, message } as Category)
      .subscribe(category => this.getCategories());
  }

  delete(category: Category): void {
    this.categories = this.categories.filter(h => h !== category);
    this.categoryService.deleteCategory(category).subscribe();
  }

}
