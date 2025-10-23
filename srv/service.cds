using com.deloitte.mdg.cost.center as db from '../db/data-model';

service CostCenterService {
  entity CostCenterRequests as projection on db.CostCenterRequests;
  entity CostCenterBasicData as projection on db.CostCenterBasicData;
}