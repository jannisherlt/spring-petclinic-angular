import {BehaviorSubject, Observable, of} from 'rxjs';
import {Owner} from '../../owners/owner';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {SearchService} from '../search.service';
import {ActivatedRoute, Router} from '@angular/router';
import {OwnerSearchComponent} from './owner-search.component';
import Spy = jasmine.Spy;
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';
import {OwnerDetailComponent} from '../../owners/owner-detail/owner-detail.component';
import {ResultListComponent} from '../result-list/result-list.component';
import {By} from '@angular/platform-browser';

class SearchServiceStub {
    getOwnersByKeywords(keywords: string): Observable<Owner[]> {
        return of([{
            address: '', city: '', firstName: 'Jannis', lastName: 'Herlt', pets: [], telephone: '',
            id: 1
        }] as Owner[]);
    }
}

const activatedRouteQueryParams = new BehaviorSubject({
    search: 'Jannis'
});

describe('OwnerSearchComponent', () => {
    let component: OwnerSearchComponent;
    let fixture: ComponentFixture<OwnerSearchComponent>;
    let searchService: SearchServiceStub;
    let spy: Spy;
    let router: Router;
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [OwnerSearchComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [RouterTestingModule.withRoutes(
                [
                    {path: 'result', component: ResultListComponent},
                    {path: 'owners/:id', component: OwnerDetailComponent}
                ]
            )],
            providers: [
                {provide: SearchService, useClass: SearchServiceStub},
                {provide: ActivatedRoute, useValue: {queryParams: activatedRouteQueryParams}},
            ]
        }).compileComponents();
        router = TestBed.inject(Router);
    }));

    const owners = [{
        address: '', city: '', firstName: 'Jannis', lastName: 'Herlt', pets: [], telephone: '',
        id: 1
    }]
    beforeEach(waitForAsync(() => {
        fixture = TestBed.createComponent(OwnerSearchComponent);
        component = fixture.componentInstance;
        searchService = fixture.debugElement.injector.get(SearchService);
        spy = spyOn(searchService, 'getOwnersByKeywords').and.returnValue(of(owners));
    }));

    it('should create OwnerSearchComponent', () => {
        expect(component).toBeTruthy();
    });

    it('routing to edit owner page', waitForAsync (() => {
        fixture.detectChanges();
        spyOn(router, 'navigate');

        let buttons = fixture.debugElement.query(By.css('.ownerFullName'))

        let ownerButtonList = buttons.nativeElement;
        ownerButtonList.click();
        spyOn(component, 'onSelect').and.callThrough();
        expect(router.navigate).toHaveBeenCalledWith(['/owners',owners[0].id]);
    }));
})