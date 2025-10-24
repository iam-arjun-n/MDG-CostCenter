sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Filter",
    "sap/m/Token",
    "sap/ui/model/FilterType",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/export/Spreadsheet",
    "com/deloitte/mdg/cost/center/costcenter/model/formatter"
], function (Controller, Fragment, FilterOperator, Filter, Token, FilterType, MessageBox, JSONModel, Spreadsheet, formatter) {
    "use strict";

    return Controller.extend("com.deloitte.mdg.cost.center.costcenter.controller.Overview", {

        formatter: formatter,

        onInit: function () {
            this._oModel = this.getView().getModel("costCenterModel");
            
        },

        onGo: function () {
            const oTable = this.byId("Overview_Table");
            const oBinding = oTable.getBinding("items");
            const aFilters = [];

            const sReqId = this.byId("requestId").getValue();
            const sReqType = this.byId("requestType").getSelectedKey();
            const sWFStatus = this.byId("workflowStatus").getSelectedKey();
            const sCreatedBy = this.byId("createdBy").getValue();

            if (sReqId) {
                aFilters.push(new Filter("requestId", FilterOperator.Contains, sReqId));
            }
            if (sReqType) {
                aFilters.push(new Filter("requestType", FilterOperator.EQ, sReqType));
            }
            if (sWFStatus) {
                aFilters.push(new Filter("workflowStatus", FilterOperator.EQ, sWFStatus));
            }
            if (sCreatedBy) {
                aFilters.push(new Filter("createdByName", FilterOperator.Contains, sCreatedBy));
            }

            oBinding.filter(aFilters);
        },

        onRequestPress: function (oEvent) {
            const oCtx = oEvent.getSource().getBindingContext("costCenterModel");
            const sReqId = oCtx.getProperty("requestId");
            MessageBox.information("Request ID: " + sReqId);
        },

        onCreatePress: function () {
            MessageBox.information("Create Cost Center triggered.");
        },

        onChangeExtendPress: function () {
            MessageBox.information("Change/Extend Cost Center triggered.");
        },

        onUpdateStarted: function () {
            // Optional hook for growing table updates
        },

        onRequestSelectionChange: function (oEvent) {
            const oItem = oEvent.getParameter("listItem");
            const oCtx = oItem.getBindingContext("costCenterModel");
            console.log("Selected Request:", oCtx.getProperty("requestId"));
        }
    });
});
