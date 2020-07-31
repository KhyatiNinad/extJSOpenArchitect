var items = [{
        xtype: 'accordion',
        title: 'My Panel'
    },
    {
        xtype: 'actionsheet',
        title: 'My Panel',
        items: [{
            xtype: 'button',
            text: 'MyButton'
        }]
    },
    {
        xtype: 'carousel'
    },

    {
        xtype: 'container'
    },

    {
        xtype: 'dialog',
        title: 'My Dialog'
    },
    {
        xtype: 'editor'
    },
    {
        xtype: 'containerfield',
        label: 'Field'
    },
    {
        xtype: 'fieldpanel',
        title: 'My Panel'
    },
    {
        xtype: 'fieldset',
        title: 'MyFieldSet',
        items: [{
                xtype: 'textfield',
                label: 'Field'
            },
            {
                xtype: 'textfield',
                label: 'Field'
            }
        ]
    },
    {
        xtype: 'formpanel',
        title: 'My Form'
    },
    {
        xtype: 'groupcontainer',
        label: 'Field'
    },
    {
        xtype: 'panel',
        title: 'My Panel'
    },
    {
        xtype: 'sheet',
        title: 'My Panel'
    },
    {
        xtype: 'tabpanel',
        items: [{
                xtype: 'container',
                title: 'Tab 1'
            },
            {
                xtype: 'container',
                title: 'Tab 2'
            },
            {
                xtype: 'container',
                title: 'Tab 3'
            }
        ]
    },
    {
        xtype: 'timepanel',
        title: 'My Panel'
    }
]
var containers = items.map((r) => {
    return "widget." + r.xtype;
});

var containerClass = [];
var components = [];

modernClasses.global.items.filter((r) => {
    var isFound = (containers.indexOf(r.alias) >= 0 || containers.indexOf(r.name) >= 0);
    if (!isFound) {
        if (typeof r.alias !== 'undefined')
            r.alias.split(',').forEach((w) => {
                if (containers.indexOf(w) >= 0) {
                    isFound = true;;
                }

            });
    }
    return r.$type === 'class' && r.access !== 'private' &&
        isFound;
}).forEach((e) => {
    e.group = "Container";
    var l = containerClass.filter((r) => {
        return r.name === e.name;
    });
    if (l.length == 0) {
        containerClass.push(e);
        debugger;
        var extended = e.extended;
        var spl = extended.split(',');
        spl.forEach((s) => {

            var l = containerClass.filter((r) => {
                return r.name === s
            });
            if (l.length == 0) {
                var parent = modernClasses.global.items.filter((x) => {
                    return x.$type === 'class' && x.name === s
                });
                if (parent.length > 0)
                    containerClass.push(parent[0]);
            }
        });
    } else {
        l[0].group = e.group;
    }
});

items = [{
        xtype: 'checkbox',
        label: 'Field'
    },
    {
        xtype: 'checkboxgroup',
        width: 400,
        label: 'Label',
        items: [{
                xtype: 'checkbox',
                label: 'Box Label'
            },
            {
                xtype: 'checkbox',
                label: 'Box Label'
            }
        ]
    },
    {
        xtype: 'combobox',
        label: 'Field'
    },
    {
        xtype: 'datefield',
        label: 'Field',
        picker: {
            xtype: 'datepicker',
            title: 'My Panel'
        }
    },
    {
        xtype: 'displayfield',
        label: 'Field'
    },
    {
        xtype: 'emailfield',
        label: 'Field'
    },
    {
        xtype: 'filefield',
        label: 'Field'
    },
    {
        xtype: 'hiddenfield'
    },
    {
        xtype: 'numberfield',
        label: 'Field'
    },
    {
        xtype: 'passwordfield',
        label: 'Field'
    },
    {
        xtype: 'radio',
        name: 'field',
        label: 'Field'
    },
    {
        xtype: 'radiogroup',
        width: 400,
        label: 'Label',
        items: [{
                xtype: 'radio',
                name: 'field',
                label: 'Box Label'
            },
            {
                xtype: 'radio',
                name: 'field',
                label: 'Box Label'
            }
        ]
    },
    {
        xtype: 'searchfield',
        label: 'Field'
    },
    {
        xtype: 'selectfield',
        label: 'Field'
    },
    {
        xtype: 'sliderfield',
        label: 'Field'
    },
    {
        xtype: 'spinnerfield',
        label: 'Field'
    },
    {
        xtype: 'textfield',
        label: 'Field'
    },
    {
        xtype: 'textareafield',
        label: 'Field'
    },
    {
        xtype: 'timefield',
        label: 'Field'
    },
    {
        xtype: 'togglefield',
        label: 'Field'
    },
    {
        xtype: 'urlfield',
        label: 'Field'
    },
    {
        xtype: 'button',
        text: 'MyButton'
    },
    {
        xtype: 'label'
    },
    {
        xtype: 'splitbutton',
        text: 'MySplitButton',
        menu: {
            xtype: 'menu',
            width: 120,
            items: [{
                    xtype: 'menuitem',
                    text: 'Menu Item'
                },
                {
                    xtype: 'menuitem',
                    text: 'Menu Item'
                },
                {
                    xtype: 'menuitem',
                    text: 'Menu Item'
                }
            ]
        }
    }
];

var containers = items.map((r) => {
    return "widget." + r.xtype;
});


modernClasses.global.items.filter((r) => {
    var isFound = (containers.indexOf(r.alias) >= 0 || containers.indexOf(r.name) >= 0);
    if (!isFound) {
        if (typeof r.alias !== 'undefined')
            r.alias.split(',').forEach((w) => {
                if (containers.indexOf(w) >= 0) {
                    console.log("<<<" + w);
                    isFound = true;;
                }

            });
    }
    return r.$type === 'class' && r.access !== 'private' &&
        isFound;
}).forEach((e) => {
    e.group = "Form Fields";
    var l = containerClass.filter((r) => {
        return r.name === e.name;
    });
    if (l.length == 0) {
        containerClass.push(e);
        var extended = e.extended;
        var spl = extended.split(',');
        spl.forEach((s) => {

            var l = containerClass.filter((r) => {
                return r.name === s
            });
            if (l.length == 0) {
                var parent = modernClasses.global.items.filter((x) => {
                    return x.$type === 'class' && x.name === s
                });
                if (parent.length > 0)
                    containerClass.push(parent[0]);
            }
        });
    } else {
        l[0].group = e.group;
    }

});


items = [{
        xtype: 'grid',
        height: '100%',
        width: '100%',
    },
    {
        xtype: 'lockedgrid',
        height: '100%',

    },
    {
        xtype: 'nestedlist',
        docked: 'top'
    },
    {
        xtype: 'list',
        docked: 'top'
    }
];


var containers = items.map((r) => {
    return "widget." + r.xtype;
});


modernClasses.global.items.filter((r) => {
    var isFound = (containers.indexOf(r.alias) >= 0 || containers.indexOf(r.name) >= 0);
    if (!isFound) {
        if (typeof r.alias !== 'undefined')
            r.alias.split(',').forEach((w) => {
                if (containers.indexOf(w) >= 0) {
                    isFound = true;;
                }

            });
    }
    return r.$type === 'class' && r.access !== 'private' &&
        isFound;
}).forEach((e) => {
    e.group = "Grids, List & Trees";
    var l = containerClass.filter((r) => {
        return r.name === e.name;
    });
    if (l.length == 0) {
        containerClass.push(e);
        var extended = e.extended;
        var spl = extended.split(',');
        spl.forEach((s) => {

            var l = containerClass.filter((r) => {
                return r.name === s
            });
            if (l.length == 0) {
                var parent = modernClasses.global.items.filter((x) => {
                    return x.$type === 'class' && x.name === s
                });
                if (parent.length > 0)
                    containerClass.push(parent[0]);
            }
        });
    } else {
        l[0].group = e.group;
    }

});

items = [{
        xtype: 'toolbar',
        docked: 'top'
    },
    {
        xtype: 'breadcrumbbar',
        docked: 'top'
    },
    {
        xtype: 'spacer',
        docked: 'top'
    },

    {
        xtype: 'treelist'
    },

    {
        xtype: 'audio'
    },
    {
        xtype: 'image',
        height: 201
    },
    {
        xtype: 'video'
    },
    {
        xtype: 'menu',
        width: 120,
        items: [{
                xtype: 'menuitem',
                text: 'Menu Item'
            },
            {
                xtype: 'menuitem',
                text: 'Menu Item'
            },
            {
                xtype: 'menuitem',
                text: 'Menu Item'
            }
        ]
    }

]



var containers = items.map((r) => {
    return "widget." + r.xtype;
});


modernClasses.global.items.filter((r) => {
    var isFound = (containers.indexOf(r.alias) >= 0 || containers.indexOf(r.name) >= 0);
    if (!isFound) {
        if (typeof r.alias !== 'undefined')
            r.alias.split(',').forEach((w) => {
                if (containers.indexOf(w) >= 0) {
                    isFound = true;;
                }

            });
    }
    return r.$type === 'class' && r.access !== 'private' &&
        isFound;
}).forEach((e) => {
    e.group = "Other Components";
    var l = containerClass.filter((r) => {
        return r.name === e.name;
    });
    if (l.length == 0) {
        containerClass.push(e);
        var extended = e.extended;
        var spl = extended.split(',');
        spl.forEach((s) => {

            var l = containerClass.filter((r) => {
                return r.name === s
            });
            if (l.length == 0) {
                var parent = modernClasses.global.items.filter((x) => {
                    return x.$type === 'class' && x.name === s
                });
                if (parent.length > 0)
                    containerClass.push(parent[0]);
            }
        });
    } else {
        l[0].group = e.group;
    }

});

containerClass.forEach((m) => {
    var name = m.name;
    var lastInd = name.lastIndexOf(".");
    m.displayName = name;
    var firstInd = name.indexOf(".");
    if (firstInd > 0) {

        name = name.substr(firstInd + 1).replace(/\./g, " ");

        var spl = name.split(' ');
        if (spl.length > 1) {
            if (spl[0].toUpperCase() === spl[1].toUpperCase())
                name = spl[0];
        }
        m.displayName = name.replace(
            /\w\S*/g,
            function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );


    }
});
containerClass = containerClass.sort(function (a, b) {

    if (a.displayName > b.displayName) return 1;
    else if (a.displayName < b.displayName) return -1;
    else return 0;

});
var requires = [];
console.log(containerClass.map((u) => {
    if (requires.indexOf(u.name.trim()) < 0)
        requires.push(u.name.trim());
    return u.name + " - " + u.displayName
}));

var ex = containerClass.map((u) => {
    return u.extended
});

ex.forEach((x) => {
    if (typeof x !== 'undefined') {
        var s = x.split(',').forEach((sx) => {
            if (requires.indexOf(sx.trim()) < 0)
                requires.push(sx.trim());
        });
    }
})
console.log(JSON.stringify(requires));

var data = {
    components: containerClass
};

console.log(JSON.stringify(data));

var allConfigType = [];
var allConfigName = [];

var allItems = containerClass.map((r) => {
    return r.items
});

allItems.forEach((e) => {
    if (typeof e !== 'undefined')
        e.forEach((r) => {
            if (r.$type === 'configs') {
                r.items.forEach((i) => {

                    if (allConfigType.indexOf(i.type) < 0)
                        allConfigType.push(i.type)
                    if (allConfigName.indexOf(i.name) < 0)
                        allConfigName.push(i.name)
                })
            }
        })
});

console.log(allConfigName);
console.log(allConfigType);