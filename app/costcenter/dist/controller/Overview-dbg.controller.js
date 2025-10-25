sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/FilterType",
    "sap/m/Token",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/export/Spreadsheet",
    "com/deloitte/mdg/cost/center/costcenter/model/formatter"
], function (Controller, Fragment, Filter, FilterOperator, FilterType, Token, MessageBox, JSONModel, Spreadsheet, formatter) {
    "use strict";

    return Controller.extend("com.deloitte.mdg.cost.center.costcenter.controller.Overview", {

        formatter: formatter,

        onInit: function () {
            this._oModel = this.getView().getModel("costCenterModel");

            // Add Current User token to CreatedBy filter on first render
            this._addCurrentUserToken();
        },

        /**
         * Add Current User token to CreatedBy filter
         */
        _addCurrentUserToken: function () {
            var oFilterBar = this.byId("filterbar");
            var oCreatedByInput = this.byId("createdBy");
            var sCurrentUser = this.getOwnerComponent().getModel("userInfo")?.getProperty("/email");

            if (sCurrentUser) {
                oCreatedByInput.addToken(new Token({ text: sCurrentUser }));
            }

            // Optional: auto-trigger initial search
            // oFilterBar.fireSearch();
        },

        /**
         * Filter the table based on FilterBar inputs
         */
        onGo: function () {
            var oTable = this.byId("Overview_Table");
            var oBinding = oTable.getBinding("items");
            var aFilters = [];

            // Request ID
            var sReqId = this.byId("requestId").getValue();
            if (sReqId) {
                aFilters.push(new Filter("requestId", FilterOperator.Contains, sReqId));
            }

            // Request Type
            var sReqType = this.byId("requestType").getSelectedKey();
            if (sReqType) {
                aFilters.push(new Filter("requestType", FilterOperator.EQ, sReqType));
            }

            // Workflow Status
            var sWFStatus = this.byId("workflowStatus").getSelectedKey();
            if (sWFStatus) {
                aFilters.push(new Filter("workflowStatus", FilterOperator.EQ, sWFStatus));
            }

            // Created By (MultiInput tokens)
            var oCreatedBy = this.byId("createdBy");
            var aTokens = oCreatedBy.getTokens();
            if (aTokens.length > 0) {
                var aCreatedByFilters = aTokens.map(function (token) {
                    return new Filter("createdByName", FilterOperator.Contains, token.getText());
                });
                aFilters.push(new Filter({ filters: aCreatedByFilters, and: false }));
            }

            // Apply filters
            oBinding.filter(aFilters, FilterType.Application);
        },

        /**
         * Clear FilterBar inputs
         */
        onClear: function () {
            this.byId("requestId").setValue("");
            this.byId("requestType").setSelectedKey("");
            this.byId("workflowStatus").setSelectedKey("");
            var oCreatedBy = this.byId("createdBy");
            oCreatedBy.destroyTokens();
        },

        /**
         * Handle table row click
         */
        onRequestPress: function (oEvent) {
            var oCtx = oEvent.getSource().getBindingContext("costCenterModel");
            var sReqId = oCtx.getProperty("requestId");
            MessageBox.information("Request ID: " + sReqId);
        },

        /**
         * Button actions
         */
        onCreatePress: function () {
            MessageBox.information("Create Cost Center triggered.");
        },

        onChangeExtendPress: function () {
            MessageBox.information("Change/Extend Cost Center triggered.");
        },

        /**
         * Optional hook for table updates
         */
        onUpdateStarted: function () {
            // Can be used to show busy indicator
        },

        /**
         * Table selection change
         */
        onRequestSelectionChange: function (oEvent) {
            var oItem = oEvent.getParameter("listItem");
            if (!oItem) return;
            var oCtx = oItem.getBindingContext("costCenterModel");
            console.log("Selected Request:", oCtx.getProperty("requestId"));
        },

        /**
         * Export table data to Excel
         */
        onExport: function () {
            var oTable = this.byId("Overview_Table");
            var aItems = oTable.getBinding("items").getCurrentContexts().map(ctx => ctx.getObject());

            if (!aItems || aItems.length === 0) {
                MessageBox.warning("No data to export.");
                return;
            }

            var aExportData = aItems.map(item => ({
                "Request ID": item.requestId,
                "Request Type": item.requestType,
                "Workflow Status": item.workflowStatus,
                "Created On": item.createdAt,
                "Created By": item.createdByName
            }));

            var oSettings = {
                workbook: { columns: [
                    { label: 'Request ID', property: 'Request ID' },
                    { label: 'Request Type', property: 'Request Type' },
                    { label: 'Workflow Status', property: 'Workflow Status' },
                    { label: 'Created On', property: 'Created On' },
                    { label: 'Created By', property: 'Created By' }
                ]},
                dataSource: aExportData,
                fileName: "CostCenterRequests.xlsx"
            };

            var oSheet = new Spreadsheet(oSettings);
            oSheet.build().finally(() => { oSheet.destroy(); });
        }

    });
});
