namespace com.deloitte.mdg.cost.center;

using { cuid, managed } from '@sap/cds/common';

@assert.range
type RequestStatus : String enum {
  Draft;
  Submitted;
  Cancelled;
  Error;
  Rejected;
  Approved;
}
@assert.range
type WorkflowStatus : String enum {
  NotStarted;
  InApproval;
  Completed;
  Rejected;
}

type RequestType : String enum {
  Create;
  Change;
  Extend;
}

entity CostCenterRequests : managed {
  key requestId      : String(11);
      requestType    : RequestType;
      workflowStatus : WorkflowStatus;
      requestStatus  : RequestStatus;
      controllingArea: String(4);
      costCenter     : String(10);
      validFrom      : Date;
      createdByName  : String(80);
      costCenterData : Composition of one CostCenterBasicData
                          on costCenterData.request = $self;
}

entity CostCenterBasicData: cuid {
  key ID                 : UUID;
      name               : String(100);
      description        : String(255);
      userResponsible    : String(50);
      personResponsible  : String(50);
      department         : String(50);
      costCenterCategory : String(50);
      hierarchyArea      : String(50);
      companyCode        : String(10);
      businessArea       : String(10);
      currency           : String(3);
      profitCenter       : String(10);
  key request             : Association to CostCenterRequests;
}
