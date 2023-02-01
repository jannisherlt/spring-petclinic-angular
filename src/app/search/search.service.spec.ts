import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {Owner} from '../owners/owner';
import {SearchService} from './search.service';
import {Visit} from '../visits/visit';
import {Vet} from '../vets/vet';
import {Pet} from '../pets/pet';
import {TestBed} from '@angular/core/testing';
import {HttpErrorHandler} from '../error.service';
import {Type} from '@angular/core';

describe('SearchService', () => {
    let httpTestingController: HttpTestingController;
    let searchService: SearchService;
    let expectedOwners: Owner[];
    let expectedPets: Pet[];
    let expectedVets: Vet[];
    let expectedVisits: Visit[];
    let httpClientSpy: { get: jasmine.Spy };
    const params: string = '?keywords=A';

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [SearchService, HttpErrorHandler],
        });
        httpTestingController = TestBed.inject(HttpTestingController);

        expectedOwners = [
            {id: 1, firstName: 'A'},
            {id: 2, firstName: 'AB'},
        ] as Owner[];

        expectedPets = [
            {id: 1, name: 'A'},
            {id: 2, name: 'AB'},
        ] as Pet[];

        expectedVets = [
            {id: 1, firstName: 'A'},
            {id: 2, firstName: 'AB'},
        ] as Vet[];

        expectedVisits = [
            {id: 1, description: 'A'},
            {id: 2, description: 'AB'},
        ] as Visit[];

        httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
        httpTestingController = TestBed.inject<HttpTestingController>(
            HttpTestingController as Type<HttpTestingController>
        );
        searchService = TestBed.inject(SearchService);

    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    it('should return expected owners (called once)', () => {
        searchService
            .getOwnersByKeywords('A')
            .subscribe(
                (owners) =>
                    expect(owners).toEqual(
                        expectedOwners,
                        'should return expected owners'
                    ),
                fail
            );

        // OwnerService should have made one request to GET owners from expected URL
        const req = httpTestingController.expectOne(searchService.entityUrl+'/owners'+params);
        expect(req.request.method).toEqual('GET');

        // Respond with the mock owners
        req.flush(expectedOwners);
    });

    it('should return expected pets (called once)', () => {
        searchService
            .getPetsByKeywords('A')
            .subscribe(
                (pets) =>
                    expect(pets).toEqual(
                        expectedPets,
                        'should return expected owners'
                    ),
                fail
            );

        // OwnerService should have made one request to GET owners from expected URL
        const req = httpTestingController.expectOne(searchService.entityUrl+'/pets'+params);
        expect(req.request.method).toEqual('GET');

        // Respond with the mock owners
        req.flush(expectedPets);
    });

    it('should return expected vets (called once)', () => {
        searchService
            .getVetsByKeywords('A')
            .subscribe(
                (vets) =>
                    expect(vets).toEqual(
                        expectedVets,
                        'should return expected owners'
                    ),
                fail
            );

        // OwnerService should have made one request to GET owners from expected URL
        const req = httpTestingController.expectOne(searchService.entityUrl+'/vets'+params);
        expect(req.request.method).toEqual('GET');

        // Respond with the mock owners
        req.flush(expectedVets);
    });

    it('should return expected visits (called once)', () => {
        searchService
            .getVisitsByKeywords('A')
            .subscribe(
                (visits) =>
                    expect(visits).toEqual(
                        expectedVisits,
                        'should return expected owners'
                    ),
                fail
            );

        // OwnerService should have made one request to GET owners from expected URL
        const req = httpTestingController.expectOne(searchService.entityUrl+'/visits'+params);
        expect(req.request.method).toEqual('GET');

        // Respond with the mock owners
        req.flush(expectedVisits);
    });
})