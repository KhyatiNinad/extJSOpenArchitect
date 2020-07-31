Ext.define('extJSOpenArchitect.view.ArchitectPanelViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.architectpanel',

    onComponentDrop: function (plugin, info) {
        //debugger;
        ////console.log(plugin.cmp.element.id);
        var currentComponent = plugin.cmp.element;
        var currentComponentItemId = plugin.cmp.getItemId();
        plugin.cmp.parent.removeCls("drop-target");

        var component = info.record.data;
        // Process Drop!
        var data = this.getViewModel().getData();
        // //console.log(data.itemCount);

        var thisComponent = JSON.parse(JSON.stringify(component));
        thisComponent.children = [];
        var alias = component.alias ? (component.alias.indexOf(',') > 0 ? component.alias.split(',')[0] : component.alias) : component.name;
        var name = component.name;
        var thisAlias = alias.replace("widget.", "");
        thisComponent.text = thisAlias.replace(
            /\w\S*/g,
            function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        ); //+ " " + data.itemCount;
        thisComponent.leaf = true;

        this.addProperties(thisComponent, component.extended);


        thisComponent.iconCls = (component.extends.indexOf('Container') >= 0 || alias.indexOf('ontainer') >= 0) ?
            'x-fa fa-inbox' : 'x-fa fa-circle-notch';

        thisComponent.itemId = "component_" + data.itemCount;
        thisComponent.id = thisComponent.itemId;

        if (currentComponentItemId !== "designerPanel" && currentComponentItemId !== 'parentDesignerPanel')
            thisComponent.parentId = currentComponentItemId;


        //data.components.push(thisComponent);

        data.itemCount = data.itemCount + 1;


        var configTree = this.setChildHierarchy(data.components, thisComponent, currentComponentItemId);
        if (!configTree)
            data.components.push(thisComponent);

        //console.log(data.components);

        var renderConfig = this.getViewConfig(thisComponent);
        //console.log(renderConfig);
        var renderTo = Ext.ComponentQuery.query('architectpanel')[0].down("#" + currentComponentItemId);
        var that = this;
        if (typeof renderConfig !== 'undefined') {
            if (renderConfig != null) {
                this.renderComp(renderTo, renderConfig);
            }
        }

        data.currentNode = "";

        var piTree = Ext.ComponentQuery.query('architectpanel')[0].down("#projectInspector");
        var store = this.getViewModel().getStore('componentsTree');
        var treeStore = piTree.getStore();
        setTimeout(function (e) {
            treeStore.setRoot({
                text: 'Root',
                children: JSON.parse(JSON.stringify(data.components))
            });
            var ce = that.getView().down("componenteditor");
            var cxStore = ce.getViewModel().getStore("configs");
            var pxStore = ce.getViewModel().getStore("properties");
            var mxStore = ce.getViewModel().getStore("methods");
            var exStore = ce.getViewModel().getStore("events");

            cxStore.loadData([]);
            pxStore.loadData([]);
            mxStore.loadData([]);
            exStore.loadData([]);
        }, 100);
    },

    onComponentDragLeave: function (plugin, info) {

        //console.log('Drag Leave');
        plugin.cmp.parent.removeCls("drop-target")
    },
    onComponentDragEnter: function (plugin, info) {
        //console.log('Drag Enter');
        plugin.cmp.parent.addCls("drop-target")

    },

    onReset: function () {

        var that = this;
        Ext.Msg.confirm('Confirmation', 'Are you sure you want to do delete all the components? This cannot be undone.',
            function (answer) {
                if (answer === 'yes') {
                    var storeData = that.getViewModel().getData();
                    storeData.currentNode = "";
                    storeData.components = [];
                    that.onRedraw();
                }
            });

    },
    onRedraw: function () {
        var myContainer = Ext.ComponentQuery.query('#parentDesignerPanel')[0];
        Ext.each(myContainer.items.items, function (cmp) {
            cmp.hide();
        });

        var storeData = this.getViewModel().getData();
        storeData.currentNode = "";
        var components = storeData.components;

        var that = this;
        var piTree = Ext.ComponentQuery.query('architectpanel')[0].down("#projectInspector");
        var store = this.getViewModel().getStore('componentsTree');
        var treeStore = piTree.getStore();
        setTimeout(function (e) {
            treeStore.setRoot({
                text: 'Root',
                children: JSON.parse(JSON.stringify(components))
            });
            var ce = that.getView().down("componenteditor");
            var cxStore = ce.getViewModel().getStore("configs");
            var pxStore = ce.getViewModel().getStore("properties");
            var mxStore = ce.getViewModel().getStore("methods");
            var exStore = ce.getViewModel().getStore("events");

            cxStore.loadData([]);
            pxStore.loadData([]);
            mxStore.loadData([]);
            exStore.loadData([]);
        }, 100);

        Ext.ComponentQuery.query('#designerPanel')[0].show();

        Ext.ComponentQuery.query("#segBtn")[0].updatePressedButtons([0])
        this.redrawComponent();

    },
    onViewChanged: function (container, button, pressed) {
        if (pressed) {
            //debugger;
            var myContainer = Ext.ComponentQuery.query('#parentDesignerPanel')[0];
            Ext.each(myContainer.items.items, function (cmp) {
                cmp.hide();
            });

            var storeData = this.getViewModel().getData();
            storeData.currentNode = "";
            var components = storeData.components;

            var that = this;
            var piTree = Ext.ComponentQuery.query('architectpanel')[0].down("#projectInspector");
            var store = this.getViewModel().getStore('componentsTree');
            var treeStore = piTree.getStore();
            setTimeout(function (e) {
                treeStore.setRoot({
                    text: 'Root',
                    children: JSON.parse(JSON.stringify(components))
                });
                var ce = that.getView().down("componenteditor");
                var cxStore = ce.getViewModel().getStore("configs");
                var pxStore = ce.getViewModel().getStore("properties");
                var mxStore = ce.getViewModel().getStore("methods");
                var exStore = ce.getViewModel().getStore("events");

                cxStore.loadData([]);
                pxStore.loadData([]);
                mxStore.loadData([]);
                exStore.loadData([]);
            }, 100);

            var btn = button.getText();
            if (btn === 'Design') {
                Ext.ComponentQuery.query('#designerPanel')[0].show();
            } else if (btn === 'Preview') {
                Ext.ComponentQuery.query('#previewPanel')[0].show();
                this.showPreview();

            } else if (btn === 'Code') {
                Ext.ComponentQuery.query('#codePanel')[0].show();
                //this.setCode();

            }

        }
    },
    onPreviewPanelChange: function (cmp, newVal, oldVal) {
        //  debugger;
        Ext.ComponentQuery.query("#previewDisplayTop")[0].removeCls("smartphone");
        Ext.ComponentQuery.query("#previewDisplayTop")[0].removeCls("tablet");
        Ext.ComponentQuery.query("#previewDisplayTop")[0].removeCls("iPhoneX");
        Ext.ComponentQuery.query("#previewDisplayTop")[0].removeCls("iPhone11");
        Ext.ComponentQuery.query("#previewDisplayTop")[0].removeCls("iPhone11Pro");
        Ext.ComponentQuery.query("#previewDisplayTop")[0].removeCls("iPad");
        Ext.ComponentQuery.query("#previewDisplayTop")[0].removeCls("iPadPro");
        Ext.ComponentQuery.query("#previewDisplayTop")[0].removeCls("Pixel3a");
        Ext.ComponentQuery.query("#previewDisplayTop")[0].removeCls("SurfaceGo2");
        Ext.ComponentQuery.query("#previewDisplayTop")[0].removeCls("SurfaceProX");

        Ext.ComponentQuery.query("#previewDisplayPanel")[0].removeCls("iPhoneX");
        Ext.ComponentQuery.query("#previewDisplayPanel")[0].removeCls("iPhone11");
        Ext.ComponentQuery.query("#previewDisplayPanel")[0].removeCls("iPhone11Pro");
        Ext.ComponentQuery.query("#previewDisplayPanel")[0].removeCls("iPad");
        Ext.ComponentQuery.query("#previewDisplayPanel")[0].removeCls("iPadPro");
        Ext.ComponentQuery.query("#previewDisplayPanel")[0].removeCls("Pixel3a");
        Ext.ComponentQuery.query("#previewDisplayPanel")[0].removeCls("SurfaceGo2");
        Ext.ComponentQuery.query("#previewDisplayPanel")[0].removeCls("SurfaceProX");

        Ext.ComponentQuery.query("#previewDisplayTop")[0].addCls(newVal);
        Ext.ComponentQuery.query("#previewDisplayPanel")[0].addCls(newVal);

        if (newVal === 'auto') {

        } else if (newVal === 'iPhoneX' || newVal === 'iPhone11' || newVal === 'iPhone11Pro' || newVal === 'Pixel3a') {
            Ext.ComponentQuery.query("#previewDisplayTop")[0].addCls('smartphone');
        } else {
            Ext.ComponentQuery.query("#previewDisplayTop")[0].addCls('tablet');

        }
    },
    showPreview: function () {
        var storeData = this.getViewModel().getData();

        var parentId = "previewDisplayPanel";
        var parent = storeData.components;

        var renderTo = Ext.ComponentQuery.query('architectpanel')[0].down("#" + parentId);

        this.emptyView(parentId);


        if (Array.isArray(parent)) {
            parent.forEach((p) => {
                var renderConfig = this.getViewConfig(p, true);
                //console.log(renderConfig);

                var that = this;
                if (typeof renderConfig !== 'undefined') {
                    if (renderConfig != null) {
                        this.renderComp(renderTo, renderConfig);

                    }
                }
            });
        } else {
            parent.children.forEach((p) => {
                var renderConfig = this.getViewConfig(p, true);
                //console.log(renderConfig);

                var that = this;
                if (typeof renderConfig !== 'undefined') {
                    if (renderConfig != null) {
                        this.renderComp(renderTo, renderConfig);
                    }
                }
            });
        }
    },
    setCode: function () {

        var viewName = this.getViewModel().getData().viewName; // 'MyContainer'; //TODO user Input
        var code = "Ext.define('MyApp.view." + viewName + "', { " +
            " extend: 'Ext.Container', " +
            " alias: 'widget." + viewName.toLocaleLowerCase() + "', " +
            " controller: '" + viewName.toLocaleLowerCase() + "', " +
            " viewModel: { " +
            "       type: '" + viewName.toLocaleLowerCase() + "', " +
            "       }, ";


        var storeData = this.getViewModel().getData();

        var parent = storeData.components;

        var allData = [];

        //debugger;
        if (Array.isArray(parent)) {
            parent.forEach((p) => {
                var renderConfig = this.getViewConfig(p, true, true);
                allData.push(renderConfig);
            });
        } else {
            var renderConfig = this.getViewConfig(parent, true, true);
            allData.push(renderConfig);
        }
        var aceId = this.getViewModel().getData().aceId;
        var editor = ace.edit(aceId);
        var val = JSON.stringify(allData);

        var allReq = {
            requires: ["MyApp.view." + viewName + "ViewModel"]
        };
        var req = this.getRequired();
        req.forEach((r) => {
            allReq.requires.push(r)
        });

        val = code + " requires: " + JSON.stringify(allReq.requires) + ", items: " + val;


        val += " });"
        var array = val.split(/\n/);
        array[0] = array[0].trim();
        val = array.join("\n");
        //Actual beautify (prettify) 
        val = js_beautify(val);
        //Change current text to formatted text
        editor.session.setValue(val);
        // //editor.setValue(JSON.stringify(allData));
        // var beautify = ace.require("ace/ext/beautify");

        // beautify.beautify(editor.session);

        var controllerCode = "Ext.define('MyApp.view." + viewName + "Controller',  " +
            "";
        var contData = {
            extend: 'Ext.app.ViewController',
            alias: 'controller.' + viewName.toLocaleLowerCase()
        };

        var allEvents = this.getEvents();


        allEvents.forEach((e) => {

            contData[e.name] = "$X#$" + e.method + "$X#$";
        });
        editor = ace.edit(aceId + "_controller");
        var val = JSON.stringify(contData);

        val = val.replace(/"\$X\#\$/g, '');
        val = val.replace(/\$X\#\$"/g, '');

        val = controllerCode + val;
        val += " );"
        var array = val.split(/\n/);
        array[0] = array[0].trim();
        val = array.join("\n");
        //Actual beautify (prettify) 
        val = js_beautify(val);
        //Change current text to formatted text
        editor.session.setValue(val);

        var modelCode = "Ext.define('MyApp.view." + viewName + "ViewModel',  " +
            "";
        var modelData = {
            extend: 'Ext.app.ViewModel',
            alias: 'viewmodel.' + viewName.toLocaleLowerCase()
        };

        editor = ace.edit(aceId + "_model");
        var val = JSON.stringify(modelData);

        val = modelCode + val;
        val += " );"
        var array = val.split(/\n/);
        array[0] = array[0].trim();
        val = array.join("\n");
        //Actual beautify (prettify) 
        val = js_beautify(val);
        //Change current text to formatted text
        editor.session.setValue(val);

    },

    initAceEditor: function (cmp) {
        //debugger;
        var aceId = this.getViewModel().getData().aceId;
        var aceContainer = Ext.ComponentQuery.query("#codeComponent")[0];
        aceContainer.setHtml('<div id="' + aceId +
            '" class="x-ace-editor" style="height:100%;width:100%"></div>');


        var editor = ace.edit(aceId);
        editor.setReadOnly(true);
        editor.setTheme('ace/theme/chrome');
        editor.getSession().setMode('ace/mode/javascript');
        editor.setOptions({
            showLineNumbers: true,
            showPrintMargin: false,
            selectionStyle: "text",

        });

        var aceContainerController = Ext.ComponentQuery.query("#codeControllerComponent")[0];
        aceContainerController.setHtml('<div id="' + aceId +
            '_controller" class="x-ace-editor" style="height:100%;width:100%"></div>');


        editor = ace.edit(aceId +
            '_controller');
        editor.setReadOnly(true);
        editor.setTheme('ace/theme/chrome');
        editor.getSession().setMode('ace/mode/javascript');
        editor.setOptions({
            showLineNumbers: true,
            showPrintMargin: false,
            selectionStyle: "text",

        });

        var aceContainerModel = Ext.ComponentQuery.query("#codeModelComponent")[0];
        aceContainerModel.setHtml('<div id="' + aceId +
            '_model" class="x-ace-editor" style="height:100%;width:100%"></div>');


        editor = ace.edit(aceId +
            '_model');
        editor.setReadOnly(true);
        editor.setTheme('ace/theme/chrome');
        editor.getSession().setMode('ace/mode/javascript');
        editor.setOptions({
            showLineNumbers: true,
            showPrintMargin: false,
            selectionStyle: "text",

        });
        this.setCode();
    },

    addProperties: function (c, ex) {

        //debugger;
        var cp = this.getView().down("componentpallet");
        var allComp = cp.getViewModel().getStore('allComponents').getData().items.map((e) => {
            return e.data
        });
        if (typeof c.items !== 'undefined') {
            if (c.items != null) {

                c.items.forEach((i) => {

                    var type = i.$type;
                    i.items.forEach((i) => {
                        i.group = c.name;
                    });

                    ex.split(',').forEach((r) => {
                        var parentComp = allComp.filter((p) => {
                            return p.name === r || (
                                typeof alternateClassNames !== 'undefined' &&
                                p.alternateClassNames.indexOf(r) >= 0)
                        });
                        if (parentComp.length > 0) {
                            var cx = JSON.parse(JSON.stringify(parentComp))

                            if (typeof cx[0].items !== 'undefined') {


                                var thisItems = cx[0].items.filter((p) => {
                                    return p.$type === type
                                });
                                if (thisItems.length > 0)
                                    if (typeof thisItems[0].items !== 'undefined') {
                                        thisItems[0].items.forEach((p) => {
                                            var px = JSON.parse(JSON.stringify(p));
                                            px.group = r;
                                            i.items.push(px);
                                        });
                                    }
                            }

                        }


                    });
                });
            }
        }

    },
    redrawComponent: function (itemId) {
        //debugger;
        var storeData = this.getViewModel().getData();

        /* var data = this.getNode(storeData.components, storeData.currentNode);
         if (data == null)
             return false;

         var parentId = data.parentId;

         var parent = this.getNode(storeData.components, parentId);
         */
        //TODO render current parent only! Currently it will redraw entire screen
        //if (parent === null)
        {
            var parentId = "designerPanel";
            var parent = storeData.components;
        }
        var renderTo = Ext.ComponentQuery.query('architectpanel')[0].down("#" + parentId);

        this.emptyView(parentId);


        if (Array.isArray(parent)) {
            parent.forEach((p) => {
                var renderConfig = this.getViewConfig(p);
                //  console.log(renderConfig);

                var that = this;
                if (typeof renderConfig !== 'undefined') {
                    if (renderConfig != null) {
                        this.renderComp(renderTo, renderConfig);
                    }
                }
            });
        } else {
            parent.children.forEach((p) => {
                var renderConfig = this.getViewConfig(p);
                //   console.log(renderConfig);

                var that = this;
                if (typeof renderConfig !== 'undefined') {
                    if (renderConfig != null) {
                        this.renderComp(renderTo, renderConfig);
                    }
                }
            });
        }

    },
    setChildHierarchy: function (arry, thisComponent, parentId) {



        var isParentFound = false;
        for (var i = 0, len = arry.length; i < len; ++i) {
            var item = arry[i];
            if (item.itemId === parentId) {
                item.children.push(thisComponent);
                item.leaf = false;
                item.expanded = true;
                isParentFound = true;
            } else {
                if (item.children)
                    isParentFound = this.setChildHierarchy(item.children, thisComponent, parentId);
            }
            if (isParentFound)
                break;
        }
        return isParentFound;

    },

    getNode: function (arry, parentId) {

        var itemData = null;
        for (var i = 0, len = arry.length; i < len; ++i) {
            var item = arry[i];
            if (item.itemId === parentId) {
                itemData = item;
                break
            } else {
                if (item.children) {
                    itemData = this.getNode(item.children, parentId);
                    if (itemData != null)
                        break;
                }
            }
            if (itemData != null)
                break;
        }
        return itemData;

    },

    removeNode: function (array, itemId) {

        for (var i = 0; i < array.length; ++i) {
            var obj = array[i];
            if (obj.itemId === itemId) {
                array.splice(i, 1);
                return true;
            }
            if (obj.children) {
                if (this.removeNode(obj.children, itemId)) {
                    return true;
                }
            }
        }


    },
    getRequired: function () {
        var req = [];
        //debugger;
        var storeData = this.getViewModel().getData();
        storeData.components.forEach((e) => {
            var ev = this.getComponentRequired(e);
            ev.forEach((ex) => {
                req.push(ex);
            });
        });

        return req;
    },

    getComponentRequired: function (c) {
        var req = [];

        req.push(c.name);
        return req;
    },

    getEvents: function () {
        var events = [];
        //debugger;
        var storeData = this.getViewModel().getData();
        storeData.components.forEach((e) => {
            var ev = this.getComponentEvent(e);
            ev.forEach((ex) => {
                events.push(ex);
            });
        });

        return events;
    },
    getComponentEvent: function (e) {

        var eventList = [];

        var configProp = e.items ? (e.items.length > 0 ? e.items : []) : [];


        var events = configProp.filter((x) => {
            return x.$type === 'events';
        });

        if (events.length > 0) {
            events[0].items.forEach((p) => {
                var isSet = false;
                if (typeof p.value !== 'undefined') {
                    if (p.value !== '') {
                        var m = "function(";
                        var items = p.items;
                        var itemArr = [];
                        //debugger;
                        if (typeof items !== 'undefined') {
                            if (items.length > 0) {
                                items.forEach((e) => {
                                    if (e.$type === 'param') {
                                        var nm = e.name;
                                        if (nm === 'this')
                                            nm = 'thisComponent';
                                        itemArr.push(nm);
                                    }
                                });
                            }
                        }
                        if (itemArr.length > 0)

                            m += itemArr.join(', ');

                        m += ") { }";
                        eventList.push({
                            name: p.value,
                            method: m
                        });
                    }
                }
            });
        }
        var childEvents = e.children
            .map((c) => {
                var component = this.getComponentEvent(c);
                if (component != null) return component;
            });


        childEvents.forEach((ez) => {
            ez.forEach((ch) => {
                eventList.push(ch);
            })
        });


        return eventList;
    },
    getViewConfig: function (e, onlyComponent, listeners) {

        var cx = this.getComponentArray(e, onlyComponent, listeners);
        return cx;

    },
    getComponentArray: function (e, onlyComponent, listeners) {
        var alias = e.alias ? (e.alias.indexOf(',') > 0 ? e.alias.split(',')[0] : e.alias) : e.name;
        var name = e.name;
        var thisAlias = alias.replace("widget.", "");

        var extendClass = e.extends;
        var requires = []; //based on child
        var items = e.children
            .map((c) => {
                var component = this.getComponentArray(c, onlyComponent, listeners);
                if (component != null) return component;
            })
            .filter((n) => {
                return n != null
            });

        var configProp = e.items ? (e.items.length > 0 ? e.items : []) : [];
        var properties = configProp.filter((x) => {
            return x.$type === 'configs';
        });

        var events = configProp.filter((x) => {
            return x.$type === 'events';
        });

        var cx = {
            xtype: thisAlias,
            //items: items,
            //text: 'My' + thisAlias,
            //html: 'My' + thisAlias,
            width: e.width ? e.width : 'auto',


        }



        if (typeof e.height !== 'undefined')
            cx.height = e.height;

        if (typeof cx.height === 'undefined') {
            if (extendClass.indexOf('Container') >= 0 || alias.indexOf('ontainer') >= 0) {

                cx.height = '200px';
            } else
                cx.height = 'auto';
        }
        var isFloat = false;

        if (cx.floated && cx.floated === 'true')
            isFloat = true;


        if (properties.length > 0) {
            properties[0].items.forEach((p) => {
                var isSet = false;
                try {
                    if (typeof p.value !== 'undefined') {
                        var noEnter = true;
                        if (typeof p.value === 'string') {
                            if (p.value.indexOf("\n") >= 0 &&
                                p.value.indexOf("Ext.") < 0)
                                noEnter = false;

                        }
                        if (p.value !== "null" && p.value !== "" && noEnter && p.name !== 'alwaysOnTop' &&
                            p.name !== 'autoDestroy' && p.name !== 'toFrontOnShow' &&
                            p.name !== 'xtype') {
                            var value = p.value.trim();

                            if (value.indexOf("'") == 0)
                                value = value.substring(1, value.length - 1);

                            if (value === 'true')
                                value = true;
                            else if (value === 'false')
                                value = false;
                            else if (value === '[]')
                                value = [];

                            try {
                                if (value.indexOf("{") == 0 || value.indexOf("[") == 0) /// if JSON object
                                    value = eval('(' + value + ')');
                            } catch (e) {}

                            if (!isFloat) {
                                if (p.name === 'x' || p.name === 'y')
                                    value = 'undefined';
                            }
                            if (typeof value !== 'undefined') {
                                if (value !== 'undefined') {
                                    cx[p.name] = value;
                                    isSet = true;
                                }
                            }

                        }
                    }
                } catch (e) {
                    console.log(p.name + ' ' + p.value + '  ' + e);
                }
                if (!isSet) {

                    if (p.name === 'height') {
                        p.value = cx.height;
                    }
                    if (p.name === 'width') {
                        p.value = cx.width;
                    }
                }
            });
        }

        if (onlyComponent && listeners) {
            var hasEvents = false;
            var eventList = {}
            if (events.length > 0) {
                events[0].items.forEach((p) => {
                    var isSet = false;
                    if (typeof p.value !== 'undefined') {
                        if (p.value !== '') {
                            hasEvents = true;
                            //console.log(p.name + ' ' + p.value);
                            eventList[p.name] = p.value;
                        }
                    }
                });
            }

            if (hasEvents) {
                cx.listeners = eventList;
            }
        }
        //debugger;
        if (!onlyComponent) {
            cx.extends = name;
            cx.itemId = '' + e.itemId;

            cx.listeners = {
                painted: function (c) {
                    c.element.on({
                        click: function (e) {
                            //debugger;
                            var clickedComponent = Ext.getCmp(e.currentTarget.id);
                            if (typeof clickedComponent !== 'undefined') {
                                var architectController = Ext.ComponentQuery.query('architectpanel')[0].getController();
                                architectController.onComponentSelected(clickedComponent.config.itemId);
                                e.stopPropagation();
                            }

                        }
                    });
                }
            }
        }
        if (extendClass.indexOf('Container') >= 0 || alias.indexOf('ontainer') >= 0) {
            //if (typeof cx.height === 'undefined')
            //    cx.height = '200px';


            if (!onlyComponent) {

                cx.plugins = [{
                    type: 'rowdrop',
                    recordType: 'component',
                    listeners: {
                        drop: 'onComponentDrop',
                        dragenter: 'onComponentDragEnter',
                        dragleave: 'onComponentDragLeave'

                    }
                }];
            }
        }


        cx.items = items;

        if (!isFloat) {
            if (onlyComponent)
                return cx;
            else {
                var parentComponent = {
                    itemId: 'resize_' + e.itemId,
                    xtype: 'panel',
                    width: cx.width,
                    height: cx.height,
                    border: true,
                    cls: 'resize-panel',
                    resizable: {
                        edges: 'all',
                        minSize: ["1px", "1px"]
                    },
                    listeners: {
                        resize: function (e) {
                            //  debugger;

                            var height = e.getHeight();
                            var width = e.getWidth();
                            if (e.items !== null) {
                                if (e.items.items !== null) {
                                    //set Store

                                    /*var piTree = Ext.ComponentQuery.query('architectpanel')[0].down("#projectInspector");
                                    var store = Ext.ComponentQuery.query('architectpanel')[0].getViewModel().getStore('componentsTree');
                                    var treeStore = piTree.getStore();
                                    var storeData = Ext.ComponentQuery.query('architectpanel')[0].getViewModel().getData();
                                    storeData.currentNode = "";
                                    var components = storeData.components;


                                    treeStore.setRoot({
                                        text: 'Root',
                                        children: JSON.parse(JSON.stringify(components))
                                    });

                                    var ce = Ext.ComponentQuery.query('architectpanel')[0].down("componenteditor");
                                    var cxStore = ce.getViewModel().getStore("configs");


                                    var pxStore = ce.getViewModel().getStore("properties");
                                    var mxStore = ce.getViewModel().getStore("methods");
                                    var exStore = ce.getViewModel().getStore("events");

                                    cxStore.loadData([]);
                                    pxStore.loadData([]);
                                    mxStore.loadData([]);
                                    exStore.loadData([]);
                                    */
                                    var itemId = e.getItemId().replace("resize_", "");

                                    var arc = Ext.ComponentQuery.query('architectpanel')[0];
                                    var storeData = arc.getViewModel().getData();
                                    var data = arc.getController().getNode(storeData.components, itemId);
                                    if (data == null)
                                        return false;


                                    var props = data.items.filter((p) => {
                                        return p.$type === 'configs'
                                    });
                                    if (height !== null) {
                                        e.items.items[0].setHeight(height);
                                        data.height = height;
                                        if (props.length > 0) {
                                            if (typeof props[0].items !== 'undefined') {
                                                var hx = props[0].items.filter((p) => {
                                                    return p.name === 'height'
                                                });
                                                if (hx.length > 0) {
                                                    if (height === 'auto' || ("" + height).indexOf('px') > 0 || ("" + height).indexOf('%') > 0)
                                                        hx[0].value = height;
                                                    else
                                                        hx[0].value = height + "px";
                                                }
                                            }
                                        }


                                    }
                                    if (width !== null) {
                                        e.items.items[0].setWidth(width);
                                        data.width = width;

                                        if (props.length > 0) {
                                            if (typeof props[0].items !== 'undefined') {
                                                var hx = props[0].items.filter((p) => {
                                                    return p.name === 'width'
                                                });
                                                if (hx.length > 0) {
                                                    if (width === 'auto' || ("" + width).indexOf('px') > 0 || ("" + width).indexOf('%') > 0)
                                                        hx[0].value = width;
                                                    else
                                                        hx[0].value = width + "px";

                                                }
                                            }
                                        }

                                    }

                                }
                            }
                        }
                    },

                    items: [cx]
                };
                if (cx.layout)
                    parentComponent.layout = cx.layout;
                if (cx.docked)
                    parentComponent.docked = cx.docked;
                if (cx.flex)
                    parentComponent.flex = cx.flex;
                return parentComponent;
            }
        } else return null;
    },
    onVMUpdated: function (config, type, isDirty) {
        if (!isDirty)
            return;

        var storeData = this.getViewModel().getData();
        var data = this.getNode(storeData.components, storeData.currentNode);
        if (data == null)
            return false;

        var configs = data.items.filter((r) => {
            return r.$type == type;
        });
        if (configs.length > 0) {
            // update only those which have come in (coz of grid filter)
            config.forEach((c) => {
                var thisConfig = configs[0].items.forEach((u) => {
                    if (u.name === c.name)
                        u.value = c.value;
                });
            });
        }

        //debugger;
        //TODO Update UI 

        if (type === 'configs')
            this.redrawComponent(data);
    },
    emptyView: function (parentId) {
        try {
            var renderTo = Ext.ComponentQuery.query('architectpanel')[0].down("#" + parentId);
            renderTo.removeAll();
        } catch (e) {
            //console.log(e);
            var a = Ext.ComponentQuery.query('architectpanel')[0].down("#" + parentId);
            //  debugger;
            a.element.getFirstChild().setHtml("");
        }
    },
    renderComp: function (renderTo, renderConfig) {
        try {
            var renderedComponent = Ext.ComponentManager.create(renderConfig);
            renderTo.add(renderedComponent);
        } catch (e) {
            msg = "An Error occured while rendering " + renderConfig.xtype + ". <br/>Please check the configuration." +
                "<br/>Error: " + e;
            //console.log(msg);
            Ext.toast(msg, 2000);

        }
    },
    onTreeViewNodeDeleted: function (itemId) {
        //debugger;
        var storeData = this.getViewModel().getData();
        var components = storeData.components;
        this.removeNode(components, itemId);
        storeData.components = components;

        //Re-draw
        parentId = "designerPanel";
        parent = storeData.components;

        var renderTo = Ext.ComponentQuery.query('architectpanel')[0].down("#" + parentId);


        this.emptyView(parentId);
        var that = this;

        if (Array.isArray(parent)) {
            parent.forEach((p) => {
                var renderConfig = this.getViewConfig(p);
                //console.log(renderConfig);

                if (typeof renderConfig !== 'undefined') {
                    if (renderConfig != null) {
                        this.renderComp(renderTo, renderConfig);

                    }
                }
            });
        }

        storeData.currentNode = "";

        var piTree = Ext.ComponentQuery.query('architectpanel')[0].down("#projectInspector");
        var store = this.getViewModel().getStore('componentsTree');
        var treeStore = piTree.getStore();
        setTimeout(function (e) {
            treeStore.setRoot({
                text: 'Root',
                children: JSON.parse(JSON.stringify(components))
            });
            var ce = that.getView().down("componenteditor");
            var cxStore = ce.getViewModel().getStore("configs");
            var pxStore = ce.getViewModel().getStore("properties");
            var mxStore = ce.getViewModel().getStore("methods");
            var exStore = ce.getViewModel().getStore("events");

            cxStore.loadData([]);
            pxStore.loadData([]);
            mxStore.loadData([]);
            exStore.loadData([]);
        }, 100);
    },
    onComponentSelected: function (itemId) {
        //debugger;
        var storeData = this.getViewModel().getData();
        if (storeData.currentNode !== itemId) {
            var pi = Ext.ComponentQuery.query('projectinspector')[0].getController();
            pi.selectTreeNode(itemId);
        }
    },
    onTreeViewNodeSelected: function (itemId) {

        var storeData = this.getViewModel().getData();
        var data = this.getNode(storeData.components, itemId);
        var configList = [];
        var propList = [];
        var methodList = [];
        var eventList = [];

        //debugger;
        if (data == null)
            return false;

        storeData.currentNode = itemId;

        var configs = data.items.filter((r) => {
            return r.$type == 'configs'
        });
        if (configs.length > 0)
            if (typeof configs[0].items !== 'undefined')
                configList = configs[0].items
                .map((r) => {
                    return {
                        type: typeof r.type !== 'undefined' ? r.type : "String",
                        access: r.access,
                        accessor: r.accessor,
                        name: r.name,
                        value: r.value,
                        text: r.text,
                        group: r.group
                    }
                });

        var properties = data.items.filter((r) => {
            return r.$type == 'properties'
        });
        if (properties.length > 0)
            if (typeof properties[0].items !== 'undefined')
                propList = properties[0].items
                .map((r) => {
                    return {
                        type: typeof r.type !== 'undefined' ? r.type : "String",
                        access: r.access,
                        accessor: r.accessor,
                        name: r.name,
                        value: r.value,
                        text: r.text,
                        group: r.group
                    }
                });

        var methods = data.items.filter((r) => {
            return r.$type == 'methods'
        });

        if (methods.length > 0)
            if (typeof methods[0].items !== 'undefined')
                methodList = methods[0].items.map((r) => {
                    return {
                        type: typeof r.type !== 'undefined' ? r.type : "String",
                        access: r.access,
                        name: r.name,
                        items: r.items,
                        text: typeof r.text !== 'undefined' ? r.text : '',
                        group: r.group
                    }
                });

        var events = data.items.filter((r) => {
            return r.$type == 'events'
        });

        if (events.length > 0)
            if (typeof events[0].items !== 'undefined')
                eventList = events[0].items.map((r) => {
                    return {
                        type: r.$type ? r.$type : "String",
                        access: r.access,
                        name: r.name,
                        items: r.items,
                        group: r.group,
                        value: r.value,
                        text: r.text
                    }
                });

        var ce = this.getView().down("componenteditor");
        var cxStore = ce.getViewModel().getStore("configs");
        var pxStore = ce.getViewModel().getStore("properties");
        var mxStore = ce.getViewModel().getStore("methods");
        var exStore = ce.getViewModel().getStore("events");

        cxStore.loadData(configList);
        pxStore.loadData(propList);
        mxStore.loadData(methodList);
        exStore.loadData(eventList);
    },

    onTemplateOK: function () {

        var form = this.getView().lookup('form');

        var isValid = form.validate();
        if (isValid) {

            var template = Ext.ComponentQuery.query("#templatepicker")[0].getSelected().items;
            if (template.length == 0) {
                Ext.toast("Please select a template", 2000);

            } else {
                var viewName = this.dialog.getViewModel().getData().viewName;

                var data = this.getViewModel().getData();

                data.viewName = viewName.replace(/[^a-z0-9]/gi, '');;

                data.components = [];

                var templateData = template[0].data;

                if (typeof templateData.view !== 'undefined') {
                    var view = templateData.view;
                    var newComponents = [];


                    var cp = Ext.ComponentQuery.query('architectpanel')[0].down("componentpallet");

                    var allComp = cp.getViewModel().getStore('allComponents').getData().items.map((e) => {
                        return e.data
                    }).filter((u) => {
                        return typeof u.alias !== 'undefined';
                    });
                    if (Array.isArray(view)) {
                        view.forEach((v) => {
                            var cx = this.addNewComponent(v, allComp, "designerPanel");
                            if (cx != null)
                                newComponents.push(cx);
                        })
                    } else {
                        var keyCnt = 0;
                        Object.keys(view).forEach(function (key, index) {
                            keyCnt++;
                        });
                        if (keyCnt > 0) {
                            var cx = this.addNewComponent(view, allComp, "designerPanel");
                            if (cx != null)
                                newComponents.push(cx);
                        }
                    }
                }

                data.components = newComponents;

                //console.log(newComponents);

                data.currentNode = "";

                var that = this;
                var piTree = Ext.ComponentQuery.query('architectpanel')[0].down("#projectInspector");
                var store = this.getViewModel().getStore('componentsTree');
                var treeStore = piTree.getStore();
                setTimeout(function (e) {
                    treeStore.setRoot({
                        text: 'Root',
                        children: JSON.parse(JSON.stringify(data.components))
                    });
                    var ce = that.getView().down("componenteditor");
                    var cxStore = ce.getViewModel().getStore("configs");
                    var pxStore = ce.getViewModel().getStore("properties");
                    var mxStore = ce.getViewModel().getStore("methods");
                    var exStore = ce.getViewModel().getStore("events");

                    cxStore.loadData([]);
                    pxStore.loadData([]);
                    mxStore.loadData([]);
                    exStore.loadData([]);

                    that.redrawComponent();

                }, 100);
                this.getView().unmask();
                this.dialog.hide();
            }
        } else {
            Ext.toast("Please enter all details", 2000);
        }
    },

    addNewComponent: function (c, allComp, currentComponentItemId) {

        var component = null;

        if (typeof c.xtype === 'undefined')
            c.xtype = 'label';

        var thisCx = allComp.filter((u) => {
            return typeof u.alias !== 'undefined';
        }).filter((u) => {
            return u.alias.indexOf('widget.' + c.xtype) >= 0;
        });

        if (thisCx.length > 0)
            component = thisCx[0];

        if (component != null) {
            var data = this.getViewModel().getData();

            var thisComponent = JSON.parse(JSON.stringify(component));
            thisComponent.children = [];
            var alias = component.alias ? (component.alias.indexOf(',') > 0 ? component.alias.split(',')[0] : component.alias) : component.name;
            var name = component.name;
            var thisAlias = alias.replace("widget.", "");
            thisComponent.text = thisAlias.replace(
                /\w\S*/g,
                function (txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                }
            );
            thisComponent.leaf = true;

            this.addProperties(thisComponent, component.extended);

            var configs = thisComponent.items.filter((u) => {
                return u.$type === 'configs'
            });
            if (typeof configs[0].items !== 'undefined') {
                if (configs[0].items.length > 0) {
                    Object.keys(c).forEach(function (key, index) {
                        var thisProp = configs[0].items.filter((m) => {
                            return m.name === key && m.name !== 'xtype';
                        });
                        if (thisProp.length > 0) {
                            thisProp.forEach((pr) => {
                                if (typeof c[key] !== 'undefined') {
                                    if (typeof c[key] == 'string')
                                        pr.value = c[key];
                                    else
                                        pr.value = JSON.stringify(c[key]);
                                }
                            });
                        }
                    });

                }
            }
            thisComponent.iconCls = (component.extends.indexOf('Container') >= 0 || alias.indexOf('ontainer') >= 0) ?
                'x-fa fa-inbox' : 'x-fa fa-circle-notch';

            thisComponent.itemId = "component_" + data.itemCount;
            thisComponent.id = thisComponent.itemId;

            if (currentComponentItemId !== "designerPanel" && currentComponentItemId !== 'parentDesignerPanel')
                thisComponent.parentId = currentComponentItemId;



            //data.components.push(thisComponent);

            data.itemCount = data.itemCount + 1;


            if (typeof c.items !== 'undefined') {
                if (c.items.length > 0) {
                    c.items.forEach((i) => {
                        var cx = this.addNewComponent(i, allComp, thisComponent.itemId);

                        if (cx != null)
                            thisComponent.children.push(cx);
                    })
                }
            }

            if (thisComponent.children.length > 0)
                thisComponent.leaf = false;

            return thisComponent;
        }
        return null;
    },



    destroy: function () {
        Ext.destroy(this.dialog);

        this.callParent();
    },

    onShowTemplateDialog: function () {


        var view = this.getView(),
            dialog = this.dialog;

        if (!dialog) {
            dialog = Ext.apply({
                ownerCmp: view
            }, view.dialog);

            this.dialog = dialog = Ext.create(dialog);
        }

        dialog.show();
    },
    onTemplateDataLoad: function (store, opts) {
        var sx = store;
    }

});