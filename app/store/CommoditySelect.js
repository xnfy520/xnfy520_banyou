Ext.define('Xnfy.store.CommoditySelect', {
    extend: 'Ext.data.Store',
    requires: [
        'Xnfy.model.CommoditySelect'
    ],
//    autoLoad: true,
    model: 'Xnfy.model.CommoditySelect',
//    pageSize: 2,
    storeId: 'CommoditySelect',
    sorters:[{property:'id',direction:'ASC'}],
    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            proxy: {
                type: 'ajax',
                noCache:true,
                actionMethods: {create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'},
                api:{
                    read: 'admin/commodity',
                    create : 'admin/link/insert',
                    update: 'admin/link/update',
                    destroy: 'admin/link/delete'
                },
                reader: {
                    type: 'json',
                    root: 'data'
                },
                writer : {
                    encode : true,
                    type : 'json',
                    root : 'data'//服务器端直接用接收
                },
                // Parameter name to send filtering information in
                filterParam: 'query',

                // The PHP script just use query=<whatever>
                encodeFilters: function(filters) {
                    return filters[0].value;
                }
            },
            remoteFilter: true,
            listeners: {
                beforeload: function(t){
                }
            }
        }, cfg)]);
    }
});