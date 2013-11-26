Ext.define('Xnfy.controller.ClassifyMenu', {
    extend: 'Ext.app.Controller',
    models: [
        'ClassifyMenu','ClassifyList'
    ],
    stores: [
        'ClassifyMenu','ClassifyList'
    ],
    views: [
        'Menu','Center'
    ],
    init: function(application) {
        this.control({
            'xnfymenu [itemId=ClassifyMenu]':{
                selectionchange:function(t, selecteds){
                },
                cellclick:function(self, td, cellIndex, selected,eOpts){
                },
                itemclick:function( self, selected, item, index, e, eOpts ){
                    if(selected && !selected.data.leaf){
                        var center = Ext.getCmp("center");
                        var panel = Ext.getCmp(selected.id);
                        if(!panel){
                            panel =Ext.create('Xnfy.view.ClassifyList');
                            panel.setTitle(selected.data.title+' 分类');
                            var form = panel.child('form');
                            if(selected.raw.configuration){
                                var mergerC = selected.raw.configuration.split('|');
                                if(mergerC.length>0){
                                    var title = form.getForm().findField('title');
                                    var alias = form.getForm().findField('alias');
                                    var indexing = form.getForm().findField('indexing');
                                    var add =panel.child('gridpanel').down('[itemId=add]');
                                    var deletes =panel.child('gridpanel').down('[itemId=delete]');
                                    if(_.contains(mergerC, 'shop')){
                                        alias.hide();
                                        indexing.hide();
                                        panel.setTitle(selected.data.title+' 店铺');
                                        add.setText('添加店铺');
                                        deletes.setText('删除店铺');
                                        panel.child('gridpanel').down('[dataIndex=title]').text='店铺名称';
                                        panel.child('gridpanel').down('[dataIndex=indexing]').hidden = true;
                                        panel.child('gridpanel').down('[dataIndex=number]').hidden = true;
                                        title.setFieldLabel('店铺名称');
                                        title.emptyText = '店铺名称';
                                        var shop = {
                                            xtype:'form',
                                            itemId:'shopInfos',
                                            title:'店铺信息',
                                            autoScroll:true,
                                            bodyPadding:'5',
                                            defaults: {
                                                anchor: '100%',
                                                labelAlign:'top',
                                                labelStyle: 'font-weight:bold;margin-bottom:2px',
                                                stripCharsRe:new RegExp(/(^\s*)/g)
                                            },
                                            defaultType: 'textfield',
                                            items:[{
                                                fieldLabel: '店铺地址',
                                                emptyText:'店铺地址',
                                                name: 'address',
                                                allowBlank: false
                                            },{
                                                fieldLabel: '销售热线',
                                                emptyText:'销售热线',
                                                name: 'hotline',
                                                allowBlank: false
                                            },{
                                                fieldLabel: '工作时间',
                                                emptyText:'工作时间',
                                                name: 'working_time',
                                                allowBlank: false
                                            },{
                                                fieldLabel: '店铺详情',
                                                emptyText:'选择店铺详情相关文章',
                                                xtype:'combobox',
                                                name: 'aid',
                                                allowBlank: true,
                                                editable : false,
                                                value:0,
                                                store:Ext.create('Ext.data.Store', {
                                                    fields: ['title', 'id']
                                                }),
                                                displayField:'title',
                                                valueField:'id',
                                                listeners:{
                                                    afterrender:function(self){
                                                        Ext.Ajax.request({
                                                        url:"admin/article/getShop",
                                                        method:'post',
                                                        callback:function(records, operation, success){
                                                            var response = Ext.JSON.decode(success.responseText);
                                                            if(response.success){
                                                                if(response.data.length>0){
                                                                    response.data.unshift({'title':'选择店铺详情相关文章','id':0});
                                                                    var newstore = Ext.create('Ext.data.Store', {
                                                                        fields: ['title', 'id'],
                                                                        data : response.data
                                                                    });
                                                                    self.bindStore(newstore);
                                                                    self.setValue(0);
                                                                }
                                                            }
                                                        }
                                                    });
                                                    }
                                                }
                                            }]
                                        };
                                        form.insert(1,shop);
                                        var itemCover = panel.queryById('itemCover');
                                        itemCover.setTitle('店铺地址图片');
                                        var combobox_image = form.getForm().findField('combobox_image');
                                        combobox_image.setFieldLabel('选择店铺地址图片');
                                        combobox_image.emptyText = '选择店铺地址图片';
                                        var newstore = Ext.create('Ext.data.Store', {
                                            fields: ['text', 'selected_image'],
                                            data : [
                                                {"text":"无图片", "selected_image":0},
                                                {"text":"选择图片", "selected_image":1}
                                            ]
                                        });
                                        combobox_image.bindStore(newstore);
                                        combobox_image.setValue(0);
                                    }else if(_.contains(mergerC, 'delivery_point')){
                                        alias.hide();
                                        indexing.hide();
                                        panel.setTitle(selected.data.title+' 自提点');
                                        add.setText('添加自提点');
                                        deletes.setText('删除自提点');
                                        panel.child('gridpanel').down('[dataIndex=title]').text='自提点名称';
                                        panel.child('gridpanel').down('[dataIndex=indexing]').hidden = true;
                                        panel.child('gridpanel').down('[dataIndex=number]').hidden = true;
                                        title = form.getForm().findField('title');
                                        title.setFieldLabel('自提点名称');
                                        title.emptyText = '自提点名称';
                                    }
                                }
                            }

                            var pid = selected.internalId;
                            // if(selected.internalId===0){
                                   form.setTitle('添加 分类');
                            // }else{
                            //     form.setTitle('添加 '+selected.data.title+' 子类');
                            // }
                            this.openClassify(panel,selected.id,pid);
                        }else{
                            center.setActiveTab(panel);
                        }
                    }
                },
                beforeexpand:function(p){
                    p.getRootNode().expand();
                },
                expand:function(p){
                    var coll = ['shop'];
                    p.getRootNode().eachChild(function(i){
                        if(!_.contains(coll,i.data.indexing)){
                            if(!i.isExpanded()){
                                i.expand();
                            }
                        }
                    });
                },
                containerclick:function( self, e, eOpts ){
                }
            },
            'xnfymenu [itemId=Configuration]':{
                cellclick:function(self, td, cellIndex, selected){
                    if(selected){
                        if(selected.internalId=='baseConfiguration'){
                            var center = Ext.getCmp("center");
                            var panel = Ext.getCmp(selected.id);
                            if(!panel){
                                panel =Ext.create('Xnfy.view.Configuration');
                                panel.setTitle(selected.data.text);
                                var pid = selected.internalId;
                                this.openConfiguration(panel,selected.id,pid);
                            }else{
                                center.setActiveTab(panel);
                            }
                        }
                        if(selected.internalId=='brandAllocation'){
                            this.openBrandAllocation();
                        }
                    }
                }
            },
            'xnfymenu [itemId=User]':{
                cellclick:function(self, td, cellIndex, selected){
                    if(selected){
                        var center = Ext.getCmp("center");
                        var panels = center.getComponent(selected.internalId);
                        if(panels){
                            center.setActiveTab(panels);
                        }else{
                            switch(selected.internalId){
                                case 'UserGroup':
                                    panel =Ext.create('Xnfy.view.UserGroup');
                                    panel.setTitle(selected.data.text);
                                    panel.child('form').setTitle('添加 分组');
                                    this.openUserGroup(panel,selected.internalId);
                                break;
                                case 'UserManage':
                                    panel =Ext.create('Xnfy.view.UserList');
                                    panel.setTitle(selected.data.text);
                                    panel.child('form').setTitle('添加 用户');
                                    this.openUserList(panel,selected.internalId);
                                break;
                            }
                        }
                    }
                }
            },
            'xnfymenu [itemId=ModuleMenu]':{
                cellclick:function(self, td, cellIndex, selected){
                   if(selected){
                        var center = Ext.getCmp("center");
                        var panel = center.getComponent(selected.internalId);
                        if(panel){
                            center.setActiveTab(panel);
                        }else{
                            switch(selected.internalId){
                                case 'FileManage':
                                    panel =Ext.create('Xnfy.view.FileManage');
                                    panel.setTitle(selected.data.text);
                                    this.openFileManage(panel,selected.internalId);
                                break;
                                case 'FileManager':
                                    panel =Ext.create('Xnfy.view.FileManager');
                                    panel.setTitle(selected.data.text);
                                    this.openFileManager(panel,selected.internalId);
                                break;
                                case 'ArticleManage':
                                    panel =Ext.create('Xnfy.view.ArticleList');
                                    panel.setTitle(selected.data.text);
                                    this.openArticleManage(panel,selected.internalId);
                                break;
                                case 'LinkManage':
                                    panel =Ext.create('Xnfy.view.LinkList');
                                    panel.setTitle(selected.data.text);
                                    panel.child('form').setTitle('添加 链接');
                                    this.openLinkManage(panel,selected.internalId);
                                break;
                                case 'CommodityManage':
                                    // console.log(selected);
                                break;
                            }
                        }
                        if(selected.raw.flag && selected.raw.flag=='CommodityManage'){
                            panel =Ext.create('Xnfy.view.CommodityManage');
                            panel.setTitle('管理 '+selected.data.text+'商品');
                            this.openCommodityManage(panel,selected.internalId,selected);
                        }else{
                            if(selected.data.id=='brandAllocation'){
                                this.openBrandAllocation();
                            }
                        }
                    }
                },
                beforeexpand:function(p){
                    var menuc = Ext.ComponentQuery.query('xnfymenu [itemId=ModuleMenu]')[0];
                    var menud = menuc.getRootNode();
                    menud.eachChild(function(i){
                        if(i.internalId=='CommodityManage'){
                            if(!i.hasChildNodes()){
                                var stores = Ext.create('Xnfy.store.ClassifyMenu');
                                var store = stores.load({params:{indexing:'commodity',sub:1},scope:this,callback:function(records,operation,success){
                                    if(success){
                                        var record = [];
                                        Ext.Array.forEach(records,function(item,index,all){
                                            var record_ = [];
                                            Ext.Array.forEach(item.childNodes,function(items,indexs,alls){
                                                // console.log(items);
                                                if(items.childNodes && items.childNodes.length>0){
                                                    // console.log(items.data);
                                                    var record__ = [];
                                                    Ext.Array.forEach(items.childNodes,function(itemss,indexss,allss){
                                                        record__.push({id:itemss.data.id,text:itemss.data.title,leaf:true,indexing:itemss.data.indexing,flag:'CommodityManage',parent:item.raw});
                                                    });
                                                    // console.log('--------');
                                                    // console.log(record__);
                                                    record_.push({id:items.data.id,text:items.data.title,leaf:false,indexing:items.data.indexing,parent:items.raw,children:record__});
                                                }else{
                                                    record_.push({id:items.data.id,text:items.data.title,leaf:true,indexing:items.data.indexing,flag:'CommodityManage',parent:item.raw});
                                                }
                                            });
                                            // console.log(record_);
                                            if(item.raw.indexing!='brands'){
                                                record.push({id:'CommodityClassify-'+item.data.id,text:item.data.title,indexing:item.data.indexing,leaf:false,children:record_});
                                            }
                                        });
                                        i.appendChild({id:'brandAllocation',text:'品牌分配',leaf:true});
                                        i.appendChild(record);
                                        i.expand();
                                    }
                                }});
                            }
                        }
                    });
                },
                'itemcontextmenu' : function(menutree, selected, items, index, e) {
                    var nodemenu = new Ext.menu.Menu({});
                    if(selected.raw.flag && selected.raw.flag=='CommodityManage'){
                        e.preventDefault();
                        e.stopEvent();
                        nodemenu = new Ext.menu.Menu({
                            floating : true,
                            items : [{
                                text : "添加商品",
                                handler : function() {
                                    var center = Ext.getCmp("center");
                                    var panel = center.getComponent(selected.raw.indexing+'-add-'+selected.raw.id);
                                    if(panel){
                                        center.setActiveTab(panel);
                                    }else{
                                        panel =Ext.create('Xnfy.view.CommodityManageAdd');
                                        panel.setTitle('添加 '+selected.raw.text+'商品');
                                        panel.id = selected.raw.indexing+'-add-'+selected.raw.id;
                                        panel.data = selected.raw;
                                        center.setActiveTab(center.add(panel));
                                    }
                                }
                            }]
                        });
                        nodemenu.showAt(e.getXY());
                    }
                    switch(selected.internalId){
                        case 'ArticleManage':
                            e.preventDefault();
                            e.stopEvent();
                            nodemenu = new Ext.menu.Menu({
                                floating : true,
                                items : [{
                                    text : "添加文章",
                                    handler : function() {
                                        var center = Ext.getCmp("center");
                                        var panel = center.getComponent(selected.internalId+'-add');
                                        if(panel){
                                            center.setActiveTab(panel);
                                        }else{
                                            panel =Ext.create('Xnfy.view.ArticleAdd');
                                            panel.setTitle('添加 文章');
                                            panel.id = selected.internalId+'-add';
                                            center.setActiveTab(center.add(panel));
                                        }
                                    }
                                }]
                            });
                            nodemenu.showAt(e.getXY());
                        break;
                    }
                }
            }
        });
    },
    openConfiguration:function(panel,id,pid){
        var n = (typeof panel == "string" ? panel : id || panel.id);
        var center = Ext.getCmp("center");
        var tab = center.getComponent(n);
        if (tab) {
            center.setActiveTab(tab);
        } else if(typeof panel!="string"){
            panel.id = n;
            center.setActiveTab(center.add(panel));
            var stores = Ext.create('Xnfy.store.Configuration');
            var store = stores.load({scope:this,callback:function(records,operation,success){}});
            panel.child('gridpanel').reconfigure(store);
        }
    },
    openClassify : function (panel,id,pid){
        var n = (typeof panel == "string" ? panel : id || panel.id);
        var center = Ext.getCmp("center");
        var tab = center.getComponent(n);
        if (tab) {
            center.setActiveTab(tab);
        } else if(typeof panel!="string"){
            panel.id = n;
            panel.class='classify';
            panel.openid = pid;
            var gridpanel = panel.child('gridpanel');
            var pagingtoolbar = gridpanel.getDockedItems('pagingtoolbar')[0];
            var stores = Ext.create('Xnfy.store.ClassifyList');
            var store = stores.load({params:{pid:pid},scope:this,callback:function(records,operation,success){
                // if(success){
                //     if(records.length<=0){
                //         if(panel.child('form')){
                //             panel.child('form').expand(true);
                //         }
                //     }
                // }
            }});
            gridpanel.reconfigure(store);
            pagingtoolbar.bindStore(store);

            center.setActiveTab(center.add(panel));
        }
    },
    openFileManage : function (panel,id){
        var n = (typeof panel == "string" ? panel : id || panel.id);
        var center = Ext.getCmp("center");
        var tab = center.getComponent(n);
        if (tab) {
            center.setActiveTab(tab);
        } else if(typeof panel!="string"){
            panel.id = n;
            var gridpanel = panel.child('gridpanel');
            var pagingtoolbar = gridpanel.getDockedItems('pagingtoolbar')[0];
            var stores = Ext.create('Xnfy.store.FileManage');
            var store = stores.load({scope:this,callback:function(records,operation,success){
            }});
            gridpanel.reconfigure(store);
            pagingtoolbar.bindStore(store);
            center.setActiveTab(center.add(panel));
        }
    },
    openFileManager : function (panel,id){
        var n = (typeof panel == "string" ? panel : id || panel.id);
        var center = Ext.getCmp("center");
        var tab = center.getComponent(n);
        if (tab) {
            center.setActiveTab(tab);
        } else if(typeof panel!="string"){
            panel.id = n;
            var gridpanel = panel.child('gridpanel');
            center.setActiveTab(center.add(panel));
        }
    },
    openArticleManage : function (panel,id){
        var n = (typeof panel == "string" ? panel : id || panel.id);
        var center = Ext.getCmp("center");
        var tab = center.getComponent(n);
        if (tab) {
            center.setActiveTab(tab);
        } else if(typeof panel!="string"){
            panel.id = n;
            var gridpanel = panel.child('gridpanel');
            var pagingtoolbar = gridpanel.getDockedItems('pagingtoolbar')[0];
            var stores = Ext.create('Xnfy.store.ArticleList');
            var store = stores.load({scope:this,callback:function(records,operation,success){
            }});
            gridpanel.reconfigure(store);
            pagingtoolbar.bindStore(store);
            center.setActiveTab(center.add(panel));
        }
    },
    openLinkManage : function(panel,id,pid){
        var n = (typeof panel == "string" ? panel : id || panel.id);
        var center = Ext.getCmp("center");
        var tab = center.getComponent(n);
        if (tab) {
            center.setActiveTab(tab);
        } else if(typeof panel!="string"){
            panel.id = n;
            var gridpanel = panel.child('gridpanel');
            var pagingtoolbar = gridpanel.getDockedItems('pagingtoolbar')[0];
            var stores = Ext.create('Xnfy.store.LinkList');
            var store = stores.load({scope:this,callback:function(records,operation,success){
                // if(success){
                //     if(records.length<=0){
                //         if(panel.child('form')){
                //             panel.child('form').expand(true);
                //         }
                //     }
                // }
            }});
            gridpanel.reconfigure(store);
            pagingtoolbar.bindStore(store);
            center.setActiveTab(center.add(panel));
        }
    },
    openUserGroup: function(panel,id){
        var n = (typeof panel == "string" ? panel : id || panel.id);
        var center = Ext.getCmp("center");
        var tab = center.getComponent(n);
        if (tab) {
            center.setActiveTab(tab);
        } else if(typeof panel!="string"){
            panel.id = n;
            var gridpanel = panel.child('gridpanel');
            var pagingtoolbar = gridpanel.getDockedItems('pagingtoolbar')[0];
            var stores = Ext.create('Xnfy.store.UserGroup');
            var store = stores.load({scope:this,callback:function(records,operation,success){
                // if(success){
                //     if(records.length<=0){
                //         if(panel.child('form')){
                //             panel.child('form').expand(true);
                //         }
                //     }
                // }
            }});
            gridpanel.reconfigure(store);
            pagingtoolbar.bindStore(store);
            center.setActiveTab(center.add(panel));
        }
    },
    openUserList : function(panel,id){
        var n = (typeof panel == "string" ? panel : id || panel.id);
        var center = Ext.getCmp("center");
        var tab = center.getComponent(n);
        if (tab) {
            center.setActiveTab(tab);
        } else if(typeof panel!="string"){
            panel.id = n;
            var gridpanel = panel.child('gridpanel');
            var pagingtoolbar = gridpanel.getDockedItems('pagingtoolbar')[0];
            var stores = Ext.create('Xnfy.store.UserList');
            var store = stores.load({scope:this,callback:function(records,operation,success){
                // if(success){
                //     if(records.length<=0){
                //         if(panel.child('form')){
                //             panel.child('form').expand(true);
                //         }
                //     }
                // }
            }});
            gridpanel.reconfigure(store);
            pagingtoolbar.bindStore(store);
            center.setActiveTab(center.add(panel));
        }
    },
    openCommodityManage : function(panel,id,obj){
        // var n = (typeof panel == "string" ? panel : id || panel.id);
        // var n = obj.id;
        // console.log(n);
        // console.log(obj);
        var n = 'Commodity-List-'+obj.internalId;
        var center = Ext.getCmp("center");
        var tab = center.getComponent(n);
        if (tab) {
            center.setActiveTab(tab);
        } else if(typeof panel!="string"){
            panel.id = n;
            panel.data = obj.raw;
            var gridpanel = panel.child('gridpanel');
            var pagingtoolbar = gridpanel.getDockedItems('pagingtoolbar')[0];
            var stores = Ext.create('Xnfy.store.CommodityList');
            var store = stores.load({scope:this,params:{category:obj.internalId},callback:function(records,operation,success){
            }});
            gridpanel.reconfigure(store);
            pagingtoolbar.bindStore(store);
            center.setActiveTab(center.add(panel));
        }
    },
    openBrandAllocation:function(){
        Ext.create('Ext.window.Window', {
            title: '品牌分配',
            modal:true,
            height: 500,
            width: 650,
            constrain:true,
            bodyPadding:5,
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [{
                title: '品牌列表',
                xtype: 'treepanel',
                itemId: 'brandsList',
                header:false,
                height:407,
                store: Ext.create('Xnfy.store.ClassifyMenu',{
                }).load({
                    params:{indexing:'brands'},
                    scope:this,
                    callback:function(records,operation,success){
                        operation.node.expand();
                    }
                }),
                displayField: 'title',
                // rootVisible:false,
                // margin: '0 5 0 0',
                flex: 1,
                autoScroll:true,
                viewConfig: {
                    plugins: {
                        displayField: 'title',
                        ptype: 'treeviewdragdrop',
                        enableDrag: true,
                        enableDrop: false
                    },
                    copy: true
                },
                listeners:{
                    itemexpand:function(self){
                        self.updateInfo(true,{title:'品牌列表（'+self.childNodes.length+'个）'});
                        self.eachChild(function(i){
                            i.updateInfo(true,{title:i.data.title+(i.data.alias ? '（'+i.data.alias+'）' : '')});
                        });
                    }
                }
            }, {
                title: '分配列表',
                xtype: 'treepanel',
                itemId: 'brandAllocationStructure',
                header:false,
                height:407,
                autoScroll:true,
                // rootVisible:false,
                store: Ext.create('Ext.data.TreeStore', {
                    fields: [
                        {
                            name: 'id'
                        },
                        {
                            name: 'title'
                        },
                        {
                            name:'alias'
                        }
                    ],
                    root: {
                        title:'品牌分配',
                        id:0,
                        expanded: true,
                        allowDrop:false
                    },
                    listeners:{
                        beforeremove:function( self, node, isMove, eOpts ){
                            var s = (self.childNodes.length-1)>0 ? '（已分配 '+(self.childNodes.length)+' 个品牌）' : '';
                            self.updateInfo(true,{title:self.raw.title+s});
                        },
                        remove:function( self, node, isMove, eOpts ){
                            var s = (self.childNodes.length)>0 ? '（已分配 '+(self.childNodes.length)+' 个品牌）' : '';
                            self.updateInfo(true,{title:self.raw.title+s});
                        },
                        refresh:function(self, eOpts){
                            var s = (self.childNodes.length)>0 ? '（已分配 '+(self.childNodes.length)+' 个品牌）' : '';
                            self.updateInfo(true,{title:self.raw.title+s});
                        },
                        expand:function(self){
                            var brands = self.getOwnerTree();
                            if(brands && brands.previousSibling().getRootNode()){
                                var root = brands.previousSibling().getRootNode();
                                Ext.Array.forEach(self.childNodes,function(item,index,all){
                                    if(item.childNodes.length<=0 && !item.data.leaf){
                                        // item.updateInfo(true,{loading:true});
                                        Ext.Ajax.request({
                                            url:"admin/configuration/getBrandAllocationStructure",
                                            params:{id:item.raw.id},
                                            method:'post',
                                            callback:function(records, operation, success){
                                                var response = Ext.JSON.decode(success.responseText);
                                                if(response.success){
                                                    if(response.data.length>0){
                                                        var s = response.data.length>0 ? '（已分配 '+(response.data.length)+' 个品牌）' : '';
                                                        item.updateInfo(true,{title:item.raw.title+s});
                                                        Ext.Array.forEach(response.data,function(ite,ind,all){
                                                            var k = getO(root.childNodes,ite.id);
                                                            item.appendChild(k);
                                                        });
                                                    }
                                                    // item.updateInfo(true,{loading:false});
                                                }else{
                                                    // item.updateInfo(true,{loading:false});
                                                    Ext.create('Xnfy.util.common').uxNotification(false,response.msg);
                                                }
                                            }
                                        });
                                    }
                                });
                            }
                            function getO(node,id){
                                var news = {};
                                var n = 0;
                                Ext.Array.forEach(node,function(item,index,all){
                                    n++;
                                    if(item.data.id==id){
                                        news = item.copy('new-'+item.data.id+'-'+(Math.random()+1)+'-'+n);
                                        item.raw.title = item.data.title;
                                        news.updateInfo(true,{id:item.raw.id});
                                    }
                                });
                                return news;
                            }
                        }
                    }
                }),
                displayField: 'title',
                flex: 1,
                listeners: {
                    beforerender:function(self){
                        var menud = self.getRootNode();
                        Ext.create('Xnfy.store.ClassifyMenu').load({params:{indexing:'commodity',sub:1},scope:this,callback:function(records,operation,success){
                            if(success){
                                var record = [];
                                Ext.Array.forEach(records,function(item,index,all){
                                    if(item.data.indexing!='brands'){
                                        var record_ = [];
                                        Ext.Array.forEach(item.childNodes,function(items,indexs,alls){
                                            var record__ = [];
                                            Ext.Array.forEach(items.childNodes,function(itemss,indexss,allss){
                                                record__.push({
                                                    allowDrag:false,
                                                    id:itemss.data.id,
                                                    title:itemss.data.title,
                                                    indexing:itemss.data.indexing
                                                });
                                            });
                                            record_.push({
                                                allowDrag:false,
                                                id:items.data.id,
                                                title:items.data.title,
                                                indexing:items.data.indexing,
                                                children:record__
                                            });
                                        });
                                        record.push({
                                            allowDrag:false,
                                            allowDrop:false,
                                            // expanded:true,
                                            id:item.data.id,
                                            title:item.data.title,
                                            indexing:item.data.indexing,
                                            flag:'root',
                                            children:record_
                                        });
                                    }
                                });
                                menud.appendChild(record);
                                menud.expand(true);
                                menud.collapseChildren();
                            }
                        }});
                    },
                    'itemcontextmenu' : function(menutree, selected, items, index, e) {
                        var nodemenu = new Ext.menu.Menu({});
                        if(!!selected.raw.leaf){
                            e.preventDefault();
                            e.stopEvent();
                            nodemenu = new Ext.menu.Menu({
                                floating : true,
                                items : [{
                                    text : "删除",
                                    handler : function(self) {
                                        console.log(selected.remove());
                                    }
                                }]
                            });
                            nodemenu.showAt(e.getXY());
                        }
                    }
                },
                viewConfig: {
                    plugins: {
                        ptype: 'treeviewdragdrop',
                        displayField: 'title',
                        enableDrag: true,
                        enableDrop: true,
                        appendOnly: false,
                        sortOnDrop:false
                    },
                    listeners: {
                        nodedragover: function(targetNode, position, dragData, e){
                            var allow = true;
                            if(targetNode){
                                if(targetNode.data.leaf===true){
                                    if(dragData.view.id!=this.id){
                                        if(targetNode.parentNode.childNodes.length>0){
                                            Ext.Array.forEach(targetNode.parentNode.childNodes,function(items,indexs,alls){
                                                if(items.data.id==dragData.records[0].data.id){
                                                    allow = false;
                                                }
                                            });
                                            if(allow){
                                                return true;
                                            }else{
                                                return false;
                                            }
                                        }
                                    }else{
                                        if(dragData.records[0].parentNode.id==targetNode.parentNode.id){
                                            return true;
                                        }else{
                                            if(targetNode.parentNode.childNodes.length>0){
                                                Ext.Array.forEach(targetNode.parentNode.childNodes,function(items,indexs,alls){
                                                    if(items.data.id==dragData.records[0].data.id){
                                                        allow = false;
                                                    }
                                                });
                                                if(allow){
                                                    return true;
                                                }else{
                                                    return false;
                                                }
                                            }
                                        }
                                    }
                                }else{
                                    if(targetNode.childNodes.length>0){
                                        if(targetNode.childNodes[0].data.leaf){
                                            Ext.Array.forEach(targetNode.childNodes,function(items_a,indexs_a,alls_a){
                                                if(items_a.data.id==dragData.records[0].data.id){
                                                    allow = false;
                                                }
                                            });
                                            return allow;
                                        }else{
                                            return false;
                                        }
                                    }
                                }
                                if(targetNode.childNodes.length>0){
                                    Ext.Array.forEach(targetNode.childNodes,function(items,indexs,alls){
                                        if(items.data.id==dragData.records[0].data.id){
                                            allow = false;
                                        }
                                    });
                                    if(allow){
                                        return true;
                                    }else{
                                        return false;
                                    }
                                }
                            }
                        },
                        drop:function( node, data, overModel, dropPosition){
                            if(overModel.data.leaf){
                                var ss = overModel.parentNode.childNodes.length>0 ? '（已分配 '+(overModel.parentNode.childNodes.length)+' 个品牌）' : '';
                                overModel.parentNode.updateInfo(true,{title:overModel.parentNode.raw.title+ss});
                            }else{
                                var s = overModel.childNodes.length>0 ? '（已分配 '+(overModel.childNodes.length)+' 个品牌）' : '';
                                overModel.updateInfo(true,{title:overModel.raw.title+s});
                            }
                            if(overModel.store.ownerTree){
                                overModel.store.ownerTree.getView().refresh();
                            }
                        }
                    }
                }
            }],
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                ui: 'footer',
                items: [{
                        xtype: 'tbfill'
                    },{
                        text: '确认修改',
                        formBind: true,
                        handler:function(button){
                            var tree = this.up('window').queryById('brandAllocationStructure');
                            var nodes = tree.getRootNode();
                            var structure = nodes.serialize()['children'];
                            Ext.Ajax.request({
                                url:"admin/configuration/saveBrandAllocationStructure",
                                params:{structure:JSON.stringify(structure)},
                                method:'post',
                                callback:function(records, operation, success){
                                    var response = Ext.JSON.decode(success.responseText);
                                    if(response.success){
                                        Ext.create('Xnfy.util.common').uxNotification(true,'修改成功');
                                    }else{
                                         Ext.create('Xnfy.util.common').uxNotification(false,'修改失败');
                                    }
                                }
                            });
                        }
                    }]
            }]
        }).show();
    }
});
