var TODO = {

    APP_XHR: null,
    AJAX_CONTENT_HOLDER: "#ajax-content",
    AJAX_LOADER: "#ajax-loader",
    APP_URL_ROOT: "",

    loadIframe: function (url, placeholder) {
        var iframe = '<iframe class="iframe span12" style="overflow:hidden;" src="' + this.APP_URL_ROOT + url + '"></iframe>';
        $(placeholder).html(iframe);
        var h = $(window).height();
        $('.iframe').css('height', h - 70);
    },
    selectMenu: function (id, action) {
        // remove class from current
        $(id + ' li').removeClass('active');
        // add class in the action
        $(id + ' a[href=#' + action + ']').parent().addClass('active');
    },

    getFullPath: function (action) {
        var url = this.APP_URL_ROOT + action;
        return url;
    },
    loadContents: function (contents) {
        $(this.AJAX_CONTENT_HOLDER).html(contents);
    },
    loadContentHolder: function (contents, holder) {
        $(holder).html(contents);
    },
    ajax_start: function () {
        //$(this.AJAX_LOADER).show();
        $('button[type=submit]').attr('disabled', true);
    },
    ajax_stop: function () {
        $(this.AJAX_LOADER).hide();
        $('button[type=submit]').attr('disabled', false);
    },
    ajax_error: function (status, errorThrown) {
        this.ajax_stop();
        // console.log("Status: " + status + ".\n" + errorThrown);
        if (status == 403) {
            toastr.warning("Sorry! not authorize");
            return;
        } else if (status == 404) {
            toastr.options = {
                "closeButton": true,
                "debug": false,
                "positionClass": "toast-bottom-right",
            };
            toastr.info("Sorry! required info not found");
            return;
        }
        else if(status == 500){
            toastr.error("Sorry! Technical error occurred");
            return;
        }
        else {
            console.debug("Status: " + status + ".\n" + errorThrown);
        }
    },

    ajaxRequestModelAction: function (params) {
        var url = this.getFullPath(params);
        this.ajaxLoad(url, this.AJAX_CONTENT_HOLDER);
    },

    ajaxLoad: function (url, placeholder) {
        if (this.APP_XHR)
            this.APP_XHR.abort();
        this.APP_XHR = $.ajax({
            url: url,
            beforeSend: function (XMLHttpRequest) {
                TODO.ajax_start();
            },
            success: function (data, textStatus, jqXHR) {
                $(placeholder).html(data);
                TODO.ajax_stop();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                TODO.ajax_error(jqXHR.status, errorThrown);
            }
        });
    },

    ajaxLoadWithRequestData: function (url, data, placeholder) {
        if (this.APP_XHR)
            this.APP_XHR.abort();
        this.APP_XHR = $.ajax({
            url: url,
            data: data,
            beforeSend: function (XMLHttpRequest) {
                TODO.ajax_start();
            },
            success: function (response, textStatus, jqXHR) {
                $(placeholder).html(response);
                TODO.ajax_stop();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                TODO.ajax_error(jqXHR.status, errorThrown);
            }
        });
    },

    ajaxLoadCallback: function (url, callback) {
        url = this.APP_URL_ROOT + url;
        if (this.APP_XHR)
            this.APP_XHR.abort();
        this.APP_XHR = $.ajax({
            url: url,
            beforeSend: function (XMLHttpRequest) {
                TODO.ajax_start();
            },
            success: function (data, textStatus, jqXHR) {
                callback(data);
                TODO.ajax_stop();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                TODO.ajax_error(jqXHR.status, errorThrown);
            }
        });
    },

    ajaxSubmitData: function (url, data) {
        url = this.APP_URL_ROOT + url;
        if (this.APP_XHR)
            this.APP_XHR.abort();
        this.APP_XHR = $.ajax({
            async: true,
            type: "POST",
            url: url,
            data: data,
            beforeSend: function (jqXHR) {
                TODO.ajax_start();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                TODO.ajax_error(jqXHR.status, errorThrown);
            },
            success: function (response, textStatus) {
                TODO.ajax_stop();
                TODO.loadContents(response);
            }
        });
    },
    ajaxSubmitDataCallback: function (url, data, datatype, callback) {
        url = this.APP_URL_ROOT + url;
        if (this.APP_XHR)
            this.APP_XHR.abort();
        this.APP_XHR = $.ajax({
            //async: false,
            type: "POST",
            url: url,
            dataType: datatype,
            data: data,
            cache: true,
            beforeSend: function (jqXHR) {
                TODO.ajax_start();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                TODO.ajax_error(jqXHR.status, errorThrown);
            },
            success: function (response, textStatus) {
                TODO.ajax_stop();
                callback(response);
            }
        });
    },
    ajaxSubmitAsyncDataCallback: function (url, data, datatype, callback) {
        url = this.APP_URL_ROOT + url;
        if (this.APP_XHR)
            this.APP_XHR.abort();
        this.APP_XHR = $.ajax({
            async: true,
            type: "POST",
            url: url,
            dataType: datatype,
            data: data,
            cache: true,
            beforeSend: function (jqXHR) {
                TODO.ajax_start();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                TODO.ajax_error(jqXHR.status, errorThrown);
            },
            success: function (response, textStatus) {
                TODO.ajax_stop();
                callback(response);
            }
        });
    },
    ajaxSubmitAsyncDataCallbackWithoutAbrot: function (url, data, datatype, callback) {
        url = this.APP_URL_ROOT + url;
        this.APP_XHR = $.ajax({
            async: true,
            type: "POST",
            url: url,
            dataType: datatype,
            data: data,
            cache: true,
            beforeSend: function (jqXHR) {
                TODO.ajax_start();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                TODO.ajax_error(jqXHR.status, errorThrown);
            },
            success: function (response, textStatus) {
                TODO.ajax_stop();
                callback(response);
            }
        });
    },
    ajaxSubmitDataCallbackError: function (url, data, datatype, callback, callbackerror) {
        url = this.APP_URL_ROOT + url;
        if (this.APP_XHR)
            this.APP_XHR.abort();
        this.APP_XHR = $.ajax({
            async: true,
            type: "POST",
            url: url,
            dataType: datatype,
            data: data,
            beforeSend: function (jqXHR) {
                TODO.ajax_start();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                callbackerror(errorThrown);
                TODO.ajax_error(jqXHR.status, errorThrown);
            },
            success: function (response, textStatus) {
                TODO.ajax_stop();
                callback(response);
            }
        });
    },
    ajaxLogin: function (data) {
        var url = this.APP_URL_ROOT + 'ajaxlogin';
        if (this.APP_XHR)
            this.APP_XHR.abort();
        this.APP_XHR = $.ajax({
            async: true,
            type: "POST",
            url: url,
            data: data,
            beforeSend: function (XMLHttpRequest) {
                $('#login-loader').show();
                $('#login-error').hide();
            },
            success: function (response, textStatus, jqXHR) {
                $('#login-loader').hide();
                var flg = JSON.parse(response);
                if (flg.login) {
                    $('#loginModal').modal('hide');
                } else {
                    $('#login-error').show();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $('#login-loader').hide();
                TODO.ajax_error(jqXHR.status, errorThrown);
            }
        });
    },

    ajaxDeleteRecordAction: function (action) {
        if (confirm('Are you sure you want to delete record from the database?')) {
            this.ajaxRequestModelAction(action);
        }
    },
    ajaxDeleteRecordCallback: function (action) {
        if (confirm('Are you sure you want to delete record from the database?')) {
            var url = this.APP_URL_ROOT + action;
            if (this.APP_XHR)
                this.APP_XHR.abort();
            this.APP_XHR = $.ajax({
                url: url,
                beforeSend: function (XMLHttpRequest) {
                    TODO.ajax_start();
                },
                success: function (data, textStatus, jqXHR) {
                    if (data == 1) {
                        alert("Record has been deleted");
                        location.reload();
                    }
                    else {
                        alert("Error occurred");
                    }
                    TODO.ajax_stop();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    TODO.ajax_error(jqXHR.status, errorThrown);
                }
            });
        }
    },
    ajaxDeleteRecord: function (url, placeholder) {
        if (confirm('Are you sure you want to delete record from the database?')) {
            this.ajaxLoad(url, placeholder);
        }
    },
    refreshDataTable: function (tableId, refreshUrl) {
        $.getJSON(refreshUrl, null, function (json) {
            var table = $(tableId).dataTable();
            var oSettings = table.fnSettings();

            table.fnClearTable(this);

            for (var i = 0; i < json.aaData.length; i++) {
                table.oApi._fnAddData(oSettings, json.aaData[i]);
            }

            oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
            table.fnDraw();
        });
    },

    zeroFill: function (number, width) {
        width -= number.toString().length;
        if (width > 0) {
            return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
        }
        return number + "";
    },
    reloadTableData: function (tableId) {
        $('#' + tableId).dataTable()._fnAjaxUpdate();
    },

    TODO_dropdown: function (placeholder, data, empty_text) {
        // Data: id->value
        $(placeholder).empty();
        var options = "<option value=\"0\">" + empty_text + "</option>";
        $.each(data, function (i, v) {
            options += "<option value=\"" + v + "\">" + v + "</option>";
        });
        $(placeholder).append(options);
    },
    TODO_dropdown_map: function (placeholder, data, empty_text, selected_value) {
        // Data: id->value
        $(placeholder).empty();
        var options = "";
        if (empty_text != '')
            options = "<option value=\"0\">" + empty_text + "</option>";

        $.each(data, function (i, v) {
            options += "<option value=\"" + i + "\" " + (i == selected_value ? "selected='selected'" : '') + ">" + v + "</option>";
        });
        if (selected_value != "") {
            $(placeholder).val(selected_value);
        }
        $(placeholder).append(options);
    },

    clearTODOForm: function (form_id) {
        $(':input', '#' + form_id)
            .not(':button, :submit, :reset') // removed :hidden
            .val('')
            .removeAttr('checked')
            .removeAttr('selected');
    },
    TODO_dropdown_map_with_title: function (placeholder, data, empty_text, selected_value,configuration) {
        // Data: id->value
        // configuration should be an object. required parameters:
        //  key:  data property name will be used for select option val
        // value: data property name will be used in select option text
        // title : data property name will be used in tootip title
        if(TODO.isEmpty(configuration.key) || TODO.isEmpty(configuration.value) || TODO.isEmpty(configuration.title)){
            toastr.error('Configuration mismatch');
            return ;
        }
        $(placeholder).empty();
        var options = "";
        if (empty_text != '')
            options = "<option value=\"0\" title='"+empty_text+"'>" + empty_text + "</option>";

        $.each(data, function (i, v) {
            if(TODO.isEmpty(v[configuration.key]) || TODO.isEmpty(v[configuration.value])){
                console.log('index '+ i +' configuration problem');
                return;
            }
            options += "<option title='"+v[configuration.title]+"' value=\"" + v[configuration.key] + "\" " + (v[configuration.key] == selected_value ? "selected='selected'" : '') + ">" + v[configuration.value]+ "</option>";
        });
        if (selected_value != "") {
            $(placeholder).val(selected_value);
        }
        $(placeholder).append(options);

        $(placeholder).select2({
            formatResult : function(item) {
                return $('<div>', {title: item.element[0].title}).text(item.text);
            },
        });
        $(placeholder).on('select2-open',function(){
            jQuery(".select2-result-label>div").tooltip({'placement':'bottom'});
        });
    },
    isEmpty: function(value){
        if(typeof(value) == 'undefined' || value == '' || value == null ||  value == 0){
            return true;
        }
        return false;
    },
};

