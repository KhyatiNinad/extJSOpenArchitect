Ext.define('extJSOpenArchitect.view.home.HomeView', {
    xtype: 'homeview',
    cls: 'homeview',
    controller: { type: 'homeviewcontroller' },
    viewModel: { type: 'homeviewmodel' },
    requires: ['extJSOpenArchitect.view.ArchitectPanel'],
    extend: 'Ext.Container',
    items: [{
        xtype: 'architectpanel',
        width: '100%',
        height: '100%'
    }]
});