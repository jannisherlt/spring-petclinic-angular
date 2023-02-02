/*
 *
 *  * Copyright 2016-2018 the original author or authors.
 *  *
 *  * Licensed under the Apache License, Version 2.0 (the "License");
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  *      http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  * Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  * limitations under the License.
 *
 */

/**
 * @author Vitaliy Fedoriv
 */

import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Vet} from '../vet';
import {VetService} from '../vet.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SpecialtyService} from '../../specialties/specialty.service';
import {Specialty} from '../../specialties/specialty';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Visit} from '../../visits/visit';
import {VisitService} from '../../visits/visit.service';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import { Location } from '@angular/common';

@Component({
  selector: 'app-vet-edit',
  templateUrl: './vet-edit.component.html',
  styleUrls: ['./vet-edit.component.css']
})
export class VetEditComponent implements OnInit {
  @ViewChild(MatPaginator) paginatorPast: MatPaginator;
  @ViewChild(MatPaginator) paginatorFuture: MatPaginator;
  vetEditForm: FormGroup;
  idCtrl: FormControl;
  firstNameCtrl: FormControl;
  lastNameCtrl: FormControl;
  specialtiesCtrl: FormControl;
  vet: Vet;
  specList: Specialty[];
  visitList: Visit[];
  pastVisits: Visit[];
  futureVisits: Visit[];
  errorMessage: string;
  pageSize: number = 5;

  @Input() futureVisitsData;
  @Input() pastVisitsData;

  pastLength;
  futureLength;

  constructor(private formBuilder: FormBuilder, private specialtyService: SpecialtyService, private visitService: VisitService,
              private vetService: VetService, private route: ActivatedRoute, private router: Router, private location: Location) {
    this.vet = {} as Vet;
    this.specList = [] as Specialty[];
    this.visitList = [] as Visit[];
    this.pastVisits = [] as Visit[];
    this.futureVisits = [] as Visit[];
    this.buildForm();
  }

  buildForm() {
    this.idCtrl = new FormControl(null);
    this.firstNameCtrl = new FormControl('', [Validators.required, Validators.minLength(2)]);
    this.lastNameCtrl = new FormControl('', [Validators.required, Validators.minLength(2)]);
    this.specialtiesCtrl = new FormControl(null);
    this.vetEditForm = this.formBuilder.group({
      id: this.idCtrl,
      firstName: this.firstNameCtrl,
      lastName: this.lastNameCtrl,
      specialties: this.specialtiesCtrl
    });
  }

  compareSpecFn(c1: Specialty, c2: Specialty): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  initFormValues() {
    this.idCtrl.setValue(this.vet.id);
    this.firstNameCtrl.setValue(this.vet.firstName);
    this.lastNameCtrl.setValue(this.vet.lastName);
    this.specialtiesCtrl.setValue(this.vet.specialties);
  }

  ngOnInit() {
    this.pastVisits = [];
    this.futureVisits = [];
    this.pastVisitsData = [];
    this.futureVisitsData = [];
    // we use SpecResolver and VetResolver (get data before init component)
    this.specList = this.route.snapshot.data.specs;
    this.vet = this.route.snapshot.data.vet;
    this.vet.specialties = this.route.snapshot.data.vet.specialties;
    const vetId = this.vet.id.toString();
    this.visitService.getVisitByVetId(vetId).subscribe(
      list => {
        this.visitList = list; console.log(list);
        for (const visit of list) {
          if(Date.parse(visit.date) > Date.now()) {
            this.futureVisits.push(visit);
          } else {
            this.pastVisits.push(visit);
          }
        }
        this.pastVisits.sort((a, b) => {return (new Date(b.date).getTime() - new Date(a.date).getTime())});
        this.futureVisits.sort((a, b) => {return (new Date(a.date).getTime() - new Date(b.date).getTime())});
        this.pastLength = this.pastVisits.length;
        this.futureLength = this.futureVisits.length;
        const end = 5;
        const start =0;
        this.pastVisitsData = this.pastVisits.slice(start, end);
        this.futureVisitsData = this.futureVisits.slice(start, end);
        },
      error => this.errorMessage = error as any
    );
    this.vet.visits = this.route.snapshot.data.visitList;
    //this.splitVisitList(this.visitList);
    this.initFormValues();
    this.pastLength = this.pastVisits.length;
    this.futureLength= this.futureVisits.length;
  }

  splitVisitList(visitList: Visit[]) {
    for (const visit of visitList) {
        if(Date.parse(visit.date) > Date.now()) {
          this.futureVisits.push(visit);
        } else {
          this.pastVisits.push(visit);
        }
    }
    this.pastVisits = visitList;
  }

  saveVet(vet: Vet) {
    this.vetService.updateVet(vet.id.toString(), vet).subscribe(
      res => {
        console.log('update success');
        this.gotoVetList();
      },
      error => this.errorMessage = error as any);
  }

  gotoVetList() {
    this.location.back();
  }

  onSelect(visit: Visit) {
    this.router.navigate(['/visits', visit.id,'edit']);
  }

  onChangePagePast(pe: PageEvent) {
    const end = (pe.pageIndex + 1) * this.pageSize;
    const start = pe.pageIndex * this.pageSize;
    this.pastVisitsData = this.pastVisits.slice(start, end);
  }
  onChangePageFuture(pe: PageEvent) {
    const end = (pe.pageIndex + 1) * this.pageSize;
    const start = pe.pageIndex * this.pageSize;
    this.futureVisitsData = this.futureVisits.slice(start, end);
  }

  deleteVisit(visit: Visit) {
    if(confirm('Do you want to delete this visit?')) {
      this.visitService.deleteVisit(visit.id.toString()).subscribe(
        response => {
          if(this.futureVisits.indexOf(visit) !== -1) {
            this.futureVisits.splice(this.futureVisits.indexOf(visit), 1);
            this.futureVisitsData.splice(this.futureVisitsData.indexOf(visit), 1);
            console.log(this.futureVisits);
          } else if (this.pastVisits.indexOf(visit) !== -1) {
            this.pastVisits.splice(this.pastVisits.indexOf(visit), 1);
            this.futureVisitsData.splice(this.futureVisitsData.indexOf(visit), 1);
            console.log(this.pastVisits);
          }
          this.ngOnInit();
          console.log('delete success');

        },
        error => this.errorMessage = error as any);
    }
  }
}
