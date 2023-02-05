import {BehaviorSubject, Observable, of} from 'rxjs';
import {Pet} from '../../pets/pet';
import {Owner} from '../../owners/owner';
import {PetSearchComponent} from './pet-search.component';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {SearchService} from '../search.service';
import Spy = jasmine.Spy;
import {CUSTOM_ELEMENTS_SCHEMA, DebugElement} from '@angular/core';
import {OwnerService} from '../../owners/owner.service';
import {ActivatedRoute, Router} from '@angular/router';
import {By} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {ResultListComponent} from '../result-list/result-list.component';
import {PetEditComponent} from '../../pets/pet-edit/pet-edit.component';

class SearchServiceStub {

    getPetsByKeywords(keywords: string): Observable<Pet[]> {
        const testPets = [{
            id: 1,
            name: 'Leo',
            birthDate: '2010-09-07',
            type: {id: 1, name: 'cat'},
            ownerId: 1,
            owner: {
                id: 1,
                firstName: 'George',
                lastName: 'Franklin',
                address: '110 W. Liberty St.',
                city: 'Madison',
                telephone: '6085551023',
                pets: null
            },
            visits: null
        }];
        return of(testPets as Pet[]);
    }
}

class OwnerServiceStub {
    getOwnerById(ownerId: number): Observable<Owner> {
        return of();
    }
}

const activatedRouteQueryParams = new BehaviorSubject({
    search: 'Leo'
});

describe('PetSearchComponent', () => {
    let component: PetSearchComponent;
    let fixture: ComponentFixture<PetSearchComponent>;
    let searchService: SearchService;
    let spy: Spy;
    let router: Router;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [PetSearchComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [RouterTestingModule.withRoutes(
                [
                    {path: 'result', component: ResultListComponent},
                    {path: 'pets/:id/edit', component: PetEditComponent}
                ]
            )],
            providers: [
                {provide: SearchService, useClass: SearchServiceStub},
                {provide: OwnerService, useClass: OwnerServiceStub},
                {provide: ActivatedRoute, useValue: {queryParams: activatedRouteQueryParams}}
            ]
        }).compileComponents();
        router = TestBed.inject(Router);
    }));

    const testPets = [{
        id: 1,
        name: 'Leo',
        birthDate: '2010-09-07',
        type: {id: 1, name: 'cat'},
        ownerId: 1,
        owner: {
            id: 1,
            firstName: 'George',
            lastName: 'Franklin',
            address: '110 W. Liberty St.',
            city: 'Madison',
            telephone: '6085551023',
            pets: null
        },
        visits: null
    }];

    beforeEach(() => {
        fixture = TestBed.createComponent(PetSearchComponent);
        component = fixture.componentInstance;
        searchService = fixture.debugElement.injector.get(SearchService);
        spy = spyOn(searchService, 'getPetsByKeywords').and.returnValue(of(testPets));
    });
    it('should create PetSearchComponent', () => {
        expect(component).toBeTruthy();
    })

    it('routing to edit pet page', waitForAsync(() => {
        fixture.detectChanges();
        spyOn(router, 'navigate');
        let buttons = fixture.debugElement.query(By.css('.PetSearchSelect'))

        let petListButton = buttons.nativeElement;
        petListButton.click();
        spyOn(component, 'onSelect').and.callThrough();
        expect(router.navigate).toHaveBeenCalledWith(['/pets', testPets[0].id, 'edit']);
    }));
})
