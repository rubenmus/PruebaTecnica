import { CommonModule, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { MaterialModule } from 'src/app/material/material.module';
import { HeroesService } from '../../service/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Hero } from '../../interfaces/hero.interface';
import { Subject, debounceTime, distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';
import { FilterComponent } from '../../components/filter/filter.component';
import {
  MatSnackBar,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    FilterComponent,
    ],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css'],
})
export class HeroComponent implements OnInit{

  public heroes: Hero[] = [];
  public isLoading = true;
  searchHero$ = new Subject<string>();



  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar
  ){
    this.searchHero$.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap((data:string)=>{
        return this.heroesService.getHeroByName(data);
      })
    )
    .subscribe((data)=>{
        this.heroes=data
        this.isLoading=false
    })
  }

  ngOnInit(): void {
    this.heroesService.getHeroes()
    .subscribe(data=>{
      this.isLoading = false;
      this.heroes = data;
    })
  }

  deleteHero(id: number){
    if(!id){
      return;
    }
    this.heroesService.deleteHero(id).pipe(
    ).subscribe(_deleted=>{
      this.heroes = this.heroes.filter( (heroes:Hero) => heroes.id != id);
      this.openSnackBar()
    })
  }
  editHero(id: number){
    this.router.navigate([`heroes/${id}/edit`]);
  }
  filterHeroes(event: string){
    this.isLoading=true
    this.searchHero$.next(event);
    // this.heroesService.getHeroByName(event).subscribe((data:Hero[])=>{
    //   this.heroes=data
    //   this.isLoading=false
    // })
  }
  openSnackBar() {
    this._snackBar.open('Heroe eliminado', '', {
      duration: 2000
    });
  }
 }
