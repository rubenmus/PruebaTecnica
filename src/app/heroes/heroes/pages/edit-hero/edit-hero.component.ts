import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { HeroesService } from '../../service/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Hero } from '../../interfaces/hero.interface';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';

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
  ){}

  public heroForm = new FormGroup({
    id: new FormControl<number>(0),
    name: new FormControl<string>('', { nonNullable: true }),
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
  updateHero(){
    const updatedHero: Hero = {
      id: this.heroForm.value.id ?? 0,
      name: this.heroForm.value.name ?? '',
      speed: this.heroForm.value.speed ?? 0,
      power: this.heroForm.value.power ?? 0,
      intelligence: this.heroForm.value.intelligence ?? 0
    };

    this.heroesService.updateHero(updatedHero).subscribe(()=>{
      this.router.navigate([`heroes`]);
    })

  }
}
