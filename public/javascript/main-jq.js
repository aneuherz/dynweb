$(function () {
    $('html').bind('keypress', function (e) {
        if (e.keyCode == 13) {
            return false;
        }
    });

    var users = [];
    var cookie = getCookie('username');

    $.get("index.js/" + cookie + "/users",
        function (data, status) {
            var parsed = JSON.parse(data);
            for (var i = 0; i < parsed.length; i++) {
                users.push(parsed[i]['username']);
            }
        });
    function split(val) {
        return val.split(/,\s*/);
    }

    function extractLast(term) {
        return split(term).pop();
    }

    //Event for focus and focus out for the adding of the group
    $("#addusers").focusout(function () {
        if (!$.trim($("#addusers").val())) {
            $("#addusers").val("...add users");
        }
    })
    $("#addusers").focus(function () {
        if ($("#addusers").val() == "...add users") {
            $("#addusers").val("");
        }
    })
    $("#addgroupname").focusout(function () {
        if (!$.trim($("#addgroupname").val())) {
            $("#addgroupname").val("...add groupname");
        }
    })
    $("#addgroupname").focus(function () {
        if ($("#addgroupname").val() == "...add groupname") {
            $("#addgroupname").val("");
        }
    })

    //Event Add Group To Database and Reload Group Items
    $("#bt-addgroup").click(function () {
        var gname = $.trim($("#addgroupname").val());
        var users = $("#addusers").val();

        $.post("index.js/addgroup",
            {
                createdby: cookie,
                groupname: gname,
                users: users.split(',')
            },
            function (post, data) {
                addToGroupList();
            });

        //To-Do aneuherz: Input Validation
        //To-Do aneuherz: Duplicate GroupName for user...
        //alert(gname+users);
        //addToGroupList();
    });

    $("#addusers")
    // don't navigate away from the field on tab when selecting an item
        .bind("keydown", function (event) {
            if (event.keyCode === $.ui.keyCode.TAB &&
                $(this).autocomplete("instance").menu.active) {
                event.preventDefault();
            }
        })
        .autocomplete({
            minLength: 0,
            source: function (request, response) {
                // delegate back to autocomplete, but extract the last term
                response($.ui.autocomplete.filter(
                    users, extractLast(request.term)));
            },
            focus: function () {
                // prevent value inserted on focus
                return false;
            },
            select: function (event, ui) {
                var terms = split(this.value);
                // remove the current input
                terms.pop();
                // add the selected item
                terms.push(ui.item.value);
                // add placeholder to get the comma-and-space at the end
                terms.push("");
                this.value = terms.join(", ");
                return false;
            }
        });
});
