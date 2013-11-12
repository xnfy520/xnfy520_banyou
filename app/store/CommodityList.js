Ext.define('Xnfy.store.CommodityList', {
    extend: 'Ext.data.Store',
    requires: [
        'Xnfy.model.CommodityList'
    ],
    model: 'Xnfy.model.CommodityList',
    storeId: 'CommodityList',
    sorters:[{property:'id',direction:'DESC'}],
    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            proxy: {
                type: 'ajax',
                actionMethods: {create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'},
                api:{
                    read: 'admin/commodity',
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
                    if(tab.data){
                        // Ext.apply(this.proxy.extraParams, { category: tab.data.id});
                        var brand_search = tab.queryById('brandSearch');
                        console.log(brand_search.getValue());
                        console.log(tab.data.id);
                        var data = {category: tab.data.id};
                        if(brand_search){
                            var brand = brand_search.getValue();
                            if(brand==0){
                                data = {category: tab.data.id,brand:''};
                            }else if(brand<0){
                                data = {category: tab.data.id,brand:0};
                            }else{
                                data = {category: tab.data.id,brand:brand};
                            }
                        }
                        Ext.apply(this.proxy.extraParams, data);
                    }
                }
            }
        }, cfg)]);
    }
});