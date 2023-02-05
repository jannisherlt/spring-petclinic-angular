import {BehaviorSubject, Observable, of} from 'rxjs';
import {Vet} from '../../vets/vet';
import {Owner} from '../../owners/owner';
import {Pet} from '../../pets/pet';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {SearchService} from '../search.service';
import {OwnerService} from '../../owners/owner.service';
import {ActivatedRoute, Router} from '@angular/router';
import Spy = jasmine.Spy;
import {VisitSearchComponent} from './visit-search.component';
import {PetService} from '../../pets/pet.service';
import {Visit} from '../../visits/visit';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';
import {ResultListComponent} from '../result-list/result-list.component';
import {VisitEditComponent} from '../../visits/visit-edit/visit-edit.component';
import {VetService} from '../../vets/vet.service';
import {VisitService} from '../../visits/visit.service';
import {By} from '@angular/platform-browser';

class SearchServiceStub {
    getVisitsByKeywords(keywords: string): Observable<Vet[]> {
        return of();
    }
}

class OwnerServiceStub {
    getOwnerById(ownerId: number): Observable<Owner> {
        return of();
    }
}

class PetServiceStub {
    getPetById(petId: number): Observable<Pet> {
        return of();
    }
}

class VisitServiceStub {
    deleteVisit(visitId: string): Observable<number> {
        return of();
    }
}

class VetServiceStub {
    getVetById(vetId: number): Observable<Vet> {
        return of();
    }
}

const activatedRouteQueryParams = new BehaviorSubject({
    search: 'Skin'
});

describe('VisitSearchComponent', () => {
    let component: VisitSearchComponent;
    let fixture: ComponentFixture<VisitSearchComponent>;
    let searchService: SearchService;
    let testVisits: Visit[] = [{
        date: '', description: 'Skin', id: 1, owner: undefined, pet: undefined, petId: 1, vet: undefined, vetId: 1
    }];
    let spy: Spy;
    let router: Router, visitService;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [VisitSearchComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [RouterTestingModule.withRoutes(
                [
                    {path: 'result', component: ResultListComponent},
                    {path: 'visits/:id/edit', component: VisitEditComponent}
                ]
            )],
            providers: [
                {provide: SearchService, useClass: SearchServiceStub},
                {provide: OwnerService, useClass: OwnerServiceStub},
                {provide: PetService, useClass: PetServiceStub},
                {provide: VetService, useClass: VetServiceStub},
                {provide: VisitService, useClass: VisitServiceStub},
                {provide: ActivatedRoute, useValue: {queryParams: activatedRouteQueryParams}}
            ]
        }).
        compileComponents();
        router = TestBed.inject(Router);
    }));

    beforeEach(waitForAsync(() => {
        fixture = TestBed.createComponent(VisitSearchComponent);
        component = fixture.componentInstance;
        searchService = fixture.debugElement.injector.get(SearchService);
        spy = spyOn(searchService, 'getVisitsByKeywords').and.returnValue(of(testVisits));

        visitService = fixture.debugElement.injector.get(VisitService);
        let responseStatus = 204; // success delete return NO_CONTENT
        component.visits = testVisits;

        spy = spyOn(visitService, 'deleteVisit')
            .and.returnValue(of(responseStatus));
    }));

    it('should create VisitSearchComponent', () => {
        expect(component).toBeTruthy();
    });

    it('routing to edit vet page', waitForAsync (() => {
        fixture.detectChanges();
        spyOn(router, 'navigate');

        let buttons = fixture.debugElement.queryAll(By.css('button'))

        let ownerButtonList = buttons[0].nativeElement;
        ownerButtonList.click();
        spyOn(component, 'onSelect').and.callThrough();
        expect(router.navigate).toHaveBeenCalledWith(['/visits',testVisits[0].id, 'edit']);
    }));

    it('should call deleteVisit() method', () => {
        fixture.detectChanges();
        spyOn(window, 'confirm');
        component.deleteVisit(component.visits[0]);
        expect(window.confirm).toHaveBeenCalledWith('Do you want to delete this visit?');
    });
});