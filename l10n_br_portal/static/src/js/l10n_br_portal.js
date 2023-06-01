/* eslint no-unused-vars: "off", no-undef: "off" */

odoo.define("l10n_br_portal.l10n_br_portal", function (require) {
    "use strict";

    require("web.dom_ready");
    var ajax = require("web.ajax");

    if (!$(".o_portal").length) {
        return $.Deferred().reject("DOM doesn't contain '.o_portal'");
    }

    document.querySelector(".input-cnpj-cpf").addEventListener("input", function (e) {
        var input = e.target,
            value = input.value.replace(/\D/g, ""),
            newValue = "";

        if (value.length <= 11) {
            // 539.211.430-04 Mock data
            newValue += value.slice(0, 3);
            newValue += value.slice(3, 6) ? "." + value.slice(3, 6) : "";
            newValue += value.slice(6, 9) ? "." + value.slice(6, 9) : "";
            newValue += value.slice(9, 11) ? "-" + value.slice(9, 11) : "";
            input.style.backgroundColor = "#ffebb463";
        } else {
            // 75.676.430/0001-27 Mock data
            newValue += value.slice(0, 2);
            newValue += value.slice(2, 5) ? "." + value.slice(2, 5) : "";
            newValue += value.slice(5, 8) ? "." + value.slice(5, 8) : "";
            newValue += value.slice(8, 12) ? "/" + value.slice(8, 12) : "";
            newValue += value.slice(12, 14) ? "-" + value.slice(12, 14) : "";
            input.style.backgroundColor = "#ffebb48e";
        }

        input.value = newValue;
    });

    var cleaveZipCode = new Cleave(".input-zipcode", {
        blocks: [5, 3],
        delimiter: "-",
        numericOnly: true,
    });

    var cleaveZipCode = new Cleave(".input-zipcode", {
        blocks: [5, 3],
        delimiter: "-",
        numericOnly: true,
    });

    if ($(".o_portal_details").length) {
        var state_options = $("select[name='city_id']:enabled option:not(:first)");
        $(".o_portal_details").on("change", "select[name='state_id']", function () {
            var select = $("select[name='city_id']");
            state_options.detach();
            var displayed_state = state_options.filter(
                "[data-state_id=" + ($(this).val() || 0) + "]"
            );
            var nb = displayed_state.appendTo(select).show().length;
            select.parent().toggle(nb >= 1);
        });
        $(".o_portal_details").find("select[name='state_id']").change();
        $(".o_portal_details").on("change", "input[name='zipcode']", function () {
            var vals = {zipcode: $('input[name="zipcode"]').val()};
            console.log("Changing ZIP");
            ajax.jsonRpc("/l10n_br/zip_search", "call", vals).then(function (data) {
                if (data.error) {
                    // TODO: Retornar nos campos error e error_message
                    console.log("Falha ao consultar cep");
                } else {
                    $('input[name="district"]').val(data.district);
                    $('input[name="street_name"]').val(data.street_name);
                    $('select[name="country_id"]').val(data.country_id);
                    $('select[name="country_id"]').change();
                    $('select[name="state_id"]').val(data.state_id);
                    $('select[name="state_id"]').change();
                    $('select[name="city_id"]').val(data.city_id);
                }
            });
        });
    }
});
