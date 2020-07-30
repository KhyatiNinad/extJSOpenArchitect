var webpage = "";

function supportstorage() {

    if (typeof window.localStorage == 'object')

        return true;

    else

        return false;

}



function handleSaveLayout() {

    var e = $(".demo").html();

    if (!stopsave && e != window.demoHtml) {

        stopsave++;

        window.demoHtml = e;

        saveLayout();

        stopsave--;

    }

}



var layouthistory;

function saveLayout() {

    var data = layouthistory;

    if (!data) {

        data = {};

        data.count = 0;

        data.list = [];

    }

    if (data.list.length > data.count) {

        for (i = data.count; i < data.list.length; i++)

            data.list[i] = null;

    }

    data.list[data.count] = window.demoHtml;

    data.count++;

    if (supportstorage()) {

        localStorage.setItem("layoutdata", JSON.stringify(data));

    }

    layouthistory = data;

    //console.log(data);

    /*$.ajax({

                    type: "POST",

                    url: "/build/saveLayout",

                    data: { layout: $('.demo').html() },

                    success: function(data) {

                                    //updateButtonsVisibility();

                    }

    });*/

}



function downloadLayout() {



    $.ajax({

        type: "POST",

        url: "/build/downloadLayout",

        data: { layout: $('#download-layout').html() },

        success: function(data) { window.location.href = '/build/download'; }

    });

}



function downloadHtmlLayout() {

    $.ajax({

        type: "POST",

        url: "/build/downloadLayout",

        data: { layout: $('#download-layout').html() },

        success: function(data) { window.location.href = '/build/downloadHtml'; }

    });

}



function undoLayout() {

    var data = layouthistory;

    //console.log(data);

    if (data) {

        if (data.count < 2) return false;

        window.demoHtml = data.list[data.count - 2];

        data.count--;

        $('.demo').html(window.demoHtml);

        if (supportstorage()) {

            localStorage.setItem("layoutdata", JSON.stringify(data));

        }

        return true;

    }

    return false;

    /*$.ajax({

                    type: "POST",

                    url: "/build/getPreviousLayout",

                    data: { },

                    success: function(data) {

                                    undoOperation(data);

                    }

    });*/

}



function redoLayout() {

    var data = layouthistory;

    if (data) {

        if (data.list[data.count]) {

            window.demoHtml = data.list[data.count];

            data.count++;

            $('.demo').html(window.demoHtml);

            if (supportstorage()) {

                localStorage.setItem("layoutdata", JSON.stringify(data));

            }

            return true;

        }

    }

    return false;

    /*

    $.ajax({

                    type: "POST",

                    url: "/build/getPreviousLayout",

                    data: { },

                    success: function(data) {

                                    redoOperation(data);

                    }

    });*/

}



function handleJsIds() {

    handleModalIds();

    handleAccordionIds();

    handleCarouselIds();

    handleTabsIds();

}

function handleAccordionIds() {

    var e = $(".demo #myAccordion");

    var t = randomNumber();

    var n = "accordion-" + t;

    var r;

    e.attr("id", n);

    e.find(".accordion-group").each(function(e, t) {

        r = "accordion-element-" + randomNumber();

        $(t).find(".accordion-toggle").each(function(e, t) {

            $(t).attr("data-parent", "#" + n);

            $(t).attr("href", "#" + r);

        });

        $(t).find(".accordion-body").each(function(e, t) {

            $(t).attr("id", r);

        });

    });

}

function handleCarouselIds() {

    var e = $(".demo #myCarousel");

    var t = randomNumber();

    var n = "carousel-" + t;

    e.attr("id", n);

    e.find(".carousel-indicators li").each(function(e, t) {

        $(t).attr("data-target", "#" + n);

    });

    e.find(".left").attr("href", "#" + n);

    e.find(".right").attr("href", "#" + n);

}

function handleModalIds() {

    var e = $(".demo #myModalLink");

    var t = randomNumber();

    var n = "modal-container-" + t;

    var r = "modal-" + t;

    e.attr("id", r);

    e.attr("href", "#" + n);

    e.next().attr("id", n);

}

function handleTabsIds() {

    var e = $(".demo #myTabs");

    var t = randomNumber();

    var n = "tabs-" + t;

    e.attr("id", n);

    e.find(".tab-pane").each(function(e, t) {

        var n = $(t).attr("id");

        var r = "panel-" + randomNumber();

        $(t).attr("id", r);

        $(t).parent().parent().find("a[href=#" + n + "]").attr("href", "#" + r);

    });

}

function randomNumber() {

    return randomFromInterval(1, 1e6);

}

function randomFromInterval(e, t) {

    return Math.floor(Math.random() * (t - e + 1) + e);

}

function gridSystemGenerator() {

    $(".lyrow .preview input").bind("keyup", function() {

        var e = 0;

        var t = "";

        var n = $.trim($(this).val()).split(" ", 12);

        $.each(n, function(n, r) {

            e = e + parseInt(r);

            t += '<div class="col-lg-' + r + ' col-md-' + r + ' col-xs-' + r + ' column"></div>';

        });

        if (e == 12) {

            $(this).parent().next().children().html(t);

            $(this).parent().prev().prev().show();

        } else {

            $(this).parent().prev().prev().hide();

        }

    });

}

function configurationElm(e, t) {

    $(".demo").delegate(".configuration > a", "click", function(e) {

        e.preventDefault();

        var t = $(this).parent().next().next().children();

        $(this).toggleClass("active");

        t.toggleClass($(this).attr("rel"));

    });

    $(".demo").delegate(".configuration .dropdown-menu a", "click", function(e) {

        e.preventDefault();

        var t = $(this).parent().parent();

        var n = t.parent().parent().next().next().children();

        t.find("li").removeClass("active");

        $(this).parent().addClass("active");

        var r = "";

        t.find("a").each(function() {

            r += $(this).attr("rel") + " ";

        });

        t.parent().removeClass("open");

        n.removeClass(r);

        n.addClass($(this).attr("rel"));

    });

}

function removeElm() {

    $(".demo").delegate(".remove", "click", function(e) {

        e.preventDefault();

        $(this).parent().remove();

        if (!$(".demo .lyrow").length > 0) {

            //clearDemo();

        }

    });

}

function clearDemo() {

    $(".demo").empty();

    layouthistory = null;

    if (supportstorage())

        localStorage.removeItem("layoutdata");

}

function removeMenuClasses() {

    $("#menu-layoutit li button").removeClass("active");

}

function changeStructure(e, t) {

    $("#download-layout ." + e).removeClass(e).addClass(t);

}

function cleanHtml(e) {

    $(e).parent().append($(e).children().html());

}

function downloadLayoutSrc() {

    var e = "";

    $("#download-layout").children().html($(".demo").html());

    var t = $("#download-layout").children();

    t.find(".preview, .configuration, .drag, .remove, .template").remove();

    t.find(".lyrow").addClass("removeClean");

    t.find(".box-element").addClass("removeClean");

    t.find(".lyrow .lyrow .lyrow .lyrow .lyrow .lyrow .lyrow .lyrow .removeClean").each(function() {

        cleanHtml(this);

    });
    t.find(".lyrow .lyrow .lyrow .lyrow .lyrow .lyrow .lyrow .removeClean").each(function() {

        cleanHtml(this);

    });
    t.find(".lyrow .lyrow .lyrow .lyrow .lyrow .lyrow .removeClean").each(function() {

        cleanHtml(this);

    });

    t.find(".lyrow .lyrow .lyrow .lyrow .lyrow .removeClean").each(function() {

        cleanHtml(this);

    });

    t.find(".lyrow .lyrow .lyrow .lyrow .removeClean").each(function() {

        cleanHtml(this);

    });

    t.find(".lyrow .lyrow .lyrow .removeClean").each(function() {

        cleanHtml(this);

    });

    t.find(".lyrow .lyrow .removeClean").each(function() {

        cleanHtml(this);

    });

    t.find(".lyrow .removeClean").each(function() {

        cleanHtml(this);

    });

    t.find(".removeClean").each(function() {

        cleanHtml(this);

    });

    t.find(".removeClean").remove();

    $("#download-layout .column").removeClass("ui-sortable");

    $("#download-layout .row-fluid").removeClass("clearfix").children().removeClass("column");

    if ($("#download-layout .container").length > 0) {

        changeStructure("row-fluid", "row");

    }

    if ($("#download-layout .container-fluid").length > 0) {

        changeStructure("row", "row-fluid");

    }

    formatSrc = $.htmlClean($("#download-layout").html(), {

        format: true,

        allowedAttributes: [

            ["id"],

            ["class"],

            ["data-toggle"],

            ["data-target"],

            ["data-bind"],

            ["data-parent"],

            ["role"],

            ["data-role"],

            ["style"],

            ["data-dismiss"],

            ["aria-labelledby"],

            ["aria-hidden"],

            ["data-slide-to"],

            ["data-slide"]

        ],

        removeClasses: ["column", "droptarget"]



    });

    $("#download-layout").html(formatSrc);

    $("#downloadModal textarea").empty();

    $("#downloadModal textarea").val(formatSrc);

    webpage = formatSrc;

}



var currentDocument = null;

var timerSave = 1000;

var stopsave = 0;

var startdrag = 0;

var demoHtml = $(".demo").html();

var currenteditor = null;

$(window).resize(function() {

    //$("body").css("min-height", $(window).height() - 90);

    $(".changeDimension").css("max-height", $(window).height() - 260)

});



function restoreData() {

    if (supportstorage()) {

        layouthistory = JSON.parse(localStorage.getItem("layoutdata"));

        if (!layouthistory) return false;

        window.demoHtml = layouthistory.list[layouthistory.count - 1];

        if (window.demoHtml) $(".demo").html(window.demoHtml);

    }

}



function initContainer() {

    $(".demo, .demo .column, .demo .droptarget").sortable({

        connectWith: ".column",

        opacity: .35,

        handle: ".drag",

        start: function(e, t) {

            if (!startdrag) stopsave++;

            startdrag = 1;

        },

        stop: function(e, t) {

            if (stopsave > 0) stopsave--;

            startdrag = 0;

        }

    });

    $(".demo, .demo .column, .demo .droptarget").sortable({

        connectWith: ".droptarget",

        opacity: .35,

        handle: ".drag",

        start: function(e, t) {

            if (!startdrag) stopsave++;

            startdrag = 1;

        },

        stop: function(e, t) {

            if (stopsave > 0) stopsave--;

            startdrag = 0;

        }

    });

    configurationElm();

}

$(document).ready(function() {

    //    var element = document.getElementById('myElement');

    resizeSensor.create(
        $(".changeDimension")[0],
        function() {

            $("#containerWidth").text($(".changeDimension")[0].clientWidth);

        });



    var trigger = $('.hamburger'),

        overlay = $('.overlay'),

        isClosed = false;



    trigger.click(function() {

        hamburger_cross();

    });



    function hamburger_cross() {



        if (isClosed == true) {

            overlay.hide();

            trigger.removeClass('is-open');

            trigger.addClass('is-closed');

            isClosed = false;

        } else {

            overlay.show();

            trigger.removeClass('is-closed');

            trigger.addClass('is-open');

            isClosed = true;

        }

    }



    $('[data-toggle="offcanvas"]').click(function() {

        $('#wrapper').toggleClass('toggled');

    });



    var obj = [{

            "colCnt": "12",

            "title": "Full Width",

            "cols": [

                "12"

            ]

        },

        {

            "colCnt": "6 6",

            "title": "2 Column",

            "cols": [

                "6",

                "6"

            ]

        },

        {

            "colCnt": "4 4 4",

            "title": "3 Columns",

            "cols": [

                "4", "4", "4"

            ]

        },

        {

            "colCnt": "3 3 3 3",

            "title": "4 Column",

            "cols": [

                "3", "3", "3", "3"

            ]

        },

        {

            "colCnt": "9 3",

            "title": "2 Column - 1st Column Bigger",

            "cols": ["9", "3"

            ]

        },

        {

            "colCnt": "3 9",

            "title": "2 Column - 2nd Column Bigger",

            "cols": ["3", "9"

            ]

        },

    ];

    /*

        var template_html = $('#bootstrapTemplate').html();

        var template = kendo.template(template_html);



        var htmlBootstrap = kendo.render(template, obj);



        $("#estRows").append(htmlBootstrap);







        CKEDITOR.disableAutoInline = true;
    */
    restoreData();

    /*
    var contenthandle = CKEDITOR.replace('contenteditor', {

        language: 'en',

        contentsCss: ['../Content/bootstrap-combined.min.css'],

        allowedContent: true

    });

    var attrViewModel = new kendo.observable({

    });
*/
    //            $("body").css("min-height", $(window).height() - 90);

    var containers = modernClasses.global.items.filter(function(e) { return (e.extends == "Ext.Panel" || e.extends == "Ext.Container") && e.access !== 'private'; })
    console.log(containers);

    $(".changeDimension").css("max-height", $(window).height() - 260);

    $(".sidebar-nav .lyrow").draggable({

        connectToSortable: ".demo",

        helper: "clone",

        handle: ".drag",

        start: function(e, t) {

            if (!startdrag) stopsave++;

            startdrag = 1;

        },

        drag: function(e, t) {

            t.helper.width('100%');

        },

        stop: function(e, t) {

            initContainer();

            /*

            $(".demo .column").sortable({

                            opacity: .35,

                            connectWith: ".column",

                            start: function(e,t) {

                                            debugger;

                                            if (!startdrag) stopsave++;

                                            startdrag = 1;

                            },

                            stop: function(e,t) {

                                            if(stopsave>0) stopsave--;

                                            startdrag = 0;

                            }

            });

            $(".demo .droptarget").sortable({

                            opacity: .35,

                            connectWith: ".droptarget",

                            start: function (e, t) {

                                            if (!startdrag) stopsave++;

                                            startdrag = 1;

                            },

                            stop: function (e, t) {

                                            if (stopsave > 0) stopsave--;

                                            startdrag = 0;

                            }

            });

            */



            if (stopsave > 0) stopsave--;

            startdrag = 0;

        }

    });

    $(".sidebar-nav .box").draggable({

        connectToSortable: ".demo",

        helper: "clone",

        handle: ".drag",

        start: function(e, t) {

            if (!startdrag) stopsave++;

            startdrag = 1;

        },

        drag: function(e, t) {

            t.helper.width('100%');

        },

        stop: function() {

            initContainer();

            handleJsIds();

            if (stopsave > 0) stopsave--;

            startdrag = 0;

        }

    });

    initContainer();

    /*
    $('body.edit .demo').on("click", "[data-target=#editorModal]", function(e) {

        e.preventDefault();

        currenteditor = $(this).parent().parent().find('.view');

        var eText = currenteditor.html();

        contenthandle.setData(eText);

    });



    $('body.edit .demo').on("click", "[data-target=#configModal]", function(e) {

        e.preventDefault();

        debugger;

        currenteditor = $(this).parent().parent().find('.template');

        var eText = currenteditor.attr("data-config");

        var config = JSON.parse(eText);

        attrViewModel = new kendo.observable({

        });

        var obj = [];

        $.each(config, function(k, v) {

            //display the key and value pair

            attrViewModel.set(k, v);

            obj.push({ key: k, value: v });

        });



        var template_html = $('#configTemplate').html();

        var template = kendo.template(template_html);



        var htmlRight = kendo.render(template, obj);



        $("#configDiv").html(htmlRight);

        kendo.bind($("#configDiv"), attrViewModel);

    });

*/



    $("#saveConfig").click(function(e) {

        e.preventDefault();

        debugger;

        var obj = [];

        var obj2 = [];

        var json = JSON.stringify(attrViewModel.toJSON());

        currenteditor.attr("data-config", json);



        var template_html = currenteditor.html();

        var template = kendo.template(template_html);

        var htmlGen = kendo.render(template, [attrViewModel]);



        var viewDiv = $(".view", currenteditor.parent()).first();

        var child = viewDiv.children().clone();

        viewDiv.html(htmlGen);

        //                viewDiv.append(child);



        //kendo.bind(currenteditor, attrViewModel);

    });


    /*
        $('body.edit .demo').on("click", "[data-target=#configBootstrapModal]", function(e) {

            e.preventDefault();

            debugger;

            currenteditor = $(this).parent().parent().find('.view');

            var eText = currenteditor.attr("data-config");

            var config = JSON.parse(eText);



            var colCnt = "" + config.columns;

            var xsColCnt = "" + config.xscolumns;

            var mdColCnt = "" + config.mdcolumns;



            attrViewModel = new kendo.observable({

            });

            var obj = [];



            var i = 1;

            var n = colCnt.split(" ", 12);

            $.each(n, function(n, r) {

                e = e + parseInt(r);

                var k = "Column" + i;

                var v = {};

                attrViewModel.set(k, v);

                obj.push({ key: k, value: v });

                i++

                // t += '<div class="col-xs-' + r + ' column"></div>';

            });

            i = 1;

            n = xsColCnt.split(" ", 12);

            $.each(n, function(n, r) {

                e = e + parseInt(r);

                var k = "Column" + i + ".xs";

                var v = parseInt(r);

                attrViewModel.set(k, v);

                i++

                // t += '<div class="col-xs-' + r + ' column"></div>';

            });



            i = 1;

            n = mdColCnt.split(" ", 12);

            $.each(n, function(n, r) {

                e = e + parseInt(r);

                var k = "Column" + i + ".md";

                var v = parseInt(r);

                attrViewModel.set(k, v);

                i++

                // t += '<div class="col-xs-' + r + ' column"></div>';

            });

            if (e == 12) {



            } else {



            }





            var template_html = $('#configBootstrapTemplate').html();

            var template = kendo.template(template_html);



            var htmlRight = kendo.render(template, obj);



            $("#configBootstrapDiv").html(htmlRight);

            kendo.bind($("#configBootstrapDiv"), attrViewModel);

        });

    */

    $("#saveBootstrapConfig").click(function(e) {

        e.preventDefault();

        debugger;

        var jsonOrg = currenteditor.attr("data-config");



        var config = JSON.parse(jsonOrg);



        var colCnt = "" + config.columns;

        var xsColCnt = "" + config.xscolumns;

        var mdColCnt = "" + config.mdcolumns;





        var i = 1;

        var md = "";

        var xs = "";

        var col = [];

        var n = colCnt.split(" ", 12);

        $.each(n, function(n, r) {

            e = e + parseInt(r);

            var k = "Column" + i;

            col.push({

                "lg": "col-lg-" + parseInt(r),

                "md": "col-md-" + attrViewModel.get(k + ".md"),

                "xs": "col-xs-" + attrViewModel.get(k + ".xs")

            });

            md += attrViewModel.get(k + ".md") + " ";

            xs += attrViewModel.get(k + ".xs") + " ";

            i++

            // t += '<div class="col-xs-' + r + ' column"></div>';

        });

        var json = {

            'class': config.class,

            columns: config.columns,

            mdcolumns: $.trim(md),

            xscolumns: $.trim(xs),

        };

        currenteditor.attr("data-config", JSON.stringify(json));

        var divs = $(".column", currenteditor);

        $.each(divs, function(i, e) {

            debugger;

            $(e).removeClass();

            $(e).addClass(col[i].lg);

            $(e).addClass(col[i].md);

            $(e).addClass(col[i].xs);

            $(e).addClass("column");

            $(e).addClass("ui-sortable");

        });

    });





    $("#savecontent").click(function(e) {

        e.preventDefault();

        currenteditor.html(contenthandle.getData());

    });

    /*
    $("button[data-target=#downloadModal]").click(function(e) {

        e.preventDefault();

        downloadLayoutSrc();

    });

    $("button[data-target=#shareModal]").click(function(e) {

        e.preventDefault();

        handleSaveLayout();

    });
    */

    $("#download").click(function() {

        downloadLayout();

        return false;

    });

    $("#downloadhtml").click(function() {

        downloadHtmlLayout();

        return false;

    });

    $("#edit").click(function() {

        $("body").removeClass("devpreview sourcepreview");

        $("body").addClass("edit");

        removeMenuClasses();

        $(this).addClass("active");

        return false;

    });

    $("#clear").click(function(e) {

        e.preventDefault();

        clearDemo();

    });

    $("#devpreview").click(function() {

        $("body").removeClass("edit sourcepreview");

        $("body").addClass("devpreview");

        removeMenuClasses();

        $(this).addClass("active");

        return false;

    });

    $("#sourcepreview").click(function() {

        $("body").removeClass("edit");

        $("body").addClass("devpreview sourcepreview");

        removeMenuClasses();

        $(this).addClass("active");

        return false;

    });

    $("#fluidPage").click(function(e) {

        e.preventDefault();

        changeStructure("container", "container-fluid");

        $("#fixedPage").removeClass("active");

        $(this).addClass("active");

        downloadLayoutSrc();

    });

    $("#fixedPage").click(function(e) {

        e.preventDefault();

        changeStructure("container-fluid", "container");

        $("#fluidPage").removeClass("active");

        $(this).addClass("active");

        downloadLayoutSrc();

    });

    $(".nav-header").click(function() {

        var nxt = $(this).next();

        var icon = $(".icon-white", this);





        nxt.slideToggle(

            function() {

                var h = nxt[0].scrollHeight;

                if (h > 5) {

                    //now invisible

                    icon.removeClass("icon-plus").addClass("icon-minus");

                } else {

                    icon.removeClass("icon-minus").addClass("icon-plus");

                }

            });

        //                $(".sidebar-nav .boxes, .sidebar-nav .rows").hide();

        //                            $(this).next().fadeIn();

    });

    $('#undo').click(function() {

        stopsave++;

        if (undoLayout()) initContainer();

        stopsave--;

    });

    $('#redo').click(function() {

        stopsave++;

        if (redoLayout()) initContainer();

        stopsave--;

    });

    removeElm();

    gridSystemGenerator();

    setInterval(function() {

        handleSaveLayout();

    }, timerSave);

    var prevalue_sv = $('.sidebar-nav').css('overflow');

    $('.popover-info').hover(function() {

        $('.sidebar-nav').css('overflow', 'inherit');

    }, function() {

        $('.sidebar-nav').css('overflow', prevalue_sv);

    });

});



function saveHtml() {

    var cpath = window.location.href;

    cpath = cpath.substring(0, cpath.lastIndexOf("/"));

    webpage = '<html>\n<head>\n<script type="text/javascript" src="' + cpath + '/js/jquery-2.0.0.min.js"></script>\n<script type="text/javascript" src="' + cpath + '/js/jquery-ui.js"></script>\n<link href="' + cpath + '/css/bootstrap-combined.min.css" rel="stylesheet" media="screen">\n<script type="text/javascript" src="' + cpath + '/js/bootstrap.min.js"></script>\n</head>\n<body>\n' + webpage + '\n</body>\n</html>'

    /* FM aka Vegetam Added the function that save the file in the directory Downloads. Work only to Chrome Firefox And IE*/

    if (navigator.appName == "Microsoft Internet Explorer" && window.ActiveXObject) {

        var locationFile = location.href.toString();

        var dlg = false;

        with(document) {

            ir = createElement('iframe');

            ir.id = 'ifr';

            ir.location = 'about.blank';

            ir.style.display = 'none';

            body.appendChild(ir);

            with(getElementById('ifr').contentWindow.document) {

                open("text/html", "replace");

                charset = "utf-8";

                write(webpage);

                close();

                document.charset = "utf-8";

                dlg = execCommand('SaveAs', false, locationFile + "webpage.html");

            }

            return dlg;

        }

    } else {

        webpage = webpage;

        var blob = new Blob([webpage], { type: "text/html;charset=utf-8" });

        saveAs(blob, "webpage.html");

    }

}



function removeSpaces(text)

{

    var out = text.replace(/[^a-zA-Z]+/gi, " ");

    return out;

}