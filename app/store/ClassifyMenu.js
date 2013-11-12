Ext.define('Xnfy.store.ClassifyMenu', {
    extend: 'Ext.data.TreeStore',
    requires: [
        'Xnfy.model.ClassifyMenu'
    ],
    model: 'Xnfy.model.ClassifyMenu',
    storeId: 'ClassifyMenu',
    //autoLoad: false,
    sorters:[{property:'sort',direction:'ASC'},{property:'id',direction:'ASC'}],
    nodeParam:'pid',
    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            root: {
                title: '类别列表',
                leaf: false,
                id: 0
            },
            proxy: {
                type: 'ajax',
                api: {
                    create: 'createPersons',
                    read: 'admin/classify/getList',
                    update: 'updatePersons',
                    destroy: 'destroyPersons'
                }
            }
        }, cfg)]);
    }
});