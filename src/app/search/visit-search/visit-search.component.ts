import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {ActivatedRoute, Router} from '@angular/router';
import {SearchService} from '../search.service';
import {Visit} from '../../visits/visit';
import {environment} from '../../../environments/environment';
import {PetService} from '../../pets/pet.service';
import {VetService} from '../../vets/vet.service';
import {OwnerService} from '../../owners/owner.service';
import {VisitService} from '../../visits/visit.service';

@Component({
  selector: 'app-visit-search',
  templateUrl: './visit-search.component.html',
  styleUrls: ['./visit-search.component.css']
})
export class VisitSearchComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;


  keywords: string;
  visits: Visit[];
  errorMessage: string;
  lastName: string;
  length: number;
  pageSize: number = environment.RESULT_PAGINATOR_PAGE_SIZE;
  currentPage: number = 1;

  dataSource;



  constructor(private router: Router, private route: ActivatedRoute, private searchService: SearchService, private petService: PetService,
              private vetService: VetService, private ownerService: OwnerService, private visitService: VisitService) {
  }

  onChangePage(pe: PageEvent) {
    const end = (pe.pageIndex + 1) * this.pageSize;
    const start = pe.pageIndex * this.pageSize;
    this.dataSource = this.visits.slice(start, end);
    console.log(this.dataSource);
    console.log(pe.pageIndex);
    console.log(pe.pageSize);
  }

  ngOnInit() {
    this.visits = [];
    this.route.queryParams.subscribe(params => {
      this.keywords = params['search'];
    });
    this.searchService.getVisitsByKeywords(this.keywords).subscribe(
      visits => {
        this.visits = visits;
        console.log(visits);
        this.length = this.visits.length;
        const end = 10;
        const start =0;
        this.dataSource = this.visits.slice(start, end);
        for (const visit of visits) {
          this.petService.getPetById(visit.petId).subscribe(
            pet => {
              this.ownerService.getOwnerById(pet.ownerId).subscribe(
                owner => {
                  visit.owner = owner;
                }
              )
              visit.pet = pet;
            });
          this.vetService.getVetById(visit.vetId.toString()).subscribe(
            vet => {
              visit.vet = vet;
            });
        }
      },
      error => this.errorMessage = error as any);

  }

  onSelect(visit: Visit) {
    this.router.navigate(['/visits', visit.id,'edit']);
  }

  deleteVisit(visit: Visit) {
    if(confirm('Do you want to delete this visit?')) {
      this.visitService.deleteVisit(visit.id.toString()).subscribe(
        response => {

          this.visits.splice(this.visits.indexOf(visit), 1);
          if(this.visits.length === 0) {
            this.dataSource = [];
          }
          this.ngOnInit();
          console.log('delete success');
        },
        error => this.errorMessage = error as any);
    }
  }


}
