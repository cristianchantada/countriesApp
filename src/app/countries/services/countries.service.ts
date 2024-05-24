import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Country } from '../interfaces/country.interface';
import { CacheStore } from '../interfaces/cache-store.interface';
import { Region } from '../interfaces/region.type';

@Injectable({providedIn: 'root'})
export class CountriesService {

	private url: string = 'https://restcountries.com/v3.1';

	public cacheStore: CacheStore = {
		byCapital: {
			term: '',
			countries: []
		},
		byCountries: {
			term: '',
			countries: []
		},
		byRegion: {
			region: '',
			countries: []
		},
	}

  	constructor(private http: HttpClient) {
		this.LoadFromLocalStorage();
	}

	private saveToLocalStorage(){
		localStorage.setItem('cacheStore', JSON.stringify(this.cacheStore));
	}

	private LoadFromLocalStorage(){
		if(!localStorage.getItem('cacheStore')) return;
		this.cacheStore = JSON.parse(localStorage.getItem('cacheStore')!);
	}


  private getCountriesRequest(url: string): Observable<Country[]>{
    return this.http.get<Country[]>(url)
      .pipe(
      catchError(() =>of([])),
    );
  }


  searchCountryByAlphaCode(code: string): Observable<Country | null>{
    const url = `${ this.url }/alpha/${ code }`;
    return this.http.get<Country[]>(url)
    .pipe(
      map(countries => countries.length > 0 ? countries[0] : null),
      catchError(() =>of(null))
    );
  }

  searchCapital(term: string): Observable<Country[]> {
      const url = `${ this.url }/capital/${ term }`;
      return this.getCountriesRequest(url)
	  .pipe(
		tap(countries => this.cacheStore.byCapital = { term, countries}),
		tap(() => this.saveToLocalStorage())
	  );
  }

  searchCountry(term: string): Observable<Country[]>{
    const url = `${ this.url }/name/${ term }`;
    return this.getCountriesRequest(url)
		.pipe(
			tap(countries => this.cacheStore.byCountries = {term, countries}),
			tap(() => this.saveToLocalStorage())
		);
  }

  searchRegion(region: Region): Observable<Country[]>{
    const url = `${ this.url }/region/${ region }`;
    return this.getCountriesRequest(url)
	.pipe(
		tap(countries => this.cacheStore.byRegion = {countries, region: region}),
		tap(() => this.saveToLocalStorage())
	);
  }

}
