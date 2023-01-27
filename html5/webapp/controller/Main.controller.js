sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "legacy/mediopago/utils/Formatter",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.m.MessageToast} MessageToast
     */
    function (Controller, MessageToast, JSONModel, Formatter,MessageBox) {
        "use strict";

        return Controller.extend("legacy.mediopago.controller.Main", {

            formatter: Formatter,
            onInit: function () {

            },
            onSave: function () {
                if (!this._requiredFieldsCompleted()){
                    MessageBox.error("Debe completar todos los campos");
                    return;
                } 

                var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "YYYYMMdd" });
                this.byId("estadoPagoList").setVisible(false)

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

                            var oJsonModel2 = [{
                                message: "Pedido Desbloqueado en SAP",
                                severity: "success"
                            }, {
                                message: "Pedido Activado en Salesforce",
                                severity: "failed"
                            },
                            {
                                message: "Pedido Activado en Portal",
                                severity: "success"
                            }]
                            var oModel = new JSONModel(oJsonModel);
                            that.getView().setModel(oModel, "estados");
                            that.byId("estadoPagoList").setVisible(true)
                        }, error: function (e) {
                            console.log(e)
                            var errorMessage = e["responseText"];
                            var errorMessageObject = JSON.parse(errorMessage);
                            console.log(errorMessageObject)
                            MessageToast.show(errorMessageObject.error.message.value);
                        }

                    }

                )
            },
            _requiredFieldsCompleted: function () {

                return (
                    this.byId("orgVenta").getValue().length &&		//Validate client entry
                    this.byId("docVenta").getValue().length &&
                    this.byId("idPago").getValue().length   &&
                    this.byId("fechaPago").getValue().length                  		//Validate range of dates
                );
            },
        })
    })
