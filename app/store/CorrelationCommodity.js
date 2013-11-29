Ext.define('Xnfy.store.CorrelationCommodity', {
    extend: 'Ext.data.Store',
    requires: [
        'Xnfy.model.CorrelationCommodity'
    ],
//    autoLoad: true,
    model: 'Xnfy.model.CorrelationCommodity',
    // pageSize: 2,
    storeId: 'CorrelationCommodity',
    sorters:[{property:'sort',direction:'ASC'},{property:'id',direction:'DESC'}],
    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            proxy: {
                type: 'ajax',
                actionMethods: {create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'},
                api:{
                    read: 'admin/commodity/getAccessories',
                    create : 'admin/commodity/insert',
                    update: 'admin/commodity/update',
                    destroy: 'admin/commodity/delete'
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
                    var tab = Ext.getCmp("center").getActiveTab();
                    if(tab && tab.suitData){
                        var suit_treepicker = tab.queryById('suit_treepicker');
                        if(suit_treepicker.getValue()>0){
                            Ext.apply(this.proxy.extraParams, { pid: suit_treepicker.getValue()});
                        }else{
                            var filter = [];
                            if(tab.suitData){
                                Ext.Array.forEach(tab.suitData, function(item){
                                    filter.push(item.id);
                                });
                            }
                            Ext.apply(this.proxy.extraParams, { pid: filter.toString()});
                        }
                    }
                }
            }
        }, cfg)]);
    }
});