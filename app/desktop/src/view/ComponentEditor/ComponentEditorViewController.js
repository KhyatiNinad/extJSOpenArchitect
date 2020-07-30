Ext.define('extJSOpenArchitect.view.ComponentEditorViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.componenteditor',


    onConfigSearchChange: function (component, newValue, oldValue) {
        //debugger;
        var store = this.getView().query("#configgrid")[0].getStore();
        var value = newValue;
        var filterId = 'name';
        if (value) {
            store.removeFilter(filterId, false)
            var filter = {
                id: filterId,
                property: filterId,
                value: value
            };
            filter.anyMatch = true
            filter.caseSensitive = false
            store.addFilter(filter)
        } else {
            store.filters.removeAtKey(filterId)

        }
    },

    onEventSearchChange: function (component, newValue, oldValue) {
        //debugger;
        var store = this.getView().query("#eventgrid")[0].getStore();
        var value = newValue;
        var filterId = 'name';
        if (value) {
            store.removeFilter(filterId, false)
            var filter = {
                id: filterId,
                property: filterId,
                value: value
            };
            filter.anyMatch = true
            filter.caseSensitive = false
            store.addFilter(filter)
        } else {
            store.filters.removeAtKey(filterId)

        }
    },

    onPropertyStoreDataChange: function (store, eOpts) {

        var updatedData = store.getData().items.map((e) => {
            return e.data
        });


    },
    onEventStoreDataChange: function (store, eOpts) {
        var updatedData = store.getData().items.map((e) => {
            return e.data
        });
        updatedData = updatedData.map((r) => {
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
        var architectController = this.getView().up().up().up().getController();
        architectController.onVMUpdated(updatedData, 'events', store.needsSync);
    },
    onConfigStoreDataChange: function (store, eOpts) {


        try {
            if (store.needsSync) {
                //debugger;
                var updatedData = store.getData().items.map((e) => {
                    return e.data
                });
                updatedData = updatedData.map((r) => {
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
                var architectController = this.getView().up().up().up().getController();
                architectController.onVMUpdated(updatedData, 'configs', store.needsSync);

                /*
                var filter = null;

                var data = this.getViewModel().getData();
                var oldUpdatedData = JSON.parse(JSON.stringify(updatedData));
                if (store.getFilters().items.length > 1 && data.isDirty) {
                    // is filtered

                    filter = store.getFilters().items[1].config;
                    store.filters.removeAtKey('name');
                } else {
                    var updatedData = store.getData().items.map((e) => {
                        return e.data
                    });

                    updatedData = updatedData.map((r) => {
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


                    if (data.isDirty) {
                        var architectController = this.getView().up().up().up().getController();
                        architectController.onVMUpdated(updatedData, 'configs', store.needsSync);
                        data.isDirty = false;
                    }

                }

                if (filter != null) {
                    store.addFilter(filter)
                }
                */
            }
        } catch (e) {}
    },
    onMethodStoreDataChange: function (store, eOpts) {

        var updatedData = store.getData().items.map((e) => {
            return e.data
        });


    },
    destroy: function () {
        Ext.destroy(this.dialog);

        this.callParent();
    },



    onOK: function (button) {
        this.dialog.hide();
        Ext.destroy(this.dialog);
    },

    onShowPropertyDialog: function (grid, record) {

        var view = this.getView(),
            dialog = this.dialog;

        if (dialog) {
            Ext.destroy(this.dialog);
            dialog = null;
        }
        var item = record.record.data;

        var converter = new showdown.Converter(),
            text = typeof item.text !== 'undefined' ? item.text : 'N/A';
        var conHtml = converter.makeHtml(text);

        var html = '<h2> Config: ' + item.name + '</h2>';
        html += '<b>Required: </b>' + item.required;
        html += '<br/><b>Type: </b>' + item.type;
        html += '<br/><b>Details: </b>' + conHtml;
        html += '<br/><b>Current Value: </b>' + item.value;

        if (!dialog) {
            dialog = Ext.apply({
                ownerCmp: view,

            }, view.dialog);

            this.dialog = dialog = Ext.create(dialog);

        }
        this.dialog.setHtml(html);
        this.dialog.setTitle('Config Details');

        dialog.show();
    },
    onShowEventDialog: function (grid, record) {

        var view = this.getView(),
            dialog = this.dialog;


        if (dialog) {
            Ext.destroy(this.dialog);
            dialog = null;
        }
        var item = record.record.data;

        var noArg = 'No Arguments needed';
        var name = item.name;
        var items = item.items;
        var html = '<h2> Event: ' + name + '</h2>';
        var converter = new showdown.Converter(),
            text = typeof item.text !== 'undefined' ? item.text : 'N/A';
        if (text !== 'N/A' && text !== '') {
            var conHtml = converter.makeHtml(text);
            html += conHtml + "<br/>";

        }
        if (typeof items !== 'undefined') {
            if (items.length > 0) {
                noArg = '<h4>Arguments:</h4>';
                items.forEach((e) => {
                    if (e.$type === 'param')
                        noArg += '<b>' + e.name + '</b>: (' + e.type + ') - ' + Ext.htmlEncode(e.text) + '<br/>';
                });
                var returns = items.filter((e) => {
                    return e.$type === 'return'
                });
                if (returns.length > 0) {
                    noArg += "<h4>Returns: </h4>";
                    items.forEach((e) => {
                        if (e.$type === 'return')
                            noArg += '<b>' + e.type + '</b> - ' + Ext.htmlEncode(e.text) + '<br/>';
                    });
                }
            }
        }

        html += noArg;
        if (!dialog) {
            dialog = Ext.apply({
                ownerCmp: view,

            }, view.dialog);

            this.dialog = dialog = Ext.create(dialog);

        }
        this.dialog.setHtml(html);
        this.dialog.setTitle('Event Details');

        dialog.show();
    }


});