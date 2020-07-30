Ext.define('extJSOpenArchitect.view.ComponentPalletViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.componentpallet',

    onSearchChange: function (component, newValue, oldValue) {
        let componentListStore = Ext.first('#componentList').getStore(),
            vm = this.getViewModel();

        var timerId = vm.getData().timerId;
        if (timerId != 0) {
            clearTimeout(timerId);
        }

        timerId = setTimeout(function () {
            componentListStore.clearFilter();

            componentListStore.filterBy(function (rec) {
                return typeof rec.get('group') !== 'undefined' &&
                    rec.get('name').toLowerCase().replace(/ /g, '')
                    .indexOf(newValue.toLowerCase().replace(/ /g, '')) >= 0;

            });
        }, 500);
        vm.getData().timerId = timerId;
    },
    onItemTap: function (record) {
        var view = this.getView(),
            dialog = this.dialog;

        if (dialog) {
            Ext.destroy(this.dialog);
            dialog = null;
        }

        var html = '<h2>' + record.data.name + '</h2>';

        var converter = new showdown.Converter(),
            text = typeof record.data.text !== 'undefined' ? record.data.text : 'N/A';
        html += converter.makeHtml(text);
        //        html += '' + Ext.htmlEncode(record.data.text).replace(/\n/g, "<br />");

        if (!dialog) {
            dialog = Ext.apply({
                ownerCmp: view,

            }, view.dialog);

            this.dialog = dialog = Ext.create(dialog);

        }
        this.dialog.setHtml(html);
        this.dialog.setTitle('Component Information');

        dialog.show();
    },
    /* In real app this event should be `load` but we are using inline data store with data config for esier preview  */
    onStoreDataChange: function (store, eOpts) {},
    onDataLoad: function (store, opts) {
        var that = this;
        setTimeout(function () {
            that.getView().element.query(".x-tool-type-disclosure").forEach((e) => {
                if (e.className.indexOf('x-fa') < 0)
                    e.className += (' x-fa fa-info-circle')
            });

            var architectController = that.getView().up().up().getController();
            architectController.onShowTemplateDialog();
        }, 200);
    },

    destroy: function () {
        Ext.destroy(this.dialog);

        this.callParent();
    },



    onOK: function (button) {
        this.dialog.hide();
        Ext.destroy(this.dialog);
    },


});