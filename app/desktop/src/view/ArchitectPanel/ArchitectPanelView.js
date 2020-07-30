Ext.define('RowDropper', {
    extend: 'Ext.AbstractPlugin',
    alias: 'plugin.rowdrop',

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

        this.target = new Ext.drag.Target({
            element: component.element,
            listeners: {
                scope: me,
                drop: this.makeRelayer('drop')
            }
        });
    },

    disable: function () {
        this.target.disable();
    },

    enable: function () {
        this.target.enable();
    },

    doDestroy: function () {
        Ext.destroy(this.target);
        this.callParent();
    },

    makeRelayer: function (name) {
        var me = this;
        return function (target, info) {
            return me.fireEvent(name, me, info);
        };
    }
});

Ext.define('extJSOpenArchitect.view.ArchitectPanel', {
    extend: 'Ext.Panel',
    alias: 'widget.architectpanel',

    requires: [
        'extJSOpenArchitect.view.ArchitectPanelViewModel',
        'extJSOpenArchitect.view.ComponentPallet',
        'Ext.TitleBar',
        'Ext.carousel.Carousel',
        'Ext.field.RadioGroup',
        'Ext.field.Radio',
        'Ext.Panel',
        'Ext.panel.Collapser',
        'Ext.SegmentedButton',
        'Ext.field.*',
        'Ext.panel.Resizer',
        'Ext.Toast',
        'Ext.layout.Float',
        'Ext.Label',
        'Ext.tab.Panel',
        'Ext.Dialog'

    ],
    controller: 'architectpanel',
    viewModel: {
        type: 'architectpanel'
    },
    height: '100%',
    width: '100%',
    docked: 'top',
    scrollable: true,
    layout: 'float',
    header: false,
    titleCollapse: true,

    dialog: {
        xtype: 'dialog',
        title: 'extJS Open Architect - New Project',

        closable: false,
        defaultFocus: '#ok',
        maximizable: true,

        bodyPadding: 30,
        maxWidth: '80%',
        viewModel: {
            viewName: ''
        },
        items: [{
            xtype: 'formpanel',
            reference: 'form',
            width: '100%',
            height: '100%',
            layout: 'vbox',
            cls: 'form-dialog',
            items: [{
                    "xtype": "label",
                    "items": [],
                    "width": "auto",
                    "height": "auto",
                    "html": "Welcome to <b>extJS Open Architect.</b> Your <b>WYSIWYG Editor</b> for creating extJS Views",
                    "centered": false
                },
                {
                    "xtype": "label",
                    "items": [],
                    "width": "auto",
                    "height": "auto",
                    "html": "<br/><b>Enter Your View Name:</b>",
                    "centered": false
                },
                {
                    xtype: 'textfield',
                    name: 'viewname',
                    label: 'View Name',
                    placeholder: 'View Name',
                    required: true,
                    bind: {
                        value: '{viewName}'
                    },
                    errorTarget: 'under'
                },
                {
                    "xtype": "label",
                    "items": [],
                    "width": "auto",
                    "height": "auto",
                    "html": "<br/><b>Select Template:</b>",
                    "centered": false
                },
                {
                    xtype: 'dataview',
                    itemId: 'templatepicker',
                    width: '100%',
                    height: '200px',
                    inline: true,
                    cls: 'dataview-inline',
                    itemTpl: '<div class="template"><div class="template-inner"><i class="{iconCls}"></i></div><div class="template-name">{name}</div></div>',
                    bind: {
                        store: '{templates}'
                    }
                }
            ]


        }],
        // We are using standard buttons on the button
        // toolbar, so their text and order are consistent.
        buttons: {
            ok: 'onTemplateOK'
        }
    },

    masked: {
        xtype: 'loadmask',
        text: ''
    },

    items: [

        {
            xtype: 'panel',
            width: '30%',
            docked: 'left',
            layout: 'float',
            collapsed: false,
            collapsible: 'left',
            resizable: {
                edges: 'e',
                maxSize: ['40%', null],
                minSize: ["10%", null]
            },
            border: true,
            title: 'Project Inspector',
            titleCollapse: false,
            items: [{
                xtype: 'projectinspector',
                width: '100%',
                height: '100%'
            }],
            tools: [{
                itemId: 'refresh',
                type: 'close',
                tooltip: 'Delete All Components',
                iconCls: 'x-tool-type-trash',
                handler: 'onReset'
            }]
        },
        {
            xtype: 'panel',
            itemId: 'parentDesignerPanel',
            border: true,
            tools: [{
                itemId: 'refresh',
                type: 'refresh',
                tooltip: 'Redraw View',
                handler: 'onRedraw'
            }],
            header: {
                "items": [{
                        xtype: 'segmentedbutton',
                        itemId: 'segBtn',
                        flex: 3,
                        items: [{
                            text: 'Design',
                            pressed: true
                        }, {
                            text: 'Preview',
                        }, {
                            text: 'Code'
                        }],
                        listeners: {
                            toggle: 'onViewChanged'

                        }
                    },

                ]
            },
            height: '100%',
            width: '100%',
            scrollable: 'both',
            layout: 'float',
            title: 'Designer',
            items: [{
                itemId: 'designerPanel',
                xtype: 'container',
                height: '100%',
                width: '100%',
                scrollable: 'both',
                autoDestroy: false,
                plugins: [{
                    type: 'rowdrop',
                    recordType: 'component',
                    listeners: {
                        drop: 'onComponentDrop'
                    }
                }]
            }, {
                itemId: 'previewPanel',
                xtype: 'container',
                height: '100%',
                width: '100%',
                scrollable: 'both',
                layout: 'auto',
                hidden: true,
                items: [{
                        xtype: 'container',
                        width: '100%',
                        layout: 'hbox',
                        items: [{
                            xtype: 'label',
                            html: 'Select Device',
                            flex: 1
                        }, {
                            xtype: 'selectfield',
                            flex: 3,
                            placeholder: 'Select Screen Size',
                            listeners: {

                                'change': 'onPreviewPanelChange'
                            },
                            options: [{
                                text: 'Auto',
                                value: 'auto'
                            }, {
                                text: 'iPhone X',
                                value: 'iPhoneX'
                            }, {
                                text: 'iPhone 11',
                                value: 'iPhone11'
                            }, {
                                text: 'iPhone 11Pro',
                                value: 'iPhone11Pro'
                            }, {
                                text: 'iPad',
                                value: 'iPad'
                            }, {
                                text: 'iPad Pro',
                                value: 'iPadPro'
                            }, {
                                text: 'Pixel 3a',
                                value: 'Pixel3a'
                            }, {
                                text: 'Surface Go 2',
                                value: 'SurfaceGo2'
                            }, {
                                text: 'Surface Pro X',
                                value: 'SurfaceProX'
                            }, ]
                        }]
                    },
                    {
                        itemId: 'previewDisplayTop',
                        xtype: 'container',
                        flex: 1,
                        cls: 'auto',
                        scrollable: 'both',
                        items: [{
                            itemId: 'previewDisplayPanel',
                            xtype: 'container',
                            flex: 1,
                            width: '100%',
                            scrollable: 'both',
                        }]
                    }
                ]
            }, {
                itemId: 'codePanel',
                xtype: 'container',
                height: '100%',
                width: '100%',
                scrollable: 'both',
                hidden: true,
                items: [{
                        xtype: 'tabpanel',
                        reference: 'codetabpanel',
                        itemId: 'codetabpanel',
                        height: '100%',
                        width: '100%',
                        scrollable: 'both',
                        bind: {
                            tabBarPosition: 'left'
                        },
                        listeners: {
                            order: 'after',
                            painted: "initAceEditor"
                        },
                        items: [{
                            title: 'View',
                            height: '100%',
                            width: '100%',
                            scrollable: 'both',
                            items: [{
                                xtype: 'component',
                                height: '100%',
                                width: '100%',
                                itemId: 'codeComponent',
                                cls: 'x-ace-editor'
                            }]
                        }, {
                            title: 'Controller',
                            height: '100%',
                            width: '100%',
                            scrollable: 'both',
                            items: [{
                                xtype: 'component',
                                height: '100%',
                                width: '100%',
                                itemId: 'codeControllerComponent',
                                cls: 'x-ace-editor'
                            }]
                        }, {
                            title: 'Model',
                            height: '100%',
                            width: '100%',
                            scrollable: 'both',
                            items: [{
                                xtype: 'component',
                                height: '100%',
                                width: '100%',
                                itemId: 'codeModelComponent',
                                cls: 'x-ace-editor'
                            }]
                        }]
                    }

                ]
            }],


        },
        {
            xtype: 'panel',
            height: '100%',
            width: '30%',
            docked: 'right',
            scrollable: 'both',
            layout: 'vbox',
            collapsed: false,
            collapsible: 'right',
            title: 'ToolBox',
            border: true,
            resizable: {
                edges: 'w',
                maxSize: ['40%', null],
                minSize: ["10%", null]
            },

            items: [{
                xtype: 'componentpallet',
                flex: 1
            }, {
                xtype: 'panel',
                id: 'componenteditorpanel',
                flex: 1,
                scrollable: 'both',
                title: 'Configuration',
                collapsed: true,
                collapsible: 'bottom',
                resizable: {
                    edges: 'n'
                },
                items: [{
                    xtype: 'componenteditor',
                    reference: 'componenteditor',
                    width: '100%',
                    height: '100%',


                }]
            }]
        }
    ]

});