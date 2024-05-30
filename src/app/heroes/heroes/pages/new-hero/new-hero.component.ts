import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { HeroesService } from '../../service/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-new-hero',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './new-hero.component.html',
  styleUrls: ['./new-hero.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewHeroComponent implements OnInit {

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ){}

  returnHome(){
  this.router.navigateByUrl('/heroes')
  }

  ngOnInit(): void {

  }
 }
