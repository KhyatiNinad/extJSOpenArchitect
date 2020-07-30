Ext.define('extJSOpenArchitect.model.Config', {
    extend: 'Ext.data.Model',
    fields: [{
            name: 'name',
            type: 'string'
        },
        {
            name: 'access',
            type: 'string'
        },
        {
            name: 'text',
            type: 'string'
        },
        {
            name: 'value',
            type: 'string'
        },
        {
            name: 'accessor',
            type: 'boolean'
        },
        {
            name: 'required',
            type: 'boolean'
        },
    ]
});
Ext.define('extJSOpenArchitect.model.Property', {
    extend: 'Ext.data.Model',
    fields: [{
            name: 'name',
            type: 'string'
        },
        {
            name: 'access',
            type: 'string'
        },
        {
            name: 'text',
            type: 'string'
        },
        {
            name: 'value',
            type: 'string'
        },
        {
            name: 'accessor',
            type: 'boolean'
        },
        {
            name: 'required',
            type: 'boolean'
        },
    ]
});

Ext.define('extJSOpenArchitect.model.Event', {
    extend: 'Ext.data.Model',
    fields: [{
            name: 'name',
            type: 'string'
        },
        {
            name: 'type',
            type: 'string'
        },
        {
            name: 'access',
            type: 'string'
        },
        {
            name: 'items',
            type: 'array'
        },
    ]
});

Ext.define('extJSOpenArchitect.model.Method', {
    extend: 'Ext.data.Model',
    fields: [{
            name: 'name',
            type: 'string'
        },
        {
            name: 'type',
            type: 'string'
        },
        {
            name: 'access',
            type: 'string'
        },
        {
            name: 'items',
            type: 'array'
        },
    ]
});

Ext.define('extJSOpenArchitect.view.ComponentEditorViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.componenteditor',

    requires: [
        'Ext.data.Store',
        'Ext.data.field.Field'
    ],
    data: {
        isDirty: false
    },
    stores: {
        configs: {
            autoLoad: true,
            model: 'extJSOpenArchitect.model.Config',
            data: {
                "configs": []
            },
            grouper: {
                groupFn: function (record) {
                    return record.get('group');
                }
            },
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json',
                    rootProperty: 'configs'

                }
            },
            listeners: {
                datachanged: 'onConfigStoreDataChange'
            }
        },
        properties: {
            autoLoad: true,
            model: 'extJSOpenArchitect.model.Property',
            data: {
                "properties": []
            },
            grouper: {
                groupFn: function (record) {

                    return record.get('group');
                }
            },
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json',
                    rootProperty: 'properties'

                }
            },
            listeners: {
                datachanged: 'onPropertyStoreDataChange'
            }
        },
        events: {
            autoLoad: true,
            model: 'extJSOpenArchitect.model.Event',
            data: {
                "events": []
            },
            grouper: {
                groupFn: function (record) {
                    return record.get('group');
                }
            },
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json',
                    rootProperty: 'events'

                }
            },
            listeners: {
                datachanged: 'onEventStoreDataChange'
            }
        },
        methods: {
            autoLoad: true,
            model: 'extJSOpenArchitect.model.Method',
            data: {
                "methods": []
            },
            groupField: 'group',
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json',
                    rootProperty: 'methods'

                }
            },
            listeners: {
                datachanged: 'onMethodStoreDataChange'
            }
        }
    }
});