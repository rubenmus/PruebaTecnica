import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Subject, debounceTime } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule
  ],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent {

  @Output() filterHeroEvent = new EventEmitter<string>();

  // searchHero$ = new Subject<string>();

  constructor(){
    // this.searchHero$.pipe(
    //   debounceTime(1000)
    // ).subscribe((data:string)=>{
    //   this.filterHeroEvent.emit(data);
    // })
  }


  getHeroesByName(event: any){
    // this.searchHero$.next(event.target.value)
    this.filterHeroEvent.emit(event.target.value);
    // })
  }
}
