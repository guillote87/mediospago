sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "legacy/mediopago/utils/Formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.m.MessageToast} MessageToast
     */
    function (Controller, MessageToast, JSONModel,Formatter) {
        "use strict";

        return Controller.extend("legacy.mediopago.controller.Main", {

            formatter: Formatter,
            onInit: function () {
        
            },
            onSave: function () {
                var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "YYYYMMdd" });


                var orgVenta = this.getView().byId("orgVenta").getValue();
                var docVenta = this.getView().byId("docVenta").getValue();
                var idPago = this.getView().byId("idPago").getValue();
                var fechaPago = dateFormat.format(this.getView().byId("fechaPago").getDateValue());
                var postData = {};
                postData.OrgVentas = orgVenta;
                postData.DocVentas = docVenta;
                postData.IdPago = idPago;
                postData.FechaPago = fechaPago

                var that = this

                this.getOwnerComponent().getModel().create("/autorizar_pagoSet", postData,
                    {
                        success: function (odata, oResponse) {
                            console.log(oResponse)
                            var hdrMessage = oResponse.headers["sap-message"];
                            var hdrMessageObject = JSON.parse(hdrMessage);

                            var oJsonModel = []
                            oJsonModel.push(hdrMessageObject)

                            for (var i = 0; i < hdrMessageObject.details.length; i++) {
                                oJsonModel.push(hdrMessageObject.details[i])
                            }

                           console.log(oJsonModel)
                            var oModel = new JSONModel(oJsonModel);
                            that.getView().setModel(oModel,"estados");
                            that.byId("estadoPagoList").setVisible(true)

                            MessageToast.show(hdrMessageObject.message);


                        }, error: function (e) {
                            MessageToast.show(e);
                        }

                    }
                   
                )
            }
        })
    })
