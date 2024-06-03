import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { HeroComponent } from './heroes/heroes/pages/hero/hero.component';
import { HeroesService } from './heroes/heroes/service/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NewHeroComponent } from './heroes/heroes/pages/new-hero/new-hero.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EditHeroComponent } from './heroes/heroes/pages/edit-hero/edit-hero.component';

describe('AppComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule],
    declarations: [AppComponent]
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'pruebaTecnica'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('pruebaTecnica');
  });

});

describe('HeroComponent', () => {
  let component: HeroComponent;
  let fixture: ComponentFixture<HeroComponent>;
  let mockHeroesService: jasmine.SpyObj<HeroesService>;
  let mockActivatedRoute: Partial<ActivatedRoute>;
  let mockRouter: Partial<Router>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockMatDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(() => {
    mockHeroesService = jasmine.createSpyObj('HeroesService', ['getHeroes', 'getHeroByName', 'deleteHero']);
    mockRouter = {};
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    mockMatDialog = jasmine.createSpyObj('MatDialog', ['open']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HeroesService, useValue: mockHeroesService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: MatDialog, useValue: mockMatDialog }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeroComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch heroes on initialization', () => {
    const mockHeroes = [{ id: "1",
    name: "Batman",
    speed: 100,
    power: 70,
    intelligence: 80}];
    mockHeroesService.getHeroes.and.returnValue(of(mockHeroes));

    fixture.detectChanges();

    expect(component.isLoading).toBe(false);
  });
});

describe('NewHeroComponent', () => {
  let component: NewHeroComponent;
  let fixture: ComponentFixture<NewHeroComponent>;
  let mockHeroesService: jasmine.SpyObj<HeroesService>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockRouter: Partial<Router>;

  beforeEach(async () => {
    mockHeroesService = jasmine.createSpyObj('HeroesService', ['addHero']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    mockRouter = {
      navigateByUrl: jasmine.createSpy('navigateByUrl')
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        { provide: HeroesService, useValue: mockHeroesService },
        { provide: ActivatedRoute, useValue: {} },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NewHeroComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to heroes list on returnHome', () => {
    component.returnHome();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/heroes');
  });

  it('should show snack bar if form is invalid', () => {
    spyOn(component, 'openSnackBarNotName');

    component.newHero();

    expect(component.openSnackBarNotName).toHaveBeenCalled();
    expect(mockHeroesService.addHero).not.toHaveBeenCalled();
    expect(mockSnackBar.open).not.toHaveBeenCalled();
    expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
  });
});


describe('EditHeroComponent', () => {
  let component: EditHeroComponent;
  let fixture: ComponentFixture<EditHeroComponent>;
  let mockHeroesService: jasmine.SpyObj<HeroesService>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockRouter: Partial<Router>;
  let mockActivatedRoute: Partial<ActivatedRoute>;

  beforeEach(async () => {
    mockHeroesService = jasmine.createSpyObj('HeroesService', ['getHero', 'updateHero']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    mockRouter = {
      navigateByUrl: jasmine.createSpy('navigateByUrl')
    };
    mockActivatedRoute = {
      params: of({ id: '1' })
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        { provide: HeroesService, useValue: mockHeroesService },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditHeroComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize heroForm with hero data', () => {
    const heroData = {
      id: '1',
      name: 'Batman',
      speed: 100,
      power: 70,
      intelligence: 80
    };
    mockHeroesService.getHero.and.returnValue(of(heroData));

    fixture.detectChanges();

    expect(mockHeroesService.getHero).toHaveBeenCalledWith('1');
    expect(component.heroForm.value).toEqual(heroData);
  });

  it('should navigate to heroes list on returnHome', () => {
    component.returnHome();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/heroes');
  });

  it('should show snack bar if form is invalid', () => {
    spyOn(component, 'openSnackBarNotName');

    component.updateHero();

    expect(component.openSnackBarNotName).toHaveBeenCalled();
    expect(mockHeroesService.updateHero).not.toHaveBeenCalled();
    expect(mockSnackBar.open).not.toHaveBeenCalled();
    expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
  });
});


