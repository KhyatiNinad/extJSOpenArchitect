Ext.define('extJSOpenArchitect.view.ArchitectPanelViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.architectpanel',
    data: {

        components: [],
        currentNode: null,
        itemCount: 1,
        aceId: Ext.id()
    },
    stores: {
        componentsTree: {
            autoSync: true,
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json'
                }
            },
            type: 'tree',
            root: {
                children: []
            }
        },
        templates: {
            proxy: {
                type: 'ajax',
                url: 'data/modern/templates.json',
                reader: {
                    type: 'json',
                    rootProperty: 'templates'
                }
            },
            autoLoad: true

        }
    }
});