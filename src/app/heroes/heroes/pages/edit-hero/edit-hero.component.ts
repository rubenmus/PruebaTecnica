import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { HeroesService } from '../../service/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Hero } from '../../interfaces/hero.interface';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-hero',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  templateUrl:'./edit-hero.component.html',
  styleUrls: ['./edit-hero.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditHeroComponent implements OnInit {
  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar
  ){}

  public heroForm = new FormGroup({
    id: new FormControl<string>(''),
    name: new FormControl<string>('', [Validators.required]),
    intelligence: new FormControl<number>(0),
    speed: new FormControl<number>(0),
    power: new FormControl<number>(0),
  });

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.heroesService.getHero(params['id']).subscribe((hero: Hero | undefined) => {
        if(!hero){
          return
        }
        console.log(hero)
        this.heroForm.setValue({
          name: hero.name ?? '',
          intelligence: hero.intelligence ?? 0,
          speed: hero.speed ?? 0,
          power: hero.power ?? 0,
          id: hero.id
        });
      });
    });
  }
  returnHome(){
    this.router.navigateByUrl('/heroes')
    }
  updateHero(){
    if(!this.heroForm.valid){
      this.openSnackBarNotName()
      return;
    }
    const updatedHero: Hero = {
      id: this.heroForm.value.id ?? '',
      name: this.heroForm.value.name ?? '',
      speed: this.heroForm.value.speed ?? 0,
      power: this.heroForm.value.power ?? 0,
      intelligence: this.heroForm.value.intelligence ?? 0
    };

    this.heroesService.updateHero(updatedHero).subscribe(()=>{
      this.router.navigate([`heroes`]);
      this.openSnackBar()
    })
  }
  openSnackBar() {
    this._snackBar.open('Héroe editado', '', {
      duration: 2000
    });
  }
  openSnackBarNotName() {
    this._snackBar.open(`El heroe necesita un nombre`, '', {
      duration: 2000
    });
  }
}
