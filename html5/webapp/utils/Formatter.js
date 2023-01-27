sap.ui.define([], function () {
	"use strict";
	return {
		severity: function (sStatus) {
			switch (sStatus) {
				case "success":
					return "Success";
				case "error":
					return "Error";
				default:
					return sStatus;
			}
		},
		severityIcon: function (sStatus) {
			switch (sStatus) {
				case "success":
					return "sap-icon://sys-enter-2";
				case "failed":
					return "sap-icon://error";
				default:
					return sStatus;
			}
		}
	};
});
