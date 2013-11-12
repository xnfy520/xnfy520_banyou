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
        var hid = ['accessorie_division'];
        Ext.applyIf(me, {
            items:[{
                xtype: 'form',
                layout:'border',
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
                            emptyText:'商品标题',
                            margin:'0 0 -5 0'
                        }, {
                            fieldLabel: '商品简介',
                            xtype: 'textareafield',
                            name: 'description',
                            anchor:'100%',
                            rows:2,
                            emptyText:'商品简介',
                            margin:'0 0 -5 0'
                        }, {
                            fieldLabel: '商品配置',
                            xtype: 'textareafield',
                            name: 'collocate',
                            anchor:'100%',
                            rows:2,
                            emptyText:'商品配置',
                            margin:'0 0 -5 0'
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
                        title:'商品类别',
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
                                                    if(item.indexing && item.childs){
                                                        Ext.Array.forEach(item.childs,function(it,ind,al){
                                                            if(it.alias){
                                                                item.childs[ind].title = (it.alias ? it.title+'（'+it.alias+'）' : '');
                                                            }
                                                        });
                                                        item.childs.unshift({title:'请选择'+item.title,id:0});
                                                        var multi = ['orientation','gsm'];
                                                        var mul = false;
                                                        var val = 0;
                                                        Ext.Array.forEach(multi,function(itm,index,all){
                                                            if(itm==item.indexing){
                                                                mul = true;
                                                                val = '';
                                                                item.childs.shift();
                                                            }
                                                        });
                                                        var combo = Ext.create('Ext.form.ComboBox', {
                                                            fieldLabel:item.title,
                                                            anchor:'100%',
                                                            editable : false,
                                                            name:item.indexing,
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
                        }
                    },
                    items:[{
                        tabConfig: {
                            style:'margin:0 1px 0 5px'
                        },
                        title:'商品详情',
                        defaults: {
                        },
                        defaultType: 'textfield',
                        xtype:'form',
                        items: [{
                                xtype: 'tinymce',
                                name:'details',
                                // anchor: '100%',
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
                        title:'详细参数',
                        layout: 'fit',
                        items: []
                    },{
                        title: '库存状态',
                        layout: 'fit',
                        items: []
                    },{
                        title: '优惠套装',
                        layout: 'fit',
                        items: []
                    },{
                        title: '推荐组合',
                        layout: 'fit',
                        items: []
                    },{
                        title: '相关资讯',
                        layout: 'fit',
                        items: []
                    },{
                        title: '相关视频',
                        layout: 'fit',
                        items: []
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
                                                var master = ['indexing','release_date','name'];
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
                                                form.findField('indexing').allowBlank = true;
                                                form.checkValidity();
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
                                                var master = ['indexing','release_date','name'];
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
                                            }
                                        }
                                    }
                                }
                            ]
                        },{
                            xtype: 'tbseparator'
                        },{
                            fieldLabel: '商品索引',
                            xtype:'textfield',
                            name:'indexing',
                            labelStyle: 'font-weight:bold',
                            margin: '0 10 0 0',
                            labelWidth: 60,
                            width:170,
                            allowBlank: true,
                            emptyText:'商品唯一索引',
                            stripCharsRe:new RegExp(/[\W]/i)
                        },{
                            xtype: 'datefield',
                            format: 'Y-m-d',
                            name: 'release_date',
                            fieldLabel: '发布日期',
                            labelWidth: 60,
                            allowBlank: false,
                            labelStyle: 'font-weight:bold',
                            margin: '0 10 0 0',
                            width:165,
                            value: new Date(),
                            minValue: '1970-01-01',
                            maxValue: new Date(),
                            listeners:{
                                change:function(self, newValue, oldValue, eOpts){
                                }
                            }
                        },{
                            xtype: 'combobox',
                            fieldLabel: '所属商品',
                            labelWidth: 60,
                            labelStyle: 'font-weight:bold',
                            name:'pid',
                            store: Ext.create('Xnfy.store.ArticleSelect'),
                            displayField: 'title',
                            hideTrigger:true,
                            width:170,
                            margin: '0 10 0 0',
                            allowBlank: true,
                            hidden:true,
                            hideLabel:false,
                            emptyText:'商品唯一索引',
                            stripCharsRe:new RegExp(/[\W]/i),
                            pageSize: 10,
                            selectOnFocus : true,
                            listConfig: {
                                loadingText: '正在搜索...',
                                emptyText: '没有匹配的结果',
                                minWidth:335,
                                listeners:{
                                    select:function(self, record){
                                        console.log(record);
                                    }
                                }
                                // Custom rendering template for each item
                                // getInnerTpl: function() {
                                //     return '<a class="search-item" href="http://www.sencha.com/forum/showthread.php?t={topicId}&p={id}">' +
                                //         '<h3><span>{[Ext.Date.format(values.lastPost, "M j, Y")]}<br />by {author}</span>{title}</h3>' +
                                //         '{excerpt}' +
                                //     '</a>';
                                // }
                            },
                            listeners:{
                                beforequery:function(){
                                    //console.log('stop');
                                    //return false;
                                },
                                specialkey: function(field, e){
                                    if (e.getKey() == e.ENTER) {
                                        var form = field.up('form').getForm();
                                        Ext.create('Xnfy.util.common').uxNotification(true,'info');
                                        console.log('form');
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
                            form.reset();
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
                            if(form.isValid()){
                                form.submit({
                                        waitMsg:'正在处理数据...',
                                        params:params,
                                        method:'POST',
                                        submitEmptyText:false,
                                        url:'admin/commodity/insert',
                                        success:function(f, response){
                                            var center = Ext.getCmp("center");
                                            var tab = center.getComponent('Commodity-List-'+datas.id);
                                            if(tab){
                                                tab.child('gridpanel').getStore().reload();
                                                tab.child('gridpanel').getSelectionModel().deselectAll();
                                                center.setActiveTab(tab);
                                            }
                                            form.reset();
                                            forms.queryById('base').expand();
                                            Ext.create('Xnfy.util.common').uxNotification(true,'添加数据成功',3000);
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