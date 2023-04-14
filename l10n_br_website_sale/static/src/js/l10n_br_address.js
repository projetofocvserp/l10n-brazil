/* eslint no-unused-vars: "off", no-undef: "off" */

odoo.define("l10n_br_website_sale.l10n_br_address", function (require) {
    "use strict";

    require("web.dom_ready");
    var ajax = require("web.ajax");

    var $checkout_autoformat_selector = $(".checkout_autoformat");

    if (!$checkout_autoformat_selector.length) {
        return $.Deferred().reject("DOM doesn't contain '.checkout_autoformat'");
    }
    // AX4B - FOCVS - ECOM_001- Tela de cadastro Pessoa física/Jurídica
    $('#input_cnpj_cpf').keyup(function() {
        if ($('#input_cnpj_cpf').val().replace(/\D/g,'').length <= 11) {
            var cpf = $(this).val().replace(/\D/g, '');
            cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
            cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
            cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            $(this).val(cpf);
        } else {
            var cnpj = $(this).val().replace(/\D/g, '');
            cnpj = cnpj.replace(/^(\d{2})(\d)/, '$1.$2');
            cnpj = cnpj.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
            cnpj = cnpj.replace(/\.(\d{3})(\d)/, '.$1/$2');
            cnpj = cnpj.replace(/(\d{4})(\d)/, '$1-$2');
            $(this).val(cnpj);
        }; 
    });

    $("#radioCompany").click( function() {
        $("#id_cpf").text("CNPJ");
        $("#id_name").text("Razão Social");
        $("#div_inscr_est").show();
        $("#div_mobile").show();
    });

    $("#radioPerson").click( function() {
        $("#id_cpf").text("CPF");
        $("#id_name").text("Nome Completo");
        $("#div_mobile").hide(), 100;
        $("#div_inscr_est").hide(), 100;
    });

    $("#div_inscr_est").hide();
    $("#div_mobile").hide();
    $("#id_name").text("Nome Completo");
    
    $(document).ready(function() {
        if(!$('input[name="company_type"]:checked').length) {        
            $('input[name="company_type"][value="person"]').prop('checked', true);        
        }
    });

    // AX4B - FOCVS - ECOM_001- Tela de cadastro Pessoa física/Jurídica
    var zip_cleave = new Cleave(".input-zipcode", {
        blocks: [5, 3],
        delimiter: "-",
        numericOnly: true,
    });

    if ($checkout_autoformat_selector.length) {
        $checkout_autoformat_selector.on(
            "change",
            "select[name='country_id']",
            function () {
                var country_id = $("select[name='country_id']") || false;
                if (country_id) {
                    if (country_id.val() === 31) {
                        $("input[name='city']").parent("div").hide();
                        $("select[name='city_id']").parent("div").show();
                    } else {
                        $("select[name='city_id']").parent("div").hide();
                        $("input[name='city']").parent("div").show();
                    }
                }
            }
        );
        $checkout_autoformat_selector.on(
            "change",
            "select[name='state_id']",
            function () {
                var state_id_selector = $("#state_id");
                if (!state_id_selector.val()) {
                    return;
                }
                ajax.jsonRpc(
                    "/shop/state_infos/" + state_id_selector.val(),
                    "call"
                ).then(function (data) {
                    // Populate states and display
                    var city_id_selector = $("select[name='city_id']");
                    var selectCities = city_id_selector;
                    var zip_city = city_id_selector[0].val;
                    // Dont reload state at first loading (done in qweb)
                    if (
                        selectCities.data("init") === 0 ||
                        selectCities.find("option").length === 1
                    ) {
                        if (data.cities.length) {
                            _.each(data.cities, function (x) {
                                var opt = $("<option>")
                                    .text(x[1])
                                    .attr("value", x[0])
                                    .attr("data-code", x[2]);
                                selectCities.append(opt);
                            });
                            selectCities.parent("div").show();
                            $("input[name='city']").parent("div").hide();
                            city_id_selector.val(zip_city);
                        } else {
                            selectCities.val("").parent("div").hide();
                            $("input[name='city']").parent("div").show();
                        }
                        selectCities.data("init", 0);
                    } else {
                        selectCities.data("init", 0);
                    }
                });
            }
        );
        $checkout_autoformat_selector.on("change", "input[name='zip']", function () {
            var vals = {zipcode: $('input[name="zip"]').val()};
            console.log("Changing ZIP");
            $('a:contains("Next")').attr("display: none !important;");
            ajax.jsonRpc("/l10n_br/zip_search_public", "call", vals).then(function (
                data
            ) {
                if (data.error) {
                    // Todo: Retornar nos campos error e error_message
                    console.log("Falha ao consultar cep");
                } else {
                    var city_id_selector = $('select[name="city_id"]');
                    var state_id_selector = $('select[name="state_id"]');
                    $('input[name="district"]').val(data.district);
                    $('input[name="street_name"]').val(data.street_name);
                    city_id_selector.val(data.city_id);
                    city_id_selector.change();
                    city_id_selector[0].val = data.city_id;
                    state_id_selector.val(data.state_id);
                    state_id_selector.change();
                    $('a:contains("Next")').attr("display: block !important;");
                }
            });
        });
    }
});
