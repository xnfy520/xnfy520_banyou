Ext.define('Xnfy.store.CommodityArticle', {
    extend: 'Ext.data.Store',
    requires: [
        'Xnfy.model.CommodityArticle'
    ],
//    autoLoad: true,
    model: 'Xnfy.model.CommodityArticle',
    // pageSize: 2,
    storeId: 'CommodityArticle',
    sorters:[{property:'id',direction:'ASC'},{property:'sort',direction:'ASC'}],
    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            proxy: {
                type: 'ajax',
                actionMethods: {create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'},
                api:{
                    read: 'admin/article/byFilter',
                    create : 'admin/articlemanage/insert',
                    update: 'admin/articlemanage/update',
                    destroy: 'admin/articlemanage/delete'
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
                    var tabpanelCenter = tab.queryById('tabpanelCenter');
                    var ctab = tabpanelCenter.getActiveTab();
                    var form = tab.child('form').getForm();
                    var type = 0;
                    var informations_ids = [];
                    var videos_ids = [];
                    if(ctab){
                        switch(ctab.itemId){
                            case 'aboutInformation':
                                type = 1;
                                var informations = form.findField('informations').getValue();
                                if(informations){
                                    var informations_result = Ext.JSON.decode(informations);
                                    if(informations_result){
                                        Ext.Array.forEach(informations_result,function(item,index){
                                            informations_ids.push(item.id);
                                        });
                                        informations_ids.toString();
                                    }
                                }
                            break;
                            case 'aboutVideo':
                                type = 2;
                                var videos = form.findField('videos').getValue();
                                if(videos){
                                    var videos_result = Ext.JSON.decode(videos);
                                    if(videos_result){
                                        Ext.Array.forEach(videos_result,function(item,index){
                                            videos_ids.push(item.id);
                                        });
                                        videos_ids.toString();
                                    }
                                }
                            break;
                        }

                        var pid = [];
                        if(tab.relationPid){
                            pid = tab.relationPid;
                        }

                        Ext.apply(t.proxy.extraParams, { type:type, pid: pid, informations_ids:informations_ids, videos_ids:videos_ids});

                        // if(tab.relationPid){
                        //     Ext.apply(t.proxy.extraParams, { pid: tab.relationPid,type:type, informations_ids:informations_ids, videos_ids:videos_ids});
                        // }else{
                        //     Ext.apply(t.proxy.extraParams, {type:type,informations_ids:informations_ids,videos_ids:videos_ids});
                        // }
                        // if(treepicker){
                        //     var store = treepicker.getStore().getRootNode();
                        //     var root_pid = store.data.id;
                        //     var search_pid = treepicker.getValue();
                        //     if(root_pid==search_pid){
                        //         Ext.apply(this.proxy.extraParams, { pid: null,type:type});
                        //         this.sort([{property:'id',direction:'ASC'},{property:'sort',direction:'ASC'}]);
                        //     }else if(search_pid<0){
                        //         Ext.apply(this.proxy.extraParams, { pid: 0,type:type});
                        //         this.sort([{property:'id',direction:'ASC'},{property:'sort',direction:'ASC'}]);
                        //     }else{
                        //         Ext.apply(this.proxy.extraParams, { pid: search_pid,type:type});
                        //         this.sort([{property:'sort',direction:'ASC'},{property:'id',direction:'ASC'}]);
                        //     }
                        // }
                    }
                }
            }
        }, cfg)]);
    }
});