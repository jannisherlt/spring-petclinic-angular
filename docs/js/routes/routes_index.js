var ROUTES_INDEX = {
  "name": "<root>", "kind": "module", "className": "AppModule", "children": [{
    "name": "appRoutes",
    "filename": "src/app/app-routing.module.ts",
    "module": "AppRoutingModule",
    "children": [{"path": "welcome", "component": "WelcomeComponent"}, {
      "path": "", "component": "WelcomeComponent"
    }, {"path": "**", "component": "PageNotFoundComponent"}],
    "kind": "module"
  }, {
    "name": "ownerRoutes",
    "filename": "src/app/owners/owners-routing.module.ts",
    "module": "OwnersRoutingModule",
    "children": [{"path": "owners", "component": "OwnerListComponent"}, {
      "path": "owners/add", "component": "OwnerAddComponent"
    }, {"path": "owners/:id", "component": "OwnerDetailComponent"}, {
      "path": "owners/:id/edit", "component": "OwnerEditComponent"
    }, {"path": "owners/:id/delete", "component": "OwnerDeleteComponent"}, {
      "path": "owners/:id/pets/add", "component": "PetAddComponent"
    }],
    "kind": "module"
  }, {
    "name": "petRoutes",
    "filename": "src/app/pets/pets-routing.module.ts",
    "module": "PetsRoutingModule",
    "children": [{"path": "pets", "component": "PetListComponent"}, {
      "path": "pets/add", "component": "PetAddComponent"
    }, {
      "path": "pets/:id", "children": [{"path": "edit", "component": "PetEditComponent"}, {
        "path": "visits/add", "component": "VisitAddComponent"
      }]
    }],
    "kind": "module"
  }, {
    "name": "visitRoutes",
    "filename": "src/app/visits/visits-routing.module.ts",
    "module": "VisitsRoutingModule",
    "children": [{"path": "visits", "component": "VisitListComponent"}, {
      "path": "visits/add", "component": "VisitAddComponent"
    }, {"path": "visits/:id/edit", "component": "VisitEditComponent"}],
    "kind": "module"
  }, {
    "name": "pettypesRoutes",
    "filename": "src/app/pettypes/pettypes-routing.module.ts",
    "module": "PettypesRoutingModule",
    "children": [{"path": "pettypes", "component": "PettypeListComponent"}, {
      "path": "pettypes/add", "component": "PettypeAddComponent"
    }, {"path": "pettypes/:id/edit", "component": "PettypeEditComponent"}],
    "kind": "module"
  }, {
    "name": "specialtyRoutes",
    "filename": "src/app/specialties/specialties-routing.module.ts",
    "module": "SpecialtiesRoutingModule",
    "children": [{"path": "specialties", "component": "SpecialtyListComponent"}, {
      "path": "specialties/:id/edit", "component": "SpecialtyEditComponent"
    }],
    "kind": "module"
  }, {
    "name": "vetRoutes",
    "filename": "src/app/vets/vets-routing.module.ts",
    "module": "VetsRoutingModule",
    "children": [{"path": "vets", "component": "VetListComponent"}, {
      "path": "vets/add", "component": "VetAddComponent"
    }, {
      "path": "vets/:id/edit",
      "component": "VetEditComponent",
      "resolve": {"vet": "VetResolver", "specs": "SpecResolver"}
    }],
    "kind": "module"
  }, {
    "name": "searchRoutes",
    "filename": "src/app/search/search-routing.module.ts",
    "module": "SearchRoutingModule",
    "children": [{"path": "search", "component": "SearchComponent"}],
    "kind": "module"
  }]
}
