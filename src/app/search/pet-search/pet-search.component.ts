import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {ActivatedRoute, Router} from '@angular/router';
import {SearchService} from '../search.service';
import {Pet} from '../../pets/pet';
import {environment} from '../../../environments/environment';
import {OwnerService} from '../../owners/owner.service';

@Component({
  selector: 'app-pet-search',
  templateUrl: './pet-search.component.html',
  styleUrls: ['./pet-search.component.css']
})
export class PetSearchComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;


  keywords: string;
  pets: Pet[];
  errorMessage: string;
  lastName: string;
  length: number;
  pageSize: number = environment.RESULT_PAGINATOR_PAGE_SIZE;
  currentPage: number = 1;

  dataSource;



  constructor(private router: Router, private route: ActivatedRoute, private searchService: SearchService, private ownerService: OwnerService) {
    this.pets = [];
  }


  onChangePage(pe: PageEvent) {
    const end = (pe.pageIndex + 1) * this.pageSize;
    const start = pe.pageIndex * this.pageSize;
    this.dataSource = this.pets.slice(start, end);
    console.log(this.dataSource);
    console.log(pe.pageIndex);
    console.log(pe.pageSize);
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.keywords = params['search'];
    });
    this.searchService.getPetsByKeywords(this.keywords).subscribe(
      pets => {
        this.pets = pets;
        console.log(pets);
        this.length = this.pets.length;
        const end = 5;
        const start = 0;
        this.dataSource = this.pets.slice(start, end);
        for (const pet of pets) {
          this.ownerService.getOwnerById(pet.ownerId).subscribe(
            owner => {
              pet.owner = owner;
            }
          );
        }
      },
      error => this.errorMessage = error as any);
  }

  onSelect(pet: Pet) {
    this.router.navigate(['/pets', pet.id, 'edit']);
  }

  goToOwner(ownerId: number) {
    this.router.navigate(['/owners', ownerId]);
  }

  pageEvent: PageEvent;

}
