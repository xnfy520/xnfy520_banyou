Ext.define('Xnfy.store.LinkList', {
    extend: 'Ext.data.Store',
    requires: [
        'Xnfy.model.LinkList'
    ],
//    autoLoad: true,
    model: 'Xnfy.model.LinkList',
//    pageSize: 2,
    storeId: 'LinkList',
    sorters:[{property:'id',direction:'ASC'},{property:'sort',direction:'ASC'}],
    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            proxy: {
                type: 'ajax',
                actionMethods: {create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'},
                api:{
                    read: 'admin/link',
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
                    var tab = Ext.getCmp("center").getActiveTab();
                    var search_treepicker = tab.queryById('link_search_treepicker');
                    if(search_treepicker){
                        var store = search_treepicker.getStore().getRootNode();
                        var root_pid = store.data.id;
                        var search_pid = search_treepicker.getValue();
                        if(root_pid==search_pid){
                            Ext.apply(this.proxy.extraParams, { pid: null});
                            this.sort([{property:'id',direction:'ASC'},{property:'sort',direction:'ASC'}]);
                            tab.child('gridpanel').down('[dataIndex=sort]').setVisible(false);
                        }else if(search_pid<0){
                            Ext.apply(this.proxy.extraParams, { pid: 0});
                            this.sort([{property:'id',direction:'ASC'},{property:'sort',direction:'ASC'}]);
                            tab.child('gridpanel').down('[dataIndex=sort]').setVisible(false);
                        }else{
                            var node = store.findChild('id',search_pid, true);
                            if(node.data.leaf || node.childNodes.length<=0){
                               Ext.apply(this.proxy.extraParams, { pid: search_pid});
                            }else{
                                var datas = node.serialize();
                                var pids = [];
                                pids.push(search_pid);
                                if(datas.children && datas.children.length>0){
                                    Ext.Array.forEach(datas.children,function(items, indexs){
                                        if(items.leaf){
                                            pids.push(items.id);
                                        }else{
                                            if(items.children && items.children.length>0){
                                                 Ext.Array.forEach(items.children, function(itemx, indexx){
                                                    if(itemx.leaf){
                                                        pids.push(itemx.id);
                                                    }else{
                                                        if(itemx.children && itemx.children.length>0){
                                                            Ext.Array.forEach(itemx.children, function(item, index){
                                                                pids.push(item.id);
                                                            });
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                                Ext.apply(this.proxy.extraParams, { pid: pids.toString()});
                            }
                            this.sort([{property:'sort',direction:'ASC'},{property:'id',direction:'ASC'}]);
                            tab.child('gridpanel').down('[dataIndex=sort]').setVisible(true);
                        }
                    }
                }
            }
        }, cfg)]);
    }
});