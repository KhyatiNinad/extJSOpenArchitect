Ext.define('RowDragger', {
    extend: 'Ext.AbstractPlugin',
    alias: 'plugin.rowdrag',

    mixins: ['Ext.mixin.Observable'],

    config: {
        recordType: ''
    },

    constructor: function (config) {
        this.mixins.observable.constructor.call(this, config);
    },

    init: function (component) {
        var me = this,
            type = this.getRecordType();

        this.source = new Ext.drag.Source({
            element: component.element,
            delegate: '.x-list-item',
            describe: function (info) {
                var row = Ext.Component.fromElement(info.eventTarget, component, 'simplelistitem');
                info.record = row.getRecord();
            },
            proxy: {
                type: 'placeholder',
                getElement: function (info) {
                    var el = this.element;
                    if (!el) {
                        this.element = el = Ext.getBody().createChild({
                            style: 'padding: 10px; width: 100px; border: 1px solid gray; color: blue;',
                        });
                    }
                    el.show().update(info.record.get('displayName'));
                    return el;
                }
            },
            autoDestroy: false,
            listeners: {
                scope: me,
                beforedragstart: this.makeRelayer('beforedragstart'),
                dragstart: this.makeRelayer('dragstart'),
                dragmove: this.makeRelayer('dragmove'),
                dragend: this.makeRelayer('dragend')
            }
        });
    },

    disable: function () {
        this.source.disable();
    },

    enable: function () {
        this.source.enable();
    },

    doDestroy: function () {
        Ext.destroy(this.source);
        this.callParent();
    },

    makeRelayer: function (name) {
        var me = this;
        return function (source, info) {
            return me.fireEvent(name, me, info);
        };
    }
});


Ext.define('extJSOpenArchitect.view.ComponentPallet', {
    extend: 'Ext.Container',
    alias: 'widget.componentpallet',

    requires: [
        'extJSOpenArchitect.view.ComponentPalletViewModel',
        'Ext.field.Search',
        'Ext.dataview.List',
        'Ext.XTemplate',
        'Ext.tip.ToolTip'
    ],

    controller: {
        type: 'componentpallet'
    },
    viewModel: {
        type: 'componentpallet'
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
                xtype: 'searchfield',
                name: 'search',
                "placeholder": "Search",
                listeners: {
                    change: 'onSearchChange'
                }
            },
            {
                xtype: 'list',
                flex: 1,
                reference: 'componentlist',
                itemId: 'componentList',
                height: '100%',

                width: '100%',
                itemTpl: [
                    '<div class="component-drag" data-qtip="{displayName:htmlEncode}" >{displayName}</div>'
                ],
                onItemDisclosure: 'onItemTap',
                striped: true,
                bind: {
                    store: '{components}'
                },
                grouped: true,
                listeners: {

                    // childtap: 'onComponentTap'
                },

                plugins: [{
                    type: 'rowdrag',
                    recordType: 'component',
                    listeners: {
                        beforedragstart: function (plugin, info) {
                            return info.record.get('name') !== 'Bar';
                        }
                    }
                }]
            }
        ]
    }]

});