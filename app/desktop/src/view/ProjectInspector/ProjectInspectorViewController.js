Ext.define('extJSOpenArchitect.view.ProjectInspectorViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.projectinspector',

    treeNodeSelect: function (tree, record, opts) {

        var data = record.data;
        var architectController = this.getView().up().up().getController();
        architectController.onTreeViewNodeSelected(data.itemId);
        var tab = this.getView().up().up().down("#componentEditorTab");
        tab.setActiveItemIndex(0);
        Ext.getCmp('componenteditorpanel').expand();
    },
    onContextMenu: function (event, target, eOpts) {
        const component = Ext.Component.from(target);
        const record = component.getNode();

        if (record) {
            this.getViewModel().set('contextrecord', record);
            this.getView().down("#projectInspector").menu.showAt(event.clientX, event.clientY);
        }

    },
    selectTreeNode: function (itemId) {

        //debugger;
        var tree = this.getView().down("treelist");
        var newSelection = tree.getStore().getNodeById(itemId);

        if (typeof newSelection !== 'undefined')
            tree.setSelection(newSelection);
    },

    onSelectConfig: function (event, target, eOpts) {

        var record = this.getViewModel().get('contextrecord');

        var data = record.data;
        var architectController = this.getView().up().up().getController();
        architectController.onTreeViewNodeSelected(data.itemId);
        var tab = this.getView().up().up().down("#componentEditorTab");
        tab.setActiveItemIndex(0);


    },
    onSelectEvents: function (event, target, eOpts) {

        var record = this.getViewModel().get('contextrecord');

        var data = record.data;
        var architectController = this.getView().up().up().getController();
        architectController.onTreeViewNodeSelected(data.itemId);

        var tab = this.getView().up().up().down("#componentEditorTab");
        tab.setActiveItemIndex(1);

    },
    onDelete: function (event, target, eOpts) {

        var record = this.getViewModel().get('contextrecord');
        var that = this;
        Ext.Msg.confirm('Confirmation', 'Are you sure you want to do delete the component and it\'s child, if any?',
            function (answer) {
                if (answer === 'yes') {
                    var data = record.data;
                    var architectController = that.getView().up().up().getController();
                    architectController.onTreeViewNodeDeleted(data.itemId);

                }
            });
    }

});