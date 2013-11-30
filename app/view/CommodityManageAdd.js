Ext.define('Xnfy.view.CommodityManageAdd', {
    extend: 'Ext.panel.Panel',
    requires: [
        'Ext.ux.ProgressBarPager',
        'Xnfy.util.common'
    ],
    alias: 'widget.commoditymanageadd',
    title: 'Tab',
    closable: true,
    layout: {
        type: 'fit'
    },
    initComponent: function() {
        var me = this;
        var hid = ['accessorie_division']; //如果是配件专区,开启配件搭配价格
        Ext.applyIf(me, {
            items:[{
                xtype: 'form',
                layout:'border',
                listeners:{
                    render:function(){
                        if(me.data.parent){
                            Ext.Ajax.request({
                                url:"admin/article/getRelation",
                                method:'POST',
                                params:{indexing:me.data.parent.indexing},
                                callback:function(records, operation, success){
                                    var response = Ext.JSON.decode(success.responseText);
                                    if(response.data){
                                        me.relationPid = response.data.id;
                                    }
                                }
                            });
                            Ext.Ajax.request({
                                url:"admin/classify/getCommodityAccessorie",
                                params:{type : me.data.parent.indexing},
                                method:'POST',
                                callback:function(records, operation, success){
                                    if(success.responseText){
                                        var response = Ext.JSON.decode(success.responseText);
                                        if(response.data && response.data.length>0){
                                            me.suitData = response.data;
                                        }
                                    }
                                }
                            });
                        }
                    }
                },
                items: [{
                    xtype: 'panel',
                    region:'west',
                    layout:'accordion',
                    flex: 0.34,
                    tabPosition:'bottom',
                    defaults:{
                        bodyPadding:'5'
                    },
                    style: {
                        borderStyle: 'solid',
                        borderWidth:"0 5px 0 0",
                        borderColor:"#ADD2ED"
                    },
                    items:[{
                        xtype:'form',
                        title:'基本信息',
                        itemId:"base",
                        autoScroll:true,
                        tabConfig: {
                            style:'margin-left:1px',
                            flex: 0.3
                        },
                        fieldDefaults: {
                            labelAlign: 'top',
                            labelStyle: 'font-weight:bold;margin-bottom:2px',
                            margin:'0 0 2 0'
                        },
                        items: [{
                            fieldLabel: '商品名称',
                            allowBlank: false,
                            name: 'name',
                            anchor:'100%',
                            emptyText:'商品名称',
                            xtype:'textfield'
                        },{
                            fieldLabel: '商品标题',
                            name: 'title',
                            anchor:'100%',
                            xtype:'textareafield',
                            allowBlank: false,
                            rows:2,
                            emptyText:'商品标题'
                            // margin:'0 0 -5 0'
                        }, {
                            fieldLabel: '商品简介',
                            xtype: 'textareafield',
                            name: 'description',
                            anchor:'100%',
                            rows:2,
                            emptyText:'商品简介'
                            // margin:'0 0 -5 0'
                        }, {
                            fieldLabel: '商品配置',
                            xtype: 'textareafield',
                            name: 'collocate',
                            anchor:'100%',
                            rows:2,
                            emptyText:'商品配置'
                            // margin:'0 0 -5 0'
                        },{
                            fieldLabel: '市场价格',
                            name: 'market_price',
                            anchor:'100%',
                            emptyText:'市场价格',
                            xtype:'numberfield',
                            minValue: 0
                        },{
                            fieldLabel: '商城价格',
                            allowBlank: false,
                            name: 'selling_price',
                            anchor:'100%',
                            emptyText:'商城价格',
                            xtype:'numberfield',
                            minValue: 0
                        },{
                            fieldLabel: '搭配价格',
                            name: 'collocation_price',
                            anchor:'100%',
                            emptyText:'商城价格',
                            xtype:'numberfield',
                            hidden:true,
                            minValue: 0,
                            listeners:{
                                render:function(self){
                                    var datas = self.up('commoditymanageadd').data;
                                    Ext.Array.forEach(hid,function(item,index,all){
                                        if(datas.parent.indexing==item){
                                            self.setVisible(true);
                                        }
                                    });
                                }
                            }
                        }]
                    },{
                        xtype:'form',
                        itemId:'commodity_classify',
                        title:'筛选信息',
                        autoScroll:true,
                        fieldDefaults: {
                            labelAlign: 'top',
                            labelStyle: 'font-weight:bold;margin-bottom:2px',
                            labelWidth:'65',
                            margin:'0 0 2 0'
                        },
                        items: [
                        ],
                        listeners:{
                            render:function(self){
                                var datas = self.up('commoditymanageadd').data;
                                if(datas && self.items.length<=0){
                                    Ext.Ajax.request({
                                        url:"admin/commodity/getFilter",
                                        method:'POST',
                                        params:{id:datas.id,indexing:datas.indexing},
                                        callback:function(records, operation, response){
                                            var responses = Ext.decode(response.responseText);
                                            if(responses.success && responses.data){
                                                Ext.Array.forEach(responses.data,function(item,index,all){
                                                    if(item.childs){
                                                        item.childs.unshift({title:'请选择'+item.title,id:0});
                                                        // var multi = ['orientation','gsm'];
                                                        var mul = false;
                                                        var val = 0;
                                                        var name = 'filter'+item.id;
                                                        if(item.indexing=='brand'){
                                                            name = 'brand';
                                                        }else{
                                                            Ext.Array.forEach(item.childs,function(it,ind,al){
                                                                if(it.alias){
                                                                    item.childs[ind].title = (it.alias ? it.title+'（'+it.alias+'）' : '');
                                                                }
                                                            });
                                                        }
                                                        // Ext.Array.forEach(multi,function(itm,index,all){
                                                        //     // if(itm==item.indexing){
                                                        //     //     mul = true;
                                                        //     //     val = '';
                                                        //     //     item.childs.shift();
                                                        //     // }
                                                        if(item.configuration){
                                                            var mergerC = item.configuration.split('|');
                                                            if(mergerC.length>0){
                                                                if(_.contains(mergerC, 'multi')){
                                                                    mul = true;
                                                                    val = '';
                                                                    item.childs.shift();
                                                                }
                                                            }
                                                        }
                                                        // });
                                                        var combo = Ext.create('Ext.form.ComboBox', {
                                                            fieldLabel:item.title,
                                                            anchor:'100%',
                                                            editable : false,
                                                            name:name,
                                                            multiSelect:mul,
                                                            // allowBlank: false,
                                                            value:val,
                                                            emptyText : '请选择'+item.title,
                                                            store:Ext.create('Ext.data.Store', {
                                                                fields: ['title', 'id'],
                                                                data : item.childs
                                                            }),
                                                            displayField:'title',
                                                            valueField:'id'
                                                        });
                                                        self.add(combo);
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    },{
                        xtype:'form',
                        title:'商品封面',
                        autoScroll:true,
                        fieldDefaults: {
                            labelAlign: 'top',
                            labelStyle: 'font-weight:bold;padding-bottom:2px'
                        },
                        items: [{
                            xtype:'hiddenfield',
                            // xtype:'textfield',
                            name:'cover',
                            itemId:'cover_filed',
                            fieldLabel:'封面地址',
                            // hidden:true,
                            labelAlign: 'top',
                            anchor:'100%',
                            labelStyle: 'font-weight:bold;padding-bottom:5px'
                        },{
                            xtype: 'combobox',
                            name:'combobox_image',
                            labelAlign: 'top',
                            anchor:'100%',
                            allowBlank: false,
                            hideLabel:true,
                            fieldLabel:'封面图片',
                            emptyText : '选择封面',
                            mode : 'local',// 数据模式，local代表本地数据
                            //readOnly : false,// 是否只读
                            editable : false,// 是否允许输入
                            //forceSelection : true,// 必须选择一个选项
                            //blankText : '请选择',// 该项如果没有选择，则提示错误信息,
                            labelStyle: 'font-weight:bold;padding-bottom:5px',
                            store:Ext.create('Ext.data.Store', {
                                fields: ['text', 'selected_image'],
                                data : [
                                    {"text":"无封面", "selected_image":0},
                                    {"text":"选择封面", "selected_image":1}
                                ]
                            }),
                            value:0,
                            displayField:'text',
                            valueField:'selected_image',
                            listConfig: {
                                listeners: {
                                    itemclick: function(list, record, eml, index,a,b) {
                                        if(index==1){
                                            var random = Ext.Date.format(new Date(),'timestamp');
                                            var iframeid = "iframe-filemanager-"+random;
                                            var imgwindow = "select-image-window";
                                            Ext.create('Ext.window.Window', {
                                                id:imgwindow,
                                                title: '选择图片',
                                                custom_variables:{image_id:'cover',filed_id:'cover_filed'},
                                                maximizable:false,
                                                resizable:false,
                                                modal:true,
                                                constrain: true,
                                                width:300,
                                                height:580,
                                                html:'<iframe id="'+iframeid+'" style="width:100%;height:100%;border:0" src="public/filemanager/dialog.php?type=1&random="'+Math.random()+'></iframe>',
                                                closable: true,
                                                style: {
                                                    borderStyle: '0 solid #fff'
                                                },
                                                listeners:{
                                                    scope:this,
                                                    close:function(self){
                                                        if(this.up('form').getForm().findField('cover').value==''){
                                                            this.up('form').getForm().findField('combobox_image').setValue(0);
                                                        }
                                                    },
                                                    afterrender:function(self){
                                                        self.setLoading(true);
                                                        subWin = window.frames[iframeid];
                                                        if (window.attachEvent) {
                                                            subWin.attachEvent("onload", function(){
                                                            });
                                                        }else {
                                                            subWin.addEventListener("load", function(){
                                                                self.setLoading(false);
                                                            }, true);
                                                        }
                                                    }
                                                }
                                            }).show();
                                        }else{
                                            this.up('form').getForm().findField('cover').setValue('');
                                        }
                                    }
                                }
                            },
                            listeners: {
                                scope: this,
                                change:function(combo,n,o){
                                    if(n==0){
                                        var img_cover = combo.up('form').queryById('cover');
                                        img_cover.setSrc('');
                                        img_cover.setVisible(false);
                                        combo.setValue(combo.store.getAt(0));
                                    }else{
                                        combo.setValue(combo.store.getAt(1));
                                    }
                                }
                            }
                        },
                        Ext.create('Ext.Img', {
                            itemId:'cover',
                            src: '',
                            hidden:true,
                            padding:'5px 0 0 0',
                            anchor:'100%'
                        })]
                    }]
                },{
                    xtype:'tabpanel',
                    region:'center',
                    itemId:'tabpanelCenter',
                    plain:true,
                    activeTab: 0,
                    tabPosition:'bottom',
                    defaults:{
                        bodyPadding:'5'
                    },
                    tabBar:{
                        height:40
                        // style:'margin:5px 0 0 0'
                    },
                    listeners:{
                        render:function(){
                            this.el.applyStyles('background:white');
                            var pa = ['accessorie_division','accessorie_division','accessorie_division'];
                            if(me.data){
                                if(_.contains(pa, me.data.parent.indexing)){
                                    // me.queryById('commoditySuit').close();
                                    // me.queryById('commodityCombination').close();
                                    me.queryById('commoditySuit').disable();
                                    me.queryById('commodityCombination').disable();
                                    me.queryById('commodityParams').disable();
                                    me.queryById('aboutVideos').disable();
                                    me.queryById('aboutInformations').disable();
                                }
                            }
                        },
                        afterrender:function(){
                            var commodityParams =  this.queryById('commodityParams');
                            var form = me.child('form').getForm();
                            var render_params = form.findField('render_params');
                            var render_inventorys = form.findField('render_inventorys');
                            var inventorys = form.findField('inventorys');
                            if(me.data){
                                 Ext.Ajax.request({
                                    url:"admin/commodity/getParameter",
                                    method:'POST',
                                    params:{pid:me.data.id},
                                    callback:function(records, operation, success){
                                        if(success.responseText){
                                            var response = Ext.JSON.decode(success.responseText);
                                            render_params.setValue(Ext.JSON.encode(response.data));
                                        }
                                    }
                                });

                                 Ext.Ajax.request({
                                    url:"admin/classify/getShop",
                                    method:'POST',
                                    callback:function(records, operation, success){
                                        if(success.responseText){
                                            var response = Ext.JSON.decode(success.responseText);
                                            if(response.data && response.data.length>0){
                                                render_inventorys.setValue(Ext.JSON.encode(response.data));
                                                if(inventorys.getValue()==''){
                                                    var inventorys_result = [];
                                                    Ext.Array.forEach(response.data,function(item_a,index_a){ //省
                                                         Ext.Object.each(item_a.children,function(key_a,value_a){ //市
                                                            Ext.Object.each(value_a.children,function(key_b, value_b){//区
                                                                var type = value_b.configuration.split('|');
                                                                if(_.contains(type, 'shop')){
                                                                    inventorys_result.push({id:value_b.id, status:1, value:''});
                                                                    Ext.Object.each(value_b.children,function(key_c, value_c){ //店
                                                                        inventorys_result.push({id:value_c.id, status:1, value:''});
                                                                    });
                                                                }else if(_.contains(type, 'delivery_point')){
                                                                    inventorys_result.push({id:value_b.id, status:1, value:''});
                                                                }
                                                            });
                                                        });
                                                    });
                                                    if(inventorys_result.length>0){
                                                        inventorys.setValue(Ext.JSON.encode(inventorys_result));
                                                        me.inventorysResult = Ext.JSON.encode(inventorys_result);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    },
                    items:[{
                        tabConfig: {
                            style:'margin:0 1px 0 5px'
                        },
                        title:'商品介绍',
                        defaults: {
                        },
                        defaultType: 'textfield',
                        xtype:'form',
                        items: [{
                                xtype: 'tinymce',
                                name:'details',
                                width:'100%',
                                value: '',
                                listeners: {
                                    afterrender:function(me){
                                    },
                                    change: function(me, newValue, oldValue) {
                                    },
                                    blur: function() {
                                    },
                                    focus: function(me) {
                                    },
                                    resize:function(me){
                                    }
                                }
                            },{
                                xtype:'textarea',
                                name:'render_params',
                                fieldLabel:'商品参数骨架',
                                hidden:true
                            },{
                                xtype:'textarea',
                                name:'params',
                                fieldLabel:'商品参数',
                                hidden:true
                            },{
                                xtype:'textarea',
                                name:'render_inventorys',
                                fieldLabel:'库存骨架',
                                hidden:true,
                                allowBlank: false
                            }],
                            listeners: {
                                afterlayout:function(me){
                                    me.down('tinymce').editor.settings.height = me.el.dom.clientHeight-70;
                                },
                                resize:function(me){
                                    if(Ext.get(me.down('tinymce').id+'-inputEl_ifr')){
                                        Ext.get(me.down('tinymce').id+'-inputEl_ifr').set({style:'height:'+(me.el.dom.clientHeight-70)+'px'});
                                    }
                                }
                            }
                    },{
                        title:'图片列表',
                        layout: 'fit',
                        items: []
                    },{
                        title: '库存状态',
                         xtype:'treepanel',
                        itemId:'commodityInventory',
                        rootVisible: false,
                        useArrows:true,
                        // singleExpand: true,
                        style:'border-top:1px solid #C0C0C0;',
                        margin:'5 0 0 0',
                        columns: [{
                            xtype: 'treecolumn',
                            text: '店铺',
                            dataIndex: "title",
                            width:300,
                            maxWidth:300,
                            // flex: 0.3,
                            sortable: false,
                            renderer:function(value,metaData,record,rowIndex,colIndex,store,view){
                                var v = value;
                                if(record.data.leaf==true){
                                    if(record.parentNode.raw.configuration){
                                        var list = record.parentNode.raw.configuration.split('|');
                                        if(_.contains(list, 'shop')){
                                            v = '<small style="color:blue">'+value+'</small>';
                                        }else if(_.contains(list, 'delivery_point')){
                                            v = '<small style="color:red">'+value+'</small>';
                                        }
                                    }
                                }
                                return v;
                            }
                        },
                        {
                            text: "状态",
                            dataIndex: "status",
                            // flex: 0.4,
                            width:100,
                            sortable: false,
                            align:'left',
                            editor: {
                                xtype:'combobox',
                                emptyText : '库存量',
                                mode : 'local',// 数据模式，local代表本地数据
                                editable : false,// 是否允许输入
                                value:1,
                                store:Ext.create('Ext.data.Store', {
                                    fields: ['text', 'value'],
                                    data : [
                                        {"text":"缺货", "value":0},
                                        {"text":"现货", "value":1},
                                        {"text":"预定", "value":2},
                                        {"text":"充足", "value":3},
                                        {"text":"少量", "value":4},
                                        {"text":"在途", "value":5}
                                    ]
                                }),
                                displayField:'text',
                                valueField:'value'
                            },
                            renderer:function(value,metaData,record,rowIndex,colIndex,store,view){
                                var v = value;
                                /*
                                    0 缺货 1 现货 2 预定 3 充足 4 少量 5 在途
                                */
                                switch(v){
                                    case 0:
                                        v = '缺货';
                                    break;
                                    case 1:
                                        v = '现货';
                                    break;
                                    case 2:
                                        v = '预定';
                                    break;
                                    case 3:
                                        v = '充足';
                                    break;
                                    case 4:
                                        v = '少量';
                                    break;
                                    case 5:
                                        v = '在途';
                                    break;
                                }
                                // if(record.data.leaf==true){
                                //     if(record.parentNode.raw.configuration){
                                //         var list = record.parentNode.raw.configuration.split('|');
                                //         if(_.contains(list, 'delivery_point')){
                                //             v = '';
                                //         }
                                //     }
                                // }
                                return v;
                            }
                        },
                        {
                            text: "备注",
                            dataIndex: "value",
                            // flex: 0.4,
                            width:350,
                            sortable: false,
                            editor: 'textfield',
                            renderer:function(value,metaData,record,rowIndex,colIndex,store,view){
                                var v = value;
                                if(record.data.leaf==true){
                                    v = Ext.util.Format.stripTags(value);
                                    metaData.tdAttr = 'data-qtip="' + v + '"';
                                }
                                return v;
                            }
                        }],
                        plugins: [
                            Ext.create('Ext.grid.plugin.CellEditing', {
                                pluginId:'inventorySave',
                                clicksToEdit: 1,
                                listeners: {
                                    cancelEdit: function(editor, context) {
                                    },
                                    beforeedit:function(editor, context){
                                        if(context.record.parentNode.raw.configuration){
                                            var list = context.record.parentNode.raw.configuration.split('|');
                                            if(context.record.data.leaf){
                                                if(_.contains(list, 'shop')){
                                                    return true;
                                                }else if(_.contains(list, 'delivery_point')){
                                                    return false;
                                                }
                                            }else{
                                                return false;
                                            }
                                        }else if(context.record.raw.configuration){
                                            var lists = context.record.raw.configuration.split('|');
                                            if(_.contains(lists, 'shop') || _.contains(lists, 'delivery_point')){
                                                return true;
                                            }else{
                                                return false;
                                            }
                                        }else{
                                            return false;
                                        }
                                    },
                                    edit:function(editor, context){
                                        if(context.record && context.record.dirty){
                                            var form = me.child('form').getForm();
                                            var inventorys_root = me.queryById('commodityInventory').getRootNode().serialize();
                                            var inventorys = form.findField('inventorys');
                                            if(inventorys_root){
                                                var inventorys_result = [];
                                                Ext.Object.each(inventorys_root.children, function(index_a, item_a){ //省
                                                    Ext.Object.each(item_a.children, function(index_b, item_b){ //市
                                                        Ext.Object.each(item_b.children, function(index_c, item_c){ //区
                                                            var type = item_c.configuration.split('|');
                                                            if(_.contains(type, 'shop')){
                                                                if(context.record.data.id==item_c.id){
                                                                    inventorys_result.push({id:context.record.data.id, status:context.record.data.status!==''?context.record.data.status:1, value:context.record.data.value});
                                                                }else{
                                                                    inventorys_result.push({id:item_c.id, status:item_c.status!==''?item_c.status:1, value:item_c.value});
                                                                }
                                                                Ext.Object.each(item_c.children,function(index_d, item_d){ //店
                                                                    if(context.record.data.id==item_d.id){
                                                                        inventorys_result.push({id:context.record.data.id, status:context.record.data.status!==''?context.record.data.status:1, value:context.record.data.value});
                                                                    }else{
                                                                        inventorys_result.push({id:item_d.id, status:item_d.status!==''?item_d.status:13, value:item_d.value});
                                                                    }
                                                                });
                                                            }else if(_.contains(type, 'delivery_point')){
                                                                if(context.record.data.id==item_c.id){
                                                                    inventorys_result.push({id:context.record.data.id, status:context.record.data.status!==''?context.record.data.status:1, value:context.record.data.value});
                                                                }else{
                                                                    inventorys_result.push({id:item_c.id, status:item_c.status!==''?item_c.status:1, value:item_c.value});
                                                                }
                                                            }
                                                        });
                                                    });
                                                });
                                                if(inventorys_result.length>0){
                                                    inventorys.setValue(Ext.JSON.encode(inventorys_result));
                                                }
                                            }
                                        }
                                    }
                                }
                            })
                        ],
                        store:Ext.create("Ext.data.TreeStore", {
                            fields: [
                                "title", "status", "value", "configuration"
                            ],
                            root: {
                                title: 'root',
                                id: 'root',
                                expanded:true
                            }
                        }),
                        listeners:{
                            afterrender:function(self){
                                var form = me.child('form').getForm();
                                var render_inventorys = form.findField('render_inventorys');
                                var root = self.getRootNode();
                                if(render_inventorys && render_inventorys.getValue()){
                                    root.appendChild(Ext.JSON.decode(render_inventorys.getValue()));
                                }
                                var inventorys = form.findField('inventorys');
                                if(inventorys.getValue()){
                                    var inventorys_value = Ext.JSON.decode(inventorys.getValue());
                                    if(inventorys && inventorys_value.length>0){
                                        root.eachChild(function(inventorys_item){ //省
                                            inventorys_item.eachChild(function(inventorys_item_children){ //市
                                                inventorys_item_children.eachChild(function(inventorys_item_children_a){ //区
                                                    var type = inventorys_item_children_a.raw.configuration.split('|');
                                                    if(_.contains(type, 'shop') || _.contains(type, 'delivery_point')){
                                                        Ext.Array.forEach(inventorys_value,function(re_item,re_index){
                                                            if(inventorys_item_children_a.raw.id==re_item.id){
                                                                inventorys_item_children_a.updateInfo(true,{status:re_item.status!==''?re_item.status:1,value:re_item.value});
                                                            }
                                                        });
                                                    }
                                                    if(_.contains(type, 'shop')){
                                                        inventorys_item_children_a.eachChild(function(inventorys_item_children_b){ //店
                                                                Ext.Array.forEach(inventorys_value,function(res_item,re_index){
                                                                    if(inventorys_item_children_b.raw.id==res_item.id){
                                                                        inventorys_item_children_b.updateInfo(true,{status:res_item.status!==''?res_item.status:1,value:res_item.value});
                                                                    }
                                                                });
                                                        });
                                                    }
                                                });
                                            });
                                        });
                                    }
                                }

                                root.expand(true);
                            },
                            activate:function(self){
                            }
                        }
                    },{
                        title:'详细参数',
                        xtype:'treepanel',
                        itemId:'commodityParams',
                        rootVisible: false,
                        useArrows:true,
                        singleExpand: true,
                        style:'border-top:1px solid #C0C0C0;',
                        margin:'5 0 0 0',
                        columns: [{
                            xtype: 'treecolumn',
                            text: '参数名',
                            dataIndex: "title",
                            width:300,
                            maxWidth:300,
                            // editor: 'textfield',
                            // flex: 0.3,
                            sortable: false
                        },
                        {
                            text: "参数值",
                            dataIndex: "value",
                            // flex: 0.4,
                            width:450,
                            sortable: false,
                            editor: 'textfield',
                            renderer:function(value,metaData,record,rowIndex,colIndex,store,view){
                                var v = value;
                                if(record.data.leaf==true){
                                    v = Ext.util.Format.stripTags(value);
                                    metaData.tdAttr = 'data-qtip="' + v + '"';
                                }
                                return v;
                            }
                        }],
                        plugins: [
                            Ext.create('Ext.grid.plugin.CellEditing', {
                                pluginId:'paramsSave',
                                clicksToEdit: 1,
                                listeners: {
                                    cancelEdit: function(editor, context) {
                                    },
                                    beforeedit:function(editor, context){
                                        if(!context.record.data.leaf){
                                            return false;
                                        }
                                    },
                                    edit:function(editor, context){
                                        var params = me.queryById('commodityParams');
                                        var datas = params.getRootNode().serialize();
                                        var result = [];
                                        Ext.Array.forEach(datas.children,function(item,index,all){
                                            if(item.leaf==false){
                                                if(item.children.length>0){
                                                    Ext.Array.forEach(item.children,function(ite,ind,all){
                                                        if(ite.value!=''){
                                                            result.push({id:ite.id,value:ite.value});
                                                        }
                                                    });
                                                }
                                            }
                                        });
                                        if(result.length>0){
                                            var form = me.child('form').getForm();
                                            var params_result = form.findField('params');
                                            params_result.setValue(Ext.JSON.encode(result));
                                        }
                                    }
                                }
                            })
                        ],
                        store:Ext.create("Ext.data.TreeStore", {
                            fields: [
                                "title", "value"
                            ],
                            root: {
                                title: 'root',
                                id: 'root',
                                expanded:true
                            }
                        }),
                        listeners:{
                            afterrender:function(self){
                                var form = me.child('form').getForm();
                                var render_params = form.findField('render_params');
                                var root = self.getRootNode();
                                if(render_params && render_params.getValue()){
                                    root.appendChild(Ext.JSON.decode(render_params.getValue()));
                                }
                                var params = form.findField('params');
                                root.eachChild(function(params_item){
                                    params_item.updateInfo(true,{value:'<i><small>共 '+params_item.childNodes.length+' 项</small></i>'});
                                });
                                if(params.getValue()){
                                    var params_value = Ext.JSON.decode(params.getValue());
                                    if(params && params_value.length>0){
                                        root.eachChild(function(params_item){
                                            params_item.eachChild(function(params_item_children){
                                                Ext.Array.forEach(params_value,function(re_item,re_index){
                                                    if(params_item_children.internalId==re_item.id){
                                                        params_item_children.updateInfo(true,{value:re_item.value});
                                                    }
                                                });
                                            });
                                        });
                                    }
                                }
                            },
                            activate:function(self){
                            }
                        }
                    },{
                        title: '优惠套装',
                        layout: 'border',
                        xtype: 'panel',
                        itemId:'commoditySuit',
                        bodyStyle:'background:white;',
                        margin:'-5px',
                        items: [{
                            xtype:'gridpanel',
                            flex: 1,
                            region: 'west',
                            columns: [
                                { text: '#',  dataIndex: 'id', width:70},
                                {
                                    text: '商品标题',
                                    dataIndex: 'title',
                                    flex: 1,
                                    renderer:function(value,metaData,record,rowIndex,colIndex,store,view){
                                        var v = Ext.util.Format.stripTags(value);
                                        metaData.tdAttr = 'data-qtip="' + v + '"';
                                        return v;
                                    }
                                },
                                {
                                    text: '价格',
                                    dataIndex: 'selling_price',
                                    width:100,
                                    align:'right',
                                    renderer:function(value,metaData,record,rowIndex,colIndex,store,view){
                                        return '&yen; '+Ext.util.Format.number(value,'0,000.00');
                                    }
                                }
                            ],
                            style: {
                                borderStyle: 'solid',
                                borderWidth:"0 5px 0 0",
                                borderColor:"#ADD2ED"
                            },
                            multiSelect: true,
                            viewConfig: {
                                plugins: {
                                    ptype: 'gridviewdragdrop',
                                    ddGroup: 'selDD',
                                    enableDrop:false
                                },
                                listeners: {
                                    drop: function(node, data, dropRec, dropPosition) {
                                    },
                                    itemremove:function(record, index){
                                    }
                                },
                                copy:true
                            },
                            listeners:{
                                afterrender:function(self){
                                    var filter = [];
                                    if(me.suitData){
                                        Ext.Array.forEach(me.suitData, function(item){
                                            filter.push(item.id);
                                        });
                                    }
                                    var stores = Ext.create('Xnfy.store.CorrelationCommodity');
                                     var store = stores.load({scope:this,params:{pid:filter.toString()},callback:function(records,operation,success){
                                     }});
                                    self.reconfigure(store);
                                    self.queryById('pagingtoolbarSuit').bindStore(store);
                                }
                            },
                            dockedItems: [{
                                xtype: 'toolbar',
                                padding:'5px 0 5px 5px',
                                items: [
                                    {
                                    itemId:'suit_treepicker',
                                    xtype: 'treepicker',
                                    // fieldLabel:'所属分类',
                                    // flex: 1,
                                    autoScroll:true,
                                    minPickerHeight:'auto',
                                    maxPickerHeight:200,
                                    emptyText:'无分类选择',
                                    blankText:'无分类选择',
                                    displayField : 'title',
                                    value:0,
                                    // margin:'25px 0 0 0',
                                    labelStyle: 'font-weight:bold;padding-bottom:5px',
                                    store: Ext.create('Ext.data.TreeStore', {
                                        fields: ["id","title"],
                                        root: {
                                            title:'全部相关配件',
                                            id:0,
                                            expanded: true
                                        }
                                    }),
                                    listeners:{
                                        afterrender:function( self, eOpts ){
                                            var type = [];
                                            var picker = self.getPicker();
                                            var root = picker.getRootNode();
                                            switch(me.data.parent.indexing){
                                                case 'cellphone_division':
                                                    type = 'cellphone';
                                                    root.updateInfo(false, {title:'全部手机相关配件'});
                                                break;
                                                case 'computer_division':
                                                    type = 'computer';
                                                    root.updateInfo(false, {title:'全部电脑相关配件'});
                                                break;
                                                case 'camera_division':
                                                    type = 'camera';
                                                    root.updateInfo(false, {title:'全部相机相关配件'});
                                                break;
                                            }
                                            if(type && me.suitData){
                                                root.appendChild(me.suitData);
                                                root.eachChild(function(item){
                                                    item.updateInfo(true,{leaf:true});
                                                });
                                            }
                                            self.setValue(0);
                                        },
                                        render: function(self){
                                        },
                                        select:function( self, record, eOpts ){
                                            self.collapse();
                                            if(record.data.root){
                                                var filter = [];
                                                if(me.suitData){
                                                    Ext.Array.forEach(me.suitData, function(item){
                                                        filter.push(item.id);
                                                    });
                                                }
                                                self.up('gridpanel').getStore().load({params:{pid:filter.toString()}});
                                            }else if(record.data.id>0){
                                                self.up('gridpanel').getStore().reload({params:{pid:record.data.id}});
                                            }
                                        }
                                    }
                                },
                                {
                                    xtype: 'searchfield',
                                    flex: 1,
                                    emptyText: '输入关键字',
                                    // labelSeparator:'',
                                    // fieldLabel: '商品列表',
                                    // labelWidth:60,
                                    labelStyle:'font-weight:bold',
                                    store:Ext.create('Xnfy.store.CorrelationCommodity')
                                }]
                            },{
                                xtype: 'pagingtoolbar',
                                itemId:'pagingtoolbarSuit',
                                dock: 'bottom',
                                store:Ext.create('Xnfy.store.CorrelationCommodity'),
                                displayInfo: false,
                                displayMsg:'<span style="margin-left:-55px">{2}条数据</span>'
                            }]
                        },{
                            xtype:'treepanel',
                            flex: 1,
                            itemId:'treeSuit',
                            region: 'center',
                            displayField:'title',
                            rootVisible: false,
                            // useArrows:true,
                            style:'border-top:1px solid #C0C0C0;',
                            hideHeaders: true,
                            columns: [{
                                xtype: 'treecolumn',
                                text: '套装名称',
                                dataIndex: "title",
                                editor: 'textfield',
                                flex: 1,
                                sortable: false
                            }],
                            listeners: {
                                'itemcontextmenu' : function(menutree, selected, items, index, e) {
                                    var nodemenu = new Ext.menu.Menu({});
                                    e.preventDefault();
                                    e.stopEvent();
                                    nodemenu = new Ext.menu.Menu({
                                        floating : true,
                                        items : [{
                                            text : "移除所选项",
                                            handler : function(self) {
                                                selected.remove();
                                                var form = me.child('form').getForm();
                                                var suits = form.findField('suits');
                                                var treeSuitRoot = me.queryById('treeSuit').getRootNode();
                                                suits.setValue(treeSuitRoot.childNodes.length>0 ? Ext.JSON.encode(treeSuitRoot.serialize()) : '');
                                            }
                                        }]
                                    });
                                    nodemenu.showAt(e.getXY());
                                }
                            },
                            viewConfig: {
                                plugins: {
                                    ptype: 'treeviewdragdrop',
                                    ddGroup:    'selDD',
                                    displayField: 'title',
                                    enableDrag: true,
                                    enableDrop: true,
                                    appendOnly: false,
                                    sortOnDrop:true
                                },
                                listeners: {
                                    beforedrop: function( node, data, overModel, dropPosition, dropHandlers, eOpts ){
                                        // data.records[0].setId(_.uniqueId('contacts_'));
                                        // console.log(data.records[0]);
                                    },
                                    drop: function(node, data, dropRec, dropPosition) {
                                        Ext.Array.forEach(data.records, function(item){
                                            var id = item.data.id;
                                            item.setId('suits_'+Ext.Date.format(new Date(), 'time'));
                                            item.set('tid',id);
                                            item.set('leaf',true);
                                        });
                                        var form = me.child('form').getForm();
                                        var suits = form.findField('suits');
                                        var treeSuitRoot = me.queryById('treeSuit').getRootNode();
                                        suits.setValue(Ext.JSON.encode(treeSuitRoot.serialize()));
                                        me.queryById('treeSuit').getView().refresh();
                                    },
                                    nodedragover: function( targetNode, position, dragData, e, eOpts ){
                                    }
                                }
                            },
                            plugins: [
                                Ext.create('Ext.grid.plugin.CellEditing', {
                                    clicksToEdit: 1,
                                    listeners: {
                                        cancelEdit: function(editor, context) {
                                        },
                                        beforeedit:function(editor, context){
                                            if(context.record.data.leaf){
                                                return false;
                                            }
                                        },
                                        edit:function(editor, context){
                                            var form = me.child('form').getForm();
                                            var suits = form.findField('suits');
                                            var treeSuitRoot = me.queryById('treeSuit').getRootNode();
                                            suits.setValue(Ext.JSON.encode(treeSuitRoot.serialize()));
                                        }
                                    }
                                })
                            ],
                            store:Ext.create("Ext.data.TreeStore", {
                                fields: [
                                    "id","title","tid"
                                ],
                                root: {
                                    id:'root',
                                    title:'root',
                                    expanded: true,
                                    allowDrop:false,
                                    allowDrag:false
                                },
                                listeners:{
                                }
                            }),
                            dockedItems: [{
                                xtype: 'toolbar',
                                padding:'5px 0 5px 5px',
                                items: [{
                                    xtype: 'displayfield',
                                    labelSeparator:'',
                                    fieldLabel: '套装列表',
                                    labelStyle:'font-weight:bold'
                                },
                                    '->',
                                {
                                    xtype:'button',
                                    text:'添加套装',
                                    handler: function(self) {
                                        var treeSuit = me.queryById('treeSuit');
                                        var treeSuitRoot = treeSuit.getRootNode();
                                        if(treeSuitRoot.childNodes.length>=10){
                                            Ext.create('Xnfy.util.common').uxNotification(false,'最多只能添加10套');
                                        }else{
                                            treeSuitRoot.appendChild({title:'套装'+(treeSuitRoot.childNodes.length+1),id:'suit_'+Ext.Date.format(new Date(), 'time'),allowDrag:false});
                                        }
                                        var form = me.child('form').getForm();
                                        var suits = form.findField('suits');
                                        suits.setValue(Ext.JSON.encode(treeSuitRoot.serialize()));
                                    }
                                }]
                            }]
                        }]
                    },{
                        title: '推荐组合',
                        layout: 'auto',
                        itemId:'commodityCombination'
                    },{
                        title: '相关资讯',
                        xtype: 'panel',
                        itemId:'aboutInformations',
                        layout: 'border',
                        bodyStyle:'background:white;',
                        margin:'-5px',
                        listeners:{
                            afterrender:function(self){
                                var stores = Ext.create('Xnfy.store.CommodityArticle');
                                var store = stores.load({scope:this,callback:function(records,operation,success){
                                }});
                                self.queryById('aboutInformationsType').reconfigure(store);
                                self.queryById('pagingtoolbarType').bindStore(store);
                            }
                        },
                        items: [{
                            xtype: 'gridpanel',
                            itemId:'aboutInformationsType',
                            flex: 1,
                            region: 'west',
                            title: '资讯列表',
                            header:false,
                            multiSelect: true,
                            viewConfig: {
                                // copy:true,
                                plugins: {
                                    ptype: 'gridviewdragdrop',
                                    enableDrop:false
                                },
                                listeners: {
                                    drop: function(node, data, dropRec, dropPosition) {
                                    },
                                    itemremove:function(record, index){
                                    }
                                }
                            },
                            style: {
                                borderStyle: 'solid',
                                borderWidth:"0 5px 0 0",
                                borderColor:"#ADD2ED"
                            },
                            store: Ext.create('Xnfy.store.CommodityArticle'),
                            columns: [
                                { text: '#',  dataIndex: 'id', width:50, hidden:true },
                                { text: '标题', dataIndex: 'title', flex: 1 },
                                { text: '创建时间', dataIndex: 'create_date', flex: 1, hidden:true }
                            ],
                            dockedItems: [{
                                xtype: 'toolbar',
                                padding:'5px 0 5px 5px',
                                items: [
                                {
                                    xtype: 'searchfield',
                                    width:'100%',
                                    emptyText: '输入关键字',
                                    labelSeparator:'',
                                    fieldLabel: '资讯列表',
                                    labelWidth:60,
                                    labelStyle:'font-weight:bold',
                                    store:Ext.create('Xnfy.store.CommodityArticle')
                                }]
                            },{
                                xtype: 'pagingtoolbar',
                                itemId:'pagingtoolbarType',
                                dock: 'bottom',
                                displayInfo: false,
                                displayMsg:'<span style="margin-left:-55px">{2}条数据</span>'
                            }]
                        },{
                            xtype: 'gridpanel',
                            itemId:'aboutInformationsAdd',
                            region: 'center',
                            flex: 1,
                            title: '添加资讯',
                            header:false,
                            multiSelect: true,
                            listeners:{
                                'itemcontextmenu' : function(menutree, selected, items, index, e) {
                                    var nodemenu = new Ext.menu.Menu({});
                                    e.preventDefault();
                                    e.stopEvent();
                                    nodemenu = new Ext.menu.Menu({
                                        floating : true,
                                        items : [{
                                            text : "移除所选项",
                                            handler : function(self) {
                                                var result = menutree.getSelectionModel().getSelection();
                                                if(result.length>0){
                                                    menutree.getStore().remove(result);
                                                }
                                                var informations_result = [];
                                                menutree.getStore().each(function(item){
                                                    informations_result.push(item.raw);
                                                });
                                                var form = me.child('form').getForm();
                                                var informations = form.findField('informations');
                                                var informations_count = form.findField('informations_count');
                                                informations_count.setValue(menutree.getStore().count());
                                                if(informations_result.length>0){
                                                    informations.setValue(Ext.JSON.encode(informations_result));
                                                }else{
                                                    informations.setValue('');
                                                }
                                                me.queryById('aboutInformationsType').getStore().load();
                                            }
                                        }]
                                    });
                                    nodemenu.showAt(e.getXY());
                                }
                            },
                            viewConfig: {
                                plugins: {
                                    ptype: 'gridviewdragdrop'
                                },
                                listeners: {
                                    beforedrop: function(node, data, dropRec, dropPosition) {
                                    },
                                    itemupdate: function( record, index, node, eOpts ){
                                    },
                                    drop: function(){
                                        var informations_result = [];
                                        this.getStore().each(function(item){
                                            informations_result.push(item.raw);
                                        });
                                        var form = me.child('form').getForm();
                                        var informations = form.findField('informations');
                                        var informations_count = form.findField('informations_count');
                                        informations_count.setValue(this.getStore().count());
                                        if(informations_result.length>0){
                                            informations.setValue(Ext.JSON.encode(informations_result));
                                        }
                                        var aboutInformationsTypeStore = me.queryById('aboutInformationsType').getStore();
                                        if(aboutInformationsTypeStore.count()<=0){
                                            aboutInformationsTypeStore.load();
                                        }
                                    }
                                }
                            },
                            store: Ext.create('Ext.data.Store', {
                                fields:['id', 'title', 'create_date'],
                                data:{},
                                proxy: {
                                    type: 'memory',
                                    reader: {
                                        type: 'json',
                                        root: 'items'
                                    }
                                }
                            }),
                            columns: [
                                { text: '#',  dataIndex: 'id', width:50, hidden:true },
                                { text: '标题', dataIndex: 'title', flex: 1 },
                                { text: '创建时间', dataIndex: 'create_date', flex: 1, hidden:true }
                            ],
                            dockedItems: [{
                                xtype: 'toolbar',
                                padding:'5px 0 5px 5px',
                                items: [{
                                    xtype: 'displayfield',
                                    labelSeparator:'',
                                    fieldLabel: '添加资讯',
                                    labelWidth:60,
                                    labelStyle:'font-weight:bold'
                                },'->',{
                                    xtype: 'displayfield',
                                    name:'informations_count',
                                    value: 0,
                                    renderer:function(value){
                                        if(value){
                                            return '<i>共 '+value+' 项</i>';
                                        }
                                    }
                                }]
                            }
                            // ,{
                            //         xtype: 'pagingtoolbar',
                            //         dock: 'bottom',
                            //         displayInfo: false,
                            //         displayMsg:'{1} of {2}'
                            // }
                            ]
                        }]
                    },{
                        title: '相关视频',
                        xtype: 'panel',
                        itemId:'aboutVideos',
                        layout: 'border',
                        bodyStyle:'background:white;',
                        margin:'-5px',
                        listeners:{
                            afterrender:function(self){
                                var stores = Ext.create('Xnfy.store.CommodityArticle');
                                var store = stores.load({scope:this,callback:function(records,operation,success){
                                }});
                                self.queryById('aboutVideosType').reconfigure(store);
                                self.queryById('pagingtoolbarType').bindStore(store);
                            }
                        },
                        items: [{
                            xtype: 'gridpanel',
                            itemId:'aboutVideosType',
                            flex: 1,
                            region: 'west',
                            title: '视频列表',
                            header:false,
                            multiSelect: true,
                            viewConfig: {
                                // copy:true,
                                plugins: {
                                    ptype: 'gridviewdragdrop',
                                    enableDrop:false
                                },
                                listeners: {
                                    drop: function(node, data, dropRec, dropPosition) {
                                    }
                                }
                            },
                            style: {
                                borderStyle: 'solid',
                                borderWidth:"0 5px 0 0",
                                borderColor:"#ADD2ED"
                            },
                            store: Ext.create('Xnfy.store.CommodityArticle'),
                            columns: [
                                { text: '#',  dataIndex: 'id', width:50, hidden:true },
                                { text: '标题', dataIndex: 'title', flex: 1 },
                                { text: '创建时间', dataIndex: 'create_date', flex: 1, hidden:true }
                            ],
                            dockedItems: [{
                                xtype: 'toolbar',
                                padding:'5px 0 5px 5px',
                                items: [
                                {
                                    xtype: 'searchfield',
                                    width:'100%',
                                    emptyText: '输入关键字',
                                    labelSeparator:'',
                                    fieldLabel: '视频列表',
                                    labelWidth:60,
                                    labelStyle:'font-weight:bold',
                                    store:Ext.create('Xnfy.store.CommodityArticle')
                                }]
                            },{
                                xtype: 'pagingtoolbar',
                                itemId:'pagingtoolbarType',
                                dock: 'bottom',
                                displayInfo: false,
                                displayMsg:'<span style="margin-left:-55px">{2}条数据</span>'
                            }]
                        },{
                            xtype: 'gridpanel',
                            region: 'center',
                            itemId:'aboutVideosAdd',
                            flex: 1,
                            title: '添加视频',
                            header:false,
                            multiSelect: true,
                            listeners:{
                                'itemcontextmenu' : function(menutree, selected, items, index, e) {
                                    var nodemenu = new Ext.menu.Menu({});
                                    e.preventDefault();
                                    e.stopEvent();
                                    nodemenu = new Ext.menu.Menu({
                                        floating : true,
                                        items : [{
                                            text : "移除所选项",
                                            handler : function(self) {
                                                var result = menutree.getSelectionModel().getSelection();
                                                if(result.length>0){
                                                    menutree.getStore().remove(result);
                                                }
                                                var videos_result = [];
                                                menutree.getStore().each(function(item){
                                                    videos_result.push(item.raw);
                                                });
                                                var form = me.child('form').getForm();
                                                var videos = form.findField('videos');
                                                var videos_count = form.findField('videos_count');
                                                videos_count.setValue(menutree.getStore().count());
                                                if(videos_result.length>0){
                                                    videos.setValue(Ext.JSON.encode(videos_result));
                                                }else{
                                                    videos.setValue('');
                                                }
                                                me.queryById('aboutVideosType').getStore().load();
                                            }
                                        }]
                                    });
                                    nodemenu.showAt(e.getXY());
                                }
                            },
                            viewConfig: {
                                plugins: {
                                    ptype: 'gridviewdragdrop'
                                },
                                listeners: {
                                    drop: function(node, data, dropRec, dropPosition) {
                                        var videos_result = [];
                                        this.getStore().each(function(item){
                                            videos_result.push(item.raw);
                                        });
                                        var form = me.child('form').getForm();
                                        var videos = form.findField('videos');
                                        var videos_count = form.findField('videos_count');
                                        videos_count.setValue(this.getStore().count());
                                        if(videos_result.length>0){
                                            videos.setValue(Ext.JSON.encode(videos_result));
                                        }
                                        var aboutVideosTypeStore = me.queryById('aboutVideosType').getStore();
                                        if(aboutVideosTypeStore.count()<=0){
                                            aboutVideosTypeStore.load();
                                        }
                                    }
                                }
                            },
                            store: Ext.create('Ext.data.Store', {
                                fields:['id', 'title', 'create_date'],
                                data:{},
                                proxy: {
                                    type: 'memory',
                                    reader: {
                                        type: 'json',
                                        root: 'items'
                                    }
                                }
                            }),
                            columns: [
                                { text: '#',  dataIndex: 'id', width:50, hidden:true },
                                { text: '标题', dataIndex: 'title', flex: 1 },
                                { text: '创建时间', dataIndex: 'create_date', flex: 1, hidden:true }
                            ],
                            dockedItems: [{
                                xtype: 'toolbar',
                                padding:'5px 0 5px 5px',
                                items: [{
                                    xtype: 'displayfield',
                                    labelSeparator:'',
                                    fieldLabel: '添加视频',
                                    labelWidth:60,
                                    labelStyle:'font-weight:bold'
                                },'->',{
                                    xtype: 'displayfield',
                                    name:'videos_count',
                                    value: 0,
                                    renderer:function(value){
                                        if(value){
                                            return '<i>共 '+value+' 项</i>';
                                        }
                                    }
                                }]
                            }
                            // ,{
                            //     xtype: 'pagingtoolbar',
                            //     dock: 'bottom',
                            //     displayInfo: false,
                            //     displayMsg:'{1} of {2}'
                            // }
                            ]
                        }]
                    },{
                        title: '参数集',
                        layout: 'auto',
                        // hidden:true,
                        items: [{
                                xtype:'textarea',
                                name:'informations',
                                // fieldLabel:'商品相关资讯',
                                width:'100%',
                                hidden:false
                            },{
                                xtype:'textarea',
                                name:'videos',
                                // fieldLabel:'商品相关视频',
                                width:'100%',
                                hidden:false
                            },{
                                xtype:'textarea',
                                name:'inventorys',
                                // fieldLabel:'商品库存状态',
                                width:'100%',
                                hidden:false
                            },{
                                xtype: 'textarea',
                                name: 'suits',
                                width: '100%',
                                hidden: false
                            }]
                    }]
                }],
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'bottom',
                    ui: 'footer',
                    items: [{
                            xtype      : 'fieldcontainer',
                            fieldLabel : '商品主从',
                            defaultType: 'radiofield',
                            labelStyle: 'font-weight:bold',
                            labelWidth: 60,
                            defaults: {
                                margin:'0 5 0 0'
                            },
                            layout: 'hbox',
                            items: [
                                {
                                    boxLabel  : '主',
                                    name      : 'master',
                                    inputValue: 1,
                                    checked:true,
                                    listeners:{
                                        change:function(self,newValue){
                                            if(newValue){
                                                var form = self.up('form').getForm();
                                                var master = ['name'];
                                                var slave = ['pid'];
                                                Ext.Array.forEach(master,function(item,index,all){
                                                    form.findField(item).allowBlank = false;
                                                    form.findField(item).setVisible(true);
                                                });
                                                Ext.Array.forEach(slave,function(item,index,all){
                                                    form.findField(item).allowBlank = true;
                                                    form.findField(item).setVisible(false);
                                                    form.findField(item).reset();
                                                });
                                                form.checkValidity();
                                                me.queryById('sycndata').setVisible(false);
                                            }
                                        }
                                    }
                                }, {
                                    boxLabel  : '从',
                                    name      : 'master',
                                    inputValue: 0,
                                    listeners:{
                                        change:function(self,newValue){
                                            if(newValue){
                                                var form = self.up('form').getForm();
                                                var master = ['name'];
                                                var slave = ['pid'];
                                                Ext.Array.forEach(master,function(item,index,all){
                                                    form.findField(item).allowBlank = true;
                                                    form.findField(item).setVisible(false);
                                                    // form.findField(item).reset();
                                                });
                                                Ext.Array.forEach(slave,function(item,index,all){
                                                    form.findField(item).allowBlank = false;
                                                    form.findField(item).setVisible(true);
                                                });
                                                form.checkValidity();
                                                me.queryById('sycndata').setVisible(true);
                                            }
                                        }
                                    }
                                }
                            ]
                        },{
                            xtype: 'combobox',
                            fieldLabel: '所属商品',
                            labelWidth: 60,
                            labelStyle: 'font-weight:bold',
                            name:'pid',
                            validateOnChange:false,
                            store: Ext.create('Xnfy.store.CommoditySelect',{
                                listeners:{
                                    beforeload:function(){
                                        var form = me.child('form').getForm();
                                        var post = {master: 1,category:me.data.id};
                                        if(form.findField('brand')){
                                            var brand = form.findField('brand').value;
                                            if(me.data.id && brand==0){
                                                //post = { master: 1,category:me.data.id,brand:''};
                                                post = { master: 1,category:me.data.id};
                                            }else if(me.data.id && brand>0){
                                                //post = { master: 1,category:me.data.id,brand:brand};
                                                post = { master: 1,category:me.data.id};
                                            }else if(me.data.id){
                                                post = { master: 1,category:me.data.id};
                                            }
                                        }
                                        Ext.apply(this.proxy.extraParams, post);
                                    }
                                }
                            }),
                            displayField: 'title',
                            hideTrigger:true,
                            width:170,
                            margin: '0 3 0 0',
                            allowBlank: true,
                            hidden:true,
                            hideLabel:false,
                            emptyText:'主商品搜索',
                            // stripCharsRe:new RegExp(/[\W]/i),
                            pageSize: 10,
                            valueField:'id',
                            vtype:'commodity_combobox_number',
                            minChars:1,
                            selectOnFocus : false,
                            listConfig: {
                                loadingText: '正在搜索...',
                                emptyText: '<span style="padding-left:10px">没有匹配的结果</span>',
                                minWidth:335,
                                padding:'10 0 0 0',
                                listeners:{
                                    render:function(self){

                                    },
                                    select:function(self, record){
                                        me.queryById('sycndata').setDisabled(false);
                                    }
                                }
                            },
                            listeners:{
                                change:function(self, newValue, oldValue){
                                    if(typeof(newValue)=='number'){
                                        me.queryById('sycndata').setDisabled(false);
                                    }else{
                                        me.queryById('sycndata').setDisabled(true);
                                    }
                                    me.child('form').getForm().checkValidity();
                                },
                                beforequery:function(){
                                    //console.log('stop');
                                    //return false;
                                },
                                specialkey: function(field, e){
                                    // if (e.getKey() == e.ENTER) {
                                    //     var form = field.up('form').getForm();
                                    //     Ext.create('Xnfy.util.common').uxNotification(true,'info');
                                    //     console.log('form');
                                    // }
                                }
                            }
                        },{
                            xtype: 'button',
                            itemId:'sycndata',
                            margin:'0 10 0 0',
                            hidden: true,
                            text:'同步数据',
                            disabled:true,
                            listeners:{
                                click:function( self, e, eOpts ){
                                    var form = self.up('form').getForm();
                                    var pid = form.findField('pid');
                                    if(pid){
                                        self.up('form').setLoading(true);
                                        Ext.Ajax.request({
                                            url:"admin/commodity/getCommodity",
                                            method:'POST',
                                            params:{id:pid.value},
                                            callback:function(records, operation, success){
                                                var response = Ext.JSON.decode(success.responseText);
                                                if(response.success){
                                                    response.data.pid = pid.value;
                                                    response.data.master = 0;
                                                    if(!response.data.brand){
                                                        if(form.findField('brand')){
                                                            form.findField('brand').setValue(0);
                                                        }
                                                    }
                                                    if(response.data.cover){
                                                        form.findField('combobox_image').setValue(1);
                                                        me.queryById('cover').setSrc(response.data.cover);
                                                        me.queryById('cover').setVisible(true);
                                                    }else{
                                                        form.findField('combobox_image').setValue(0);
                                                        form.owner.queryById('cover').setSrc('');
                                                        form.owner.queryById('cover').setVisible(false);
                                                    }
                                                    var inventorys = form.findField('inventorys');
                                                    var inventorys_res = inventorys.getValue();
                                                    if(response.data.inventorys && inventorys_res){
                                                        var org = Ext.JSON.decode(response.data.inventorys);
                                                        inventorys_res = Ext.JSON.decode(inventorys_res);
                                                        response.data.inventorys = Ext.JSON.encode(_.extend(inventorys_res,org));
                                                    }else{
                                                        response.data.inventorys = inventorys_res;
                                                    }
                                                    form.setValues(response.data);

                                                    if(response.data.params){
                                                        var params_value = Ext.JSON.decode(response.data.params);
                                                        if(params_value.length>0){
                                                            var root = me.queryById('commodityParams').getRootNode();
                                                            root.eachChild(function(params_item){
                                                                params_item.eachChild(function(params_item_children){
                                                                    Ext.Array.forEach(params_value,function(re_item,re_index){
                                                                        if(params_item_children.internalId==re_item.id){
                                                                            params_item_children.updateInfo(true,{value:re_item.value});
                                                                        }
                                                                    });
                                                                });
                                                            });
                                                            var commodityParams = me.queryById('commodityParams').getStore();
                                                            var commodityParamsModity = commodityParams.getModifiedRecords();
                                                            Ext.Array.forEach(commodityParamsModity,function(items,indexs){
                                                                if(items.data.leaf===true){
                                                                    items.updateInfo(true,{value:''});
                                                                }
                                                            });
                                                            me.queryById('commodityParams').getView().refresh();
                                                        }
                                                    }

                                                    if(response.data.informations){
                                                        var informations_ids = [];
                                                        var informations_value = Ext.JSON.decode(response.data.informations);
                                                        var informations_store = me.queryById('aboutInformationsAdd').getStore();
                                                        informations_store.removeAll();
                                                        informations_store.add(informations_value);
                                                        var informations_count = form.findField('informations_count');
                                                        informations_count.setValue(informations_value.length);

                                                        Ext.Array.forEach(informations_value,function(item,index){
                                                            informations_ids.push(item.id);
                                                        });
                                                        informations_ids = informations_ids.toString();
                                                        me.queryById('aboutInformationsType').getStore().reload({params:{type:1,informations_ids:informations_ids,videos_ids:{}}});
                                                    }

                                                    if(response.data.videos){
                                                        var videos_ids = [];
                                                        var videos_value = Ext.JSON.decode(response.data.videos);
                                                        var videos_store = me.queryById('aboutVideosAdd').getStore();
                                                        videos_store.removeAll();
                                                        videos_store.add(videos_value);
                                                        var videos_count = form.findField('videos_count');
                                                        videos_count.setValue(videos_value.length);

                                                        Ext.Array.forEach(videos_value,function(item,index){
                                                            videos_ids.push(item.id);
                                                        });
                                                        videos_ids = videos_ids.toString();
                                                        me.queryById('aboutVideosType').getStore().reload({params:{type:2,videos_ids:videos_ids,informations_ids:{}}});
                                                    }

                                                    if(response.data.inventorys){
                                                        var inventorys_value = Ext.JSON.decode(response.data.inventorys);
                                                        if(inventorys && inventorys_value.length>0){
                                                            var rootInventorys = me.queryById('commodityInventory').getRootNode();
                                                            var inventorys_result = [];
                                                            rootInventorys.eachChild(function(inventorys_item){ //省
                                                                inventorys_item.eachChild(function(inventorys_item_children){ //市
                                                                    inventorys_item_children.eachChild(function(inventorys_item_children_a){ //区
                                                                        var type = inventorys_item_children_a.raw.configuration.split('|');
                                                                        if(_.contains(type, 'shop') || _.contains(type, 'delivery_point')){
                                                                            Ext.Array.forEach(inventorys_value,function(re_item,re_index){
                                                                                if(inventorys_item_children_a.raw.id==re_item.id){
                                                                                    inventorys_item_children_a.updateInfo(true,{status:re_item.status!==''?re_item.status:1,value:re_item.value});
                                                                                }
                                                                            });
                                                                        }
                                                                        if(_.contains(type, 'shop')){
                                                                            inventorys_item_children_a.eachChild(function(inventorys_item_children_b){ //店
                                                                                    Ext.Array.forEach(inventorys_value,function(res_item,re_index){
                                                                                        if(inventorys_item_children_b.raw.id==res_item.id){
                                                                                            inventorys_item_children_b.updateInfo(true,{status:res_item.status!==''?res_item.status:1,value:res_item.value});
                                                                                        }
                                                                                    });
                                                                            });
                                                                        }
                                                                    });
                                                                });
                                                            });
                                                        }

                                                    }

                                                    var treeSuit = me.queryById('treeSuit');
                                                    if(treeSuit){
                                                        if(response.data.suits){
                                                            treeSuit.setRootNode(Ext.JSON.decode(response.data.suits));
                                                            var suits = form.findField('suits');
                                                            var treeSuitRoot = treeSuit.getRootNode();
                                                            treeSuitRoot.updateInfo(true,{allowDrop:false, allowDrag:false});
                                                            treeSuitRoot.eachChild(function(item){
                                                                item.updateInfo(true,{allowDrop:true, allowDrag:false});
                                                            });
                                                            suits.setValue(Ext.JSON.encode(treeSuitRoot.serialize()));
                                                        }else{
                                                            treeSuit.setRootNode({
                                                                id:'root',
                                                                title:'root',
                                                                expanded: true,
                                                                allowDrop:false,
                                                                allowDrag:false
                                                            });
                                                        }
                                                    }
                                                    Ext.create('Xnfy.util.common').uxNotification(true,'获取数据成功');
                                                    self.up('form').setLoading(false);
                                                }else{
                                                    Ext.create('Xnfy.util.common').uxNotification(false,'获取数据失败');
                                                    self.up('form').setLoading(false);
                                                }
                                            }
                                        });
                                    }
                                }
                            }
                        },{
                            xtype: 'checkboxfield',
                            name:"enabled",
                            hidden:false,
                            fieldLabel:'启用商品',
                            labelStyle: 'font-weight:bold',
                            labelWidth: 60,
                            inputValue: 1,
                            uncheckedValue:0,
                            checked:true
                        },{
                            xtype: 'tbfill'
                        },{
                        text: '取消',
                        formBind: true,
                        handler: function(self) {
                            var form = self.up('form').getForm();
                            var values = form.getFieldValues(true);
                            form.reset();

                            var render_params = form.findField('render_params');
                            if(render_params){
                                render_params.setValue(values.render_params);
                            }

                            var commodityParams = me.queryById('commodityParams');
                            if(commodityParamsRoot){
                                var commodityParamsRoot = commodityParams.getRootNode();
                                commodityParamsRoot.removeAll();
                                commodityParamsRoot.appendChild(Ext.JSON.decode(values.render_params));
                            }

                            var informations_store = me.queryById('aboutInformationsAdd').getStore();
                            if(informations_store){
                                informations_store.removeAll();
                            }

                            var videos_store = me.queryById('aboutVideosAdd').getStore();
                            if(videos_store){
                                videos_store.removeAll();
                            }

                            if(me.queryById('aboutInformationsType').getStore()){
                                me.queryById('aboutInformationsType').getStore().reload({params:{type:1}});
                            }

                            if(me.queryById('aboutVideosType').getStore()){
                                me.queryById('aboutVideosType').getStore().reload({params:{type:2}});
                            }

                            var render_inventorys = form.findField('render_inventorys');
                            if(render_inventorys){
                                render_inventorys.setValue(values.render_inventorys);
                            }

                            var inventorys_root = me.queryById('commodityInventory').getRootNode();
                            var inventorys = form.findField('inventorys');
                            if(inventorys_root && inventorys){
                                if(inventorys.getValue()==''){
                                    var inventorys_value = [];
                                    inventorys_root.eachChild(function(inventorys_item){ //省
                                        inventorys_item.eachChild(function(inventorys_item_children){ //市
                                            inventorys_item_children.eachChild(function(inventorys_item_children_a){ //区
                                                var type = inventorys_item_children_a.raw.configuration.split('|');
                                                if(_.contains(type, 'shop') || _.contains(type, 'delivery_point')){
                                                    inventorys_item_children_a.updateInfo(true,{status:1,value:''});
                                                    inventorys_value.push({id:inventorys_item_children_a.raw.id, status: 1, value: ''});
                                                }
                                                if(_.contains(type, 'shop')){
                                                    inventorys_item_children_a.eachChild(function(inventorys_item_children_b){ //店
                                                        inventorys_item_children_b.updateInfo(true,{status:1,value:''});
                                                        inventorys_value.push({id:inventorys_item_children_b.raw.id, status: 1, value: ''});
                                                    });
                                                }
                                            });
                                        });
                                    });
                                    if(inventorys_value.length>0){
                                        inventorys.setValue(Ext.JSON.encode(inventorys_value));
                                    }else{
                                        inventorys.setValue(me.inventorysResult);
                                    }
                                }
                            }

                            var treeSuit = me.queryById('treeSuit');
                            if(treeSuit){
                                var suits = form.findField('suits');
                                suits.setValue('');
                                treeSuit.setRootNode({id:'root',
                                    title:'root',
                                    expanded: true,
                                    allowDrop:false
                                });
                            }
                        }
                    },{
                        text: '确认添加',
                        formBind: true,
                        handler: function(self) {
                            var datas = self.up('commoditymanageadd').data;
                            if(!datas.id && !datas.parent.id){
                                Ext.create('Xnfy.util.common').uxNotification(false,'异常操作',5000);
                                return false;
                            }
                            var form = self.up('form').getForm();
                            var forms = self.up('form');
                            var commodity_classify = self.up('panel').queryById('commodity_classify').getForm();
                            if(commodity_classify){
                                var classify_values = commodity_classify.getValues(false,true);
                                var values = form.getFieldValues(true);
                                var params = {
                                        district:datas.parent.id,
                                        category:datas.id,
                                        classifys:null
                                    };
                                if(_.size(classify_values)>0){
                                    params.classifys = JSON.stringify(classify_values);
                                }
                            }

                            if(form.isValid()){
                                var center = Ext.getCmp("center");
                                var tabpanelCenter = me.queryById('tabpanelCenter');
                                form.submit({
                                        waitMsg:'正在处理数据...',
                                        params:params,
                                        method:'POST',
                                        submitEmptyText:false,
                                        url:'admin/commodity/insert',
                                        success:function(f, response){
                                            Ext.create('Xnfy.util.common').uxNotification(true,'添加数据成功',3000);
                                            var tab = center.getComponent('Commodity-List-'+datas.id);
                                            if(tab){
                                                tab.child('gridpanel').getStore().reload();
                                                tab.child('gridpanel').getSelectionModel().deselectAll();
                                                center.setActiveTab(tab);
                                            }
                                            form.reset();

                                            var render_params = form.findField('render_params');
                                            if(render_params){
                                                render_params.setValue(values.render_params);
                                            }
                                            var commodityParams = me.queryById('commodityParams');
                                            if(commodityParams){
                                                var commodityParamsRoot = commodityParams.getRootNode();
                                                if(commodityParamsRoot){
                                                    commodityParamsRoot.removeAll();
                                                    // commodityParamsRoot.appendChild(Ext.JSON.decode(values.render_params));
                                                    var chi = {
                                                        title: 'root',
                                                        id: 'root',
                                                        expanded:true,
                                                        children:Ext.JSON.decode(values.render_params)
                                                    };
                                                    commodityParams.setRootNode(chi);
                                                }
                                            }
                                            var informations_store = me.queryById('aboutInformationsAdd').getStore();
                                            if(informations_store){
                                                informations_store.removeAll();
                                            }
                                            if(me.queryById('aboutInformationsType').getStore()){
                                                me.queryById('aboutInformationsType').getStore().reload({params:{type:1}});
                                            }
                                            var videos_store = me.queryById('aboutVideosAdd').getStore();
                                            if(videos_store){
                                                videos_store.removeAll();
                                            }
                                            if(me.queryById('aboutVideosType').getStore()){
                                                me.queryById('aboutVideosType').getStore().reload({params:{type:2}});
                                            }
                                            var render_inventorys = form.findField('render_inventorys');
                                            if(render_inventorys){
                                                render_inventorys.setValue(values.render_inventorys);
                                            }
                                            var inventorys = form.findField('inventorys');
                                            if(inventorys && inventorys.getValue()==''){
                                                var inventorys_value = [];
                                                var commodityInventorysRoot = me.queryById('commodityInventory').getRootNode();
                                                if(commodityInventorysRoot){
                                                    commodityInventorysRoot.eachChild(function(inventorys_item){ //省
                                                        inventorys_item.eachChild(function(inventorys_item_children){ //市
                                                            inventorys_item_children.eachChild(function(inventorys_item_children_a){ //区
                                                                var type = inventorys_item_children_a.raw.configuration.split('|');
                                                                if(_.contains(type, 'shop') || _.contains(type, 'delivery_point')){
                                                                    inventorys_item_children_a.updateInfo(true,{status:1,value:''});
                                                                    inventorys_value.push({id:inventorys_item_children_a.raw.id, status: 1, value: ''});
                                                                }
                                                                if(_.contains(type, 'shop')){
                                                                    inventorys_item_children_a.eachChild(function(inventorys_item_children_b){ //店
                                                                        inventorys_item_children_b.updateInfo(true,{status:1,value:''});
                                                                        inventorys_value.push({id:inventorys_item_children_b.raw.id, status: 1, value: ''});
                                                                    });
                                                                }
                                                            });
                                                        });
                                                    });
                                                }
                                                if(inventorys_value.length>0){
                                                    inventorys.setValue(Ext.JSON.encode(inventorys_value));
                                                }else{
                                                    inventorys.setValue(me.inventorysResult);
                                                }
                                            }

                                            var treeSuit = me.queryById('treeSuit');
                                            var suits = form.findField('suits');
                                            if(treeSuit && suits){
                                                suits.setValue('');
                                                treeSuit.setRootNode({
                                                    id:'root',
                                                    title:'root',
                                                    expanded: true,
                                                    allowDrop:false,
                                                    allowDrag:false
                                                });
                                            }

                                            forms.queryById('base').expand();
                                            tabpanelCenter.setActiveTab(0);
                                        },
                                        failure:function(f, response){
                                            Ext.create('Xnfy.util.common').uxNotification(false,response.result.errors.msg,5000);
                                        },
                                        listeners:{
                                            beforeaction:function(self, action, eOpts){
                                            }
                                        }
                                    });
                            }
                        }
                    }]
                }]
            }]
        });
        me.callParent(arguments);
    }
});