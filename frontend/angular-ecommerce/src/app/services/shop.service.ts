import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { end } from '@popperjs/core';
import { Observable, map, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  private countriesUrl = 'http://localhost:8080/api/countries';
  private statesUrl = 'http://localhost:8080/api/states';

  constructor(private httpClient: HttpClient) { }

  getCountries(): Observable<Country[]>{
    return this.httpClient.get<responseCountry>(this.countriesUrl).pipe(
      map(result => result._embedded.countries)
    )
  }

  getStatesUrl(statesCode: string): Observable<State[]>{
    const stateSearch = `${this.statesUrl}/search/findByCountryCode?code=${statesCode}`;
    return this.httpClient.get<responseState>(stateSearch).pipe(
      map(response => response._embedded.states)
    )
  }

  getCreditCardMonth(startMonth: number): Observable<number[]>{
    let data: number[] = [];

    for(let theMonth = startMonth; theMonth <= 12; theMonth++){
      data.push(theMonth);
    }
    return of(data);
  }

  getCreditCardYear(): Observable<number[]>{
    let data: number[] = [];

    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10.
    for(let theYear = startYear; theYear <= endYear; theYear++){
      data.push(theYear)
    }
    return of(data);
  }

}

interface responseCountry{
    _embedded:{
      countries: Country[]
    }
}
interface responseState{
  _embedded:{
    states: State[]
  }
}
