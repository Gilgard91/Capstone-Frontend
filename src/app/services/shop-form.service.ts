import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { of } from 'rxjs';
import { Country, Region } from '../interfaces/region';

@Injectable({
  providedIn: 'root',
})
export class ShopFormService {
  private countriesUrl = 'http://localhost:3001/countries';
  private regionsUrl = 'http://localhost:3001/regions';

  constructor(private httpClient: HttpClient) {}

  getCountries(): Observable<Country[]> {
    return this.httpClient.get<Country[]>(this.countriesUrl);
  }

  getRegions(countryCode: string): Observable<Region[]> {
    const searchRegionsUrl = `${this.regionsUrl}/findByCountryCode?code=${countryCode}`;

    return this.httpClient.get<Region[]>(searchRegionsUrl);
  }

  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let data: number[] = [];

    for (let month = startMonth; month <= 12; month++) {
      data.push(month);
    }

    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {
    let data: number[] = [];

    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for (let theYear = startYear; theYear <= endYear; theYear++) {
      data.push(theYear);
    }

    return of(data);
  }
}
