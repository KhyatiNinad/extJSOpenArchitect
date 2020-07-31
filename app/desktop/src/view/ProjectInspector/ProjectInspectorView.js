Ext.define('extJSOpenArchitect.view.ProjectInspector', {
    extend: 'Ext.Container',
    alias: 'widget.projectinspector',

    requires: [
        'extJSOpenArchitect.view.ProjectInspectorViewModel',
        'Ext.list.Tree',
        'Ext.list.TreeItem',
        'Ext.MessageBox'
    ],

    controller: {
        type: 'projectinspector'
    },
    viewModel: {
        type: 'architectpanel'
    },
    scrollable: 'both',

    layout: {
        type: 'card',
        animation: 'slide'
    },

    cls: 'project-inspector',

    items: [{
        xtype: 'container',
        layout: 'vbox',
        items: [{
            xtype: 'treelist',
            reference: 'treelist',
            itemId: 'projectInspector',
            bind: '{componentsTree}',
            flex: 1,
            initialize: function () {
                var me = this;

                me.menu = Ext.create('Ext.menu.Menu', {
                    reference: 'contextMenu',
                    $initParent: me,
                    items: [{
                        text: 'Edit Config',
                        iconCls: 'x-fa fa-cog',
                        handler: 'onSelectConfig'
                    }, {
                        text: 'Edit Events',
                        iconCls: 'x-fa fa-bolt',
                        handler: 'onSelectEvents'
                    }, {
                        text: 'Delete Component',
                        iconCls: 'x-fa fa-minus-circle',
                        handler: 'onDelete'
                    }]
                });

            },

            loadData: function (data) {
                // debugger;
                this.getStore().setProxy({
                    type: 'memory',
                    data: data,
                    reader: {
                        type: 'json'
                    }
                });
                this.getStore().load();
            },
            listeners: {
                selectionchange: 'treeNodeSelect',
                contextmenu: {
                    preventDefault: true,
                    element: 'element',
                    fn: 'onContextMenu'
                }
            }
        }]
    }]

});