sap.ui.define([], function () {
	"use strict";
	return {
		severity: function (sStatus) {
			switch (sStatus) {
				case "success":
					return "Success";
				default:
					return sStatus;
			}
		}
	};
});
