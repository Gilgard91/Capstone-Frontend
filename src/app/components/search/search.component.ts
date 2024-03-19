import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  selectedCategoryId: string = '0';

  constructor(private router: Router) {}

  ngOnInit() {}

  onCategorySelected(event: any) {
    const categoryId = event?.target?.value;
    if (categoryId !== '0') {
      this.router.navigate(['/category', categoryId]);
    }
  }

  doSearch(value: string) {
    if (value !== '') {
      console.log('value: ', value);
      this.router.navigateByUrl(`/search/${value}`);
    } else {
      this.router.navigateByUrl('/home');
    }
  }
}
