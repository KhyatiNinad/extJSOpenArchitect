Ext.define('MemberCellEditing', {

    extend: 'Ext.grid.plugin.CellEditing',
    xtype: 'membercellediting',
    alias: 'plugin.membercellediting',

    getEditor: function (location) {

        var column = location.column,
            fieldName = column.getDataIndex(),
            record = location.record,
            editable = column.getEditable(),
            editor, field;

        if ((editable !== false && typeof column.customEditor !== 'undefined') && editable) {
            var config = column.customEditor(record);

            editor = Ext.create(config);
        }

        if (!editor) {
            if (!(editor = editable !== false && column.getEditor(location.record)) && editable) {
                editor = Ext.create(column.getDefaultEditor());
            }
        }
        if (editor) {
            if (!editor.isCellEditor) {
                // during the construction of the celleditor
                // we need to pass the plugin so it can find
                // the owner grid to relay it's own events
                editor = Ext.create({
                    xtype: 'celleditor',
                    field: editor,
                    plugin: this
                });
            }

            column.setEditor(editor);
            editor.editingPlugin = this;

            field = editor.getField();
            field.addUi('celleditor');

            // Enforce the Model's validation rules
            field.setValidationField(record.getField(fieldName), record);
        }

        return editor;
    },

});
Ext.define('extJSOpenArchitect.view.ComponentEditor', {
    extend: 'Ext.Container',
    alias: 'widget.componenteditor',

    itemId: 'componenteditor',
    requires: [
        'extJSOpenArchitect.view.ComponentPalletViewModel',
        'Ext.tip.ToolTip',
        'Ext.grid.filters.*'


    ],

    controller: {
        type: 'componenteditor'
    },
    viewModel: {
        type: 'componenteditor'
    },
    scrollable: 'both',

    layout: {
        type: 'card',
        animation: 'slide'
    },

    dialog: {
        xtype: 'dialog',
        title: 'Dialog',

        closable: true,
        defaultFocus: '#ok',
        maximizable: true,
        maskTapHandler: 'onOK',

        bodyPadding: 20,
        maxWidth: '80%',
        html: '',

        buttons: {
            ok: 'onOK'
        }
    },
    items: [{
        xtype: 'container',
        layout: 'vbox',
        items: [{
            xtype: 'tabpanel',
            reference: 'tabpanel',
            itemId: 'componentEditorTab',
            flex: 1,
            layout: 'card',

            items: [{
                title: 'Config',
                iconAlign: 'left',
                iconCls: 'x-fa fa-cog',
                layout: 'vbox',
                items: [{
                    xtype: 'searchfield',
                    name: 'searchconfig',
                    "placeholder": "Search Config",
                    listeners: {
                        change: 'onConfigSearchChange'
                    }
                }, {
                    xtype: 'grid',
                    rowNumbers: true,
                    markDirty: true,
                    flex: 1,
                    name: 'configgrid',
                    itemId: 'configgrid',

                    grouped: true,
                    groupHeader: {
                        tpl: ['<div>{name} ({children.length})</div>']
                    },
                    plugins: [{
                        type: 'membercellediting',
                        clicksToEdit: 1
                    }],

                    selectable: {
                        rows: false,
                        cells: true
                    },

                    bind: {
                        store: '{configs}'
                    },

                    columns: [{
                            text: 'Property',
                            flex: 1,
                            width: 'auto',
                            dataIndex: 'name',
                            editable: false,
                            groupable: false,
                            locked: true,
                            itemId: 'propCol',

                        }, {

                            text: 'Value',
                            width: '40%',
                            dataIndex: 'value',
                            editable: true,
                            groupable: false,
                            itemId: 'valueCol',
                            customEditor: function (record) {
                                debugger;
                                var type = record.data.type;
                                if (type.indexOf('"/"') > 0) {
                                    var opts = type.split("/").map((r) => {
                                        return {
                                            text: r,
                                            value: r
                                        }
                                    });
                                    return {
                                        xtype: 'selectfield',
                                        options: opts
                                    };

                                } else if (type.indexOf("'/'") >= 0) {
                                    var opts = type.split("/").map((r) => {
                                        return {
                                            text: r,
                                            value: r
                                        }
                                    });
                                    return {
                                        xtype: 'selectfield',
                                        options: opts
                                    };

                                } else if (record.data.type.toLowerCase() === 'number') {
                                    return {
                                        xtype: 'numberfield'
                                    }
                                } else if (record.data.type.toLowerCase() === 'boolean') {
                                    return {
                                        xtype: 'selectfield',
                                        options: [{
                                            text: 'true',
                                            value: 'true'
                                        }, {
                                            text: 'false',
                                            value: 'false'
                                        }]
                                    }
                                } else {
                                    return {
                                        xtype: 'textfield'
                                    }
                                }
                            }
                        },
                        {
                            text: 'Info',
                            width: 'auto',
                            editable: false,
                            groupable: false,
                            itemId: 'propInfoCol',
                            cell: {
                                tools: {
                                    approve: {
                                        iconCls: 'x-fa fa-info-circle green',
                                        handler: 'onShowPropertyDialog'
                                    },

                                }
                            },

                        }
                    ],

                }],
                height: '100%'
            }, {
                title: 'Events',
                iconAlign: 'left',
                iconCls: 'x-fa fa-bolt',
                layout: 'vbox',
                flex: 1,
                items: [{
                    xtype: 'searchfield',
                    name: 'searchevent',
                    "placeholder": "Search Event",
                    listeners: {
                        change: 'onEventSearchChange'
                    }
                }, {
                    xtype: 'grid',
                    name: 'eventgrid',
                    itemId: 'eventgrid',
                    rowNumbers: true,
                    markDirty: true,

                    flex: 1,
                    grouped: true,
                    groupHeader: {
                        tpl: ['<div>{name} ({children.length})</div>']
                    },
                    plugins: [{
                        type: 'membercellediting',
                        clicksToEdit: 1
                    }],

                    selectable: {
                        rows: false,
                        cells: true
                    },


                    bind: {
                        store: '{events}'
                    },

                    columns: [{
                            text: 'Event',
                            flex: 1,
                            width: 'auto',
                            dataIndex: 'name',
                            editable: false,
                            groupable: false,
                            locked: true,
                            itemId: 'eventNameCol'
                        }, {

                            text: 'Value',
                            width: '40%',
                            dataIndex: 'value',
                            editable: true,
                            groupable: false,
                            itemId: 'eventValueCol',
                            customEditor: function (record) {
                                return {
                                    xtype: 'textfield'
                                }
                            }
                        },
                        {
                            text: 'Info',
                            width: 'auto',
                            editable: false,
                            groupable: false,
                            itemId: 'eventInfoCol',
                            cell: {
                                tools: {
                                    approve: {
                                        iconCls: 'x-fa fa-info-circle green',
                                        handler: 'onShowEventDialog'

                                    },

                                }
                            },

                        }
                    ],

                }],
                height: '100%'
            }]
        }]
    }]

});