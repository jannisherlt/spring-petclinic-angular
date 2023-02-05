import {BehaviorSubject} from 'rxjs';
import {SearchComponent} from './search.component';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {ActivatedRoute, Router} from '@angular/router';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';
import {ResultListComponent} from './result-list/result-list.component';

const activatedRouteQueryParams = new BehaviorSubject({
    search: 'Jannis'
});
describe('SearchComponent', () => {
    let component: SearchComponent;
    let fixture: ComponentFixture<SearchComponent>;
    let router: Router;
    
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [SearchComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [RouterTestingModule.withRoutes(
                [
                    {path: 'result', component: ResultListComponent}
                ]
            )],
            providers: [
                {provide: ActivatedRoute, useValue: {queryParams: activatedRouteQueryParams}},
            ]
        }).compileComponents();
        router = TestBed.inject(Router);
    }))

    beforeEach(waitForAsync(() => {
        fixture = TestBed.createComponent(SearchComponent);
        component = fixture.componentInstance;
    }));

    it('should create SearchComponent', () => {
        expect(component).toBeTruthy();
    });
});
