import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: [ './hero-search.component.less' ]
})
export class HeroSearchComponent implements OnInit {
  heroes$!: Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService) {}

  // Introduire un terme de recherche dans le flux d'observables.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      // attendre 300ms après chaque frappe de touche avant de considérer le terme
      debounceTime(300),

      // ignorer le nouveau terme s'il est identique au précédent
      distinctUntilChanged(),

      // passage à une nouvelle recherche observable à chaque fois que le terme change
      switchMap((term: string) => this.heroService.searchHeroes(term)),
    );
  }
}