import {ResultListComponent} from './result-list.component';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import Spy = jasmine.Spy;
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {RouterStub} from '../../testing/router-stubs';
import {Router} from '@angular/router';

describe('ResultListComponent', () => {
    let component: ResultListComponent;
    let fixture: ComponentFixture<ResultListComponent>;
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ResultListComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                {provide: Router, useClass: RouterStub}
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ResultListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create ResultListComponent', () => {
        expect(component).toBeTruthy();
    });
})