Ext.define('extJSOpenArchitect.view.main.footer.FooterView', {
    extend: 'Ext.Toolbar',
    xtype: 'footerview',
    cls: 'footerview',
    viewModel: {},
    items: [{
        xtype: 'container',
        cls: 'footerviewtext',
        //html: 'Ext JS version: ' + Ext.versions.extjs.version
        //bind: { html: '{name} footer' }
    }]
});