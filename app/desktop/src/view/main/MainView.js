Ext.define('extJSOpenArchitect.view.main.MainView', {
    extend: 'Ext.Container',
    xtype: 'mainview',
    controller: 'mainviewcontroller',
    viewModel: {
        type: 'mainviewmodel'
    },
    requires: [
        'Ext.layout.Fit'
    ],
    layout: 'fit',
    items: [{
            xtype: 'navview',
            reference: 'navview',
            docked: 'left',
            bind: {
                width: '{navview_width}'
            },
            listeners: {
                select: "onMenuViewSelectionChange"
            }
        },
        {
            xtype: 'headerview',
            reference: 'headerview',
            docked: 'top',
            bind: {
                height: '{headerview_height}'
            }
        },
        {
            xtype: 'centerview',
            reference: 'centerview'
        }
    ]
});