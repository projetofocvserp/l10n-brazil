// odoo.define("l10n_br_website_sale.gabrielzinho", function (require) {
//     "use strict";

// var core = require('web.core');
// var config = require('web.config');
// var publicWidget = require('web.public.widget');
// var VariantMixin = require('sale.VariantMixin');
// var wSaleUtils = require('website_sale.utils');
// var _t = core._t;
// const wUtils = require('website.utils');
// require("web.zoomodoo");


//     publicWidget.registry.WebsiteSale = publicWidget.Widget.extend(VariantMixin, {
//         selector: ".oe_website_sale",
//         events: _.extend({}, VariantMixin.events || {}, {
//             "change #shipping_use_same": "_onChangeShippingUseSame",
//             "click #checkout_button": "_onCheckoutClick",
//         }),

//         /**
//          * @private
//          * @param {Event} ev
//          */
//         _onChangeShippingUseSame: function (ev) {
//             $(".ship_to_other").toggle(!$(ev.currentTarget).prop("checked"));
//         },

//         /**
//          * @private
//          * @param {Event} ev
//          */
//         _onCheckoutClick: function (ev) {
//             var checked = $("#shipping_use_same").prop("checked");
//             if (!checked) {
//                 window.location.href = "/shop/checkout/?express=1&step=address";
//                 ev.preventDefault();
//             }
//         },
//     });
// });
