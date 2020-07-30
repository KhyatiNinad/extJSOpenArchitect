Ext.define('Component', {
    extend: 'Ext.data.Model',
    fields: ['name', 'alias']
});

Ext.define('extJSOpenArchitect.view.ComponentPalletViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.componentpallet',

    requires: [
        'Ext.data.Store',
        'Ext.data.field.Field'
    ],
    data: {
        timerId: 0
    },
    stores: {


        allComponents: {
            proxy: {
                type: 'ajax',
                url: 'data/modern/components.json',
                reader: {
                    type: 'json',
                    rootProperty: 'components'
                }
            },
            autoLoad: true
        },
        components: {
            proxy: {
                type: 'ajax',
                url: 'data/modern/components.json',
                reader: {
                    type: 'json',
                    rootProperty: 'components'
                }
            },
            grouper: {
                groupFn: function (record) {
                    return record.get('group');
                }
            },
            filters: [function (item) {
                if (typeof item.data.group !== "undefined") {
                    return true;
                } else {
                    return false;
                }
            }],
            autoLoad: true,
            listeners: {
                datachanged: 'onStoreDataChange',
                load: 'onDataLoad'
            }
        }
    }


});