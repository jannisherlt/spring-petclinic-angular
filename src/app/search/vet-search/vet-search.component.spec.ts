import {BehaviorSubject, Observable, of} from 'rxjs';
import {Vet} from '../../vets/vet';
import {VetSearchComponent} from './vet-search.component';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {SearchService} from '../search.service';
import Spy = jasmine.Spy;
import {ActivatedRoute, Router} from '@angular/router';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';
import {ResultListComponent} from '../result-list/result-list.component';
import {VetEditComponent} from '../../vets/vet-edit/vet-edit.component';
import {By} from '@angular/platform-browser';

class SearchServiceStub {
    getVetsByKeywords(keywords: string): Observable<Vet[]> {
        return of();
    }
}

const activatedRouteQueryParams = new BehaviorSubject({
    search: 'Jannis'
});

describe('VetSearchComponent', () => {
    let component: VetSearchComponent;
    let fixture: ComponentFixture<VetSearchComponent>;
    let searchService: SearchServiceStub;
    let spy: Spy;
    let router: Router;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [VetSearchComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [RouterTestingModule.withRoutes(
                [
                    {path: 'result', component: ResultListComponent},
                    {path: 'vets/:id/edit', component: VetEditComponent}
                ]
            )],
            providers: [
                {provide: SearchService, useClass: SearchServiceStub},
                {provide: ActivatedRoute, useValue: {queryParams: activatedRouteQueryParams}},
            ]
        }).compileComponents();
        router = TestBed.inject(Router);
    }));

    let vets: Vet[] = [{
        firstName: 'Jannis', id: 1, lastName: 'Herlt', specialties: [], visits: []
    }];

    beforeEach(() => {
        fixture = TestBed.createComponent(VetSearchComponent);
        component = fixture.componentInstance;
        searchService = fixture.debugElement.injector.get(SearchService);
        spy = spyOn(searchService, 'getVetsByKeywords').and.returnValue(of(vets));
    });

    it('should create VetSearchComponent', () => {
        expect(component).toBeTruthy();
    });

    it('routing to edit vet page', () => {
        fixture.detectChanges();
        spyOn(router, 'navigate');
        let buttons = fixture.debugElement.queryAll(By.css('button'))

        let ownerButtonList = buttons[0].nativeElement;
        ownerButtonList.click();
        spyOn(component, 'onSelect').and.callThrough();
        expect(router.navigate).toHaveBeenCalledWith(['/vets',vets[0].id, 'edit']);
    });
})