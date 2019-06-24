sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/FilterType",
    "sap/ui/core/Fragment"
], function (Controller, JSONModel, Filter, FilterOperator, FilterType, Fragment) {
	"use strict";

	return Controller.extend("sap.ui.core.tutorial.odatav4.controller.App", {

		/**
		 *  Hook for initializing the controller
		 */
		onInit : function () {
			var oJSONData = {
				busy : false
			};
			var oModel = new JSONModel(oJSONData);
            this.getView().setModel(oModel, "appView");

            var oView = this.getView();

            var bSel = oView.byId("rbFail").getSelected();
            var oPl = oView.byId("peopleList");

            if (bSel) {
                var andFilter = [];
                andFilter.push(new Filter("Status", FilterOperator.NE, "0"));
                andFilter.push(new Filter("Type", FilterOperator.EQ, "0"));
                andFilter.push(new Filter("Text", FilterOperator.Contains, "0x0"));
                oView.byId("peopleList").getBinding("items").filter(andFilter, FilterType.Application);
            } else {
                var andFilter = [];
                andFilter.push(new Filter("Status", FilterOperator.EQ, "0"));
                andFilter.push(new Filter("Type", FilterOperator.EQ, "0"));
                oView.byId("peopleList").getBinding("items").filter(andFilter, FilterType.Application);
            };

            

        },


        onPress: function (e) {
            var oView = this.getView();

            //current object on the list where button is pressed
            var oContract = e.getSource().getBindingContext().getObject();
       
            // create dialog lazily
            if (!this.byId("contractDetailsDialog")) {
                // load asynchronous XML fragment
                Fragment.load({
                    id: oView.getId(),
                    name: "sap.ui.core.tutorial.odatav4.view.ContractDetailsDialog",
                    controller: this
                }).then(function (oDialog) {

                    // connect dialog to the root view of this component (models, lifecycle)
                    oView.addDependent(oDialog);                    
                    oDialog.open();
                    
                    var oFilter = new Filter("LegId", FilterOperator.EQ, oContract.LegId)
                    oView.byId("contractDetailsList").getBinding("items").filter(oFilter, FilterType.Application);

                });
            } else {
                this.byId("contractDetailsDialog").open();
                var oFilter = new Filter("LegId", FilterOperator.EQ, oContract.LegId)
                oView.byId("contractDetailsList").getBinding("items").filter(oFilter, FilterType.Application);
            }
        },
        onCloseDialog: function () {
            this.byId("contractDetailsDialog").close();
        },

        onShowXML: function (e) {
            var oView = this.getView();
            var oItems = oView.byId("contractDetailsList");
            var oItem = oItems.getItems()[0].getBindingContext().getObject();

            var xmlData = oItems.getItems()[0].data();
         //   alert(xmlData.Xmlgen);
             
            var FileSaver = require('file-saver');
            var blob = new Blob(xmlData.Xmlgen, {type: "text/plain;charset=utf-8"});
            FileSaver.saveAs(blob, oItem.FileId);

        },


        onSearchId: function () {
            var oView = this.getView(),
                sValue = oView.byId("searchId").getValue(),
                oFilter = new Filter("Id", FilterOperator.Contains, sValue);

            oView.byId("peopleList").getBinding("items").filter(oFilter, FilterType.Application);
        },

        onSearchLegId: function (e) {
            var oView = this.getView(),
                sValue = oView.byId("searchLegId").getValue(),
                oFilter = new Filter("LegId", FilterOperator.Contains, sValue);

            oView.byId("peopleList").getBinding("items").filter(oFilter, FilterType.Application);
        },

        onCbChange: function(oEvent) {
            var oView = this.getView(),
                sValue = oView.byId("searchType").getValue();
            
            var sFilter;
            if (sValue == "Imported")
                sFilter = "0";
            else
                sFilter = "-1";

            var andFilter = [];
            andFilter.push(new Filter("Status", FilterOperator.EQ, sFilter));
           andFilter.push(new Filter("Type", FilterOperator.EQ, "0"));
       //     andFilter.push(new sap.ui.model.Filter(andFilter, false));
            oView.byId("peopleList").getBinding("items").filter(andFilter, FilterType.Application);

        },

        onSelect: function (oEvent) {
            var oView = this.getView(),
                bSelected = oView.byId("rbFail").getSelected();

            if (bSelected) {
                var andFilter = [];
                andFilter.push(new Filter("Status", FilterOperator.NE, "0"));
                andFilter.push(new Filter("Type", FilterOperator.EQ, "0"));
                //     andFilter.push(new sap.ui.model.Filter(andFilter, false));
                oView.byId("peopleList").getBinding("items").filter(andFilter, FilterType.Application);
            } else {

            }


        }


	});
});