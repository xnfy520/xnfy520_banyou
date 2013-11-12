Ext.define('Xnfy.view.ArticleAdd', {
    extend: 'Ext.panel.Panel',
    requires: [
        'Ext.ux.ProgressBarPager',
        'Xnfy.util.common'
    ],
    alias: 'widget.articleadd',
    title: 'Tab',
    closable: true,
    layout: {
        type: 'fit'
    },
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            items:[{
                xtype: 'form',
                layout:'border',
                items: [{
                    xtype: 'panel',
                    id:'menulist',
                    layout:'accordion',
                    region:'west',
                    // autoScroll:true,
                    // maxWidth:260,
                    flex: 0.34,
                    // minWidth:255,
                    defaults:{
                        bodyPadding:'5'
                    },
                    items:[{
                        itemId:"base",
                        xtype:'form',
                        title:'基本信息',
                        autoScroll:true,
                        // bodyStyle:'overflow-x:hidden;overflow-y:auto;padding-right:10px',
                        fieldDefaults: {
                            labelAlign: 'top',
                            labelStyle: 'font-weight:bold;margin-bottom:2px',
                            labelWidth:'65',
                            // msgTarget: 'side'
                            margin:'0 0 2 0'
                            // anchor:'100%'
                        },
                        items: [{
                            labelAlign: 'top',
                            anchor:'100%',
                            xtype: 'treepicker',
                            name:'pid',
                            fieldLabel:'所属分类',
                            flex: 1,
                            autoScroll:true,
                            minPickerHeight:'auto',
                            maxPickerHeight:200,
                            value:{},
                            emptyText:'选择分类',
                            blankText:'无分类选择',
                            displayField : 'title',
                            // margin:'25px 0 0 0',
                            labelStyle: 'font-weight:bold;padding-bottom:5px',
                            store:Ext.create('Xnfy.store.ClassifyMenu'),
                            listeners:{
                                afterrender:function( self, eOpts ){
                                    self.store.load({params:{indexing:'article'},callback:function(records,operation,success){
                                        var response = Ext.decode(operation.response.responseText);
                                        if(success && records.length>0){
                                            self.store.setRootNode({title:'选择分类',id:response.pid}).expand();
                                            self.setValue(response.pid);
                                            // self.store.getRootNode().expand(true);
                                        }else{
                                            self.store.setRootNode({id:0,title:'无分类选择'});
                                            self.setValue(0);
                                            self.disable();
                                        }
                                    }});
                                },
                                beforeshow:function( self, eOpts ){
                                },
                                blur:function( self, The, eOpts ){
                                },
                                expand:function( self, eOpts ){
                                },
                                collapse:function(self, eOpts){
                                },
                                select:function( self, record, eOpts ){
                                    self.collapse();
                                }
                            }
                        },{
                            xtype: 'combobox',
                            name:"type",
                            //allowBlank: false,
                            fieldLabel:'文章类型',
                            labelWidth: 60,
                            width:140,
                            labelStyle: 'font-weight:bold;padding-bottom:5px',
                            emptyText : '选择类型',
                            anchor:'100%',
                            mode : 'local',// 数据模式，local代表本地数据
                            //readOnly : false,// 是否只读
                            editable : false,// 是否允许输入
                            //forceSelection : true,// 必须选择一个选项
                            //blankText : '请选择',// 该项如果没有选择，则提示错误信息,
                            store:Ext.create('Ext.data.Store', {
                                fields: ['text', 'type'],
                                data : [
                                    {"text":"选择类型", "type":0},
                                    {"text":"图文", "type":1},
                                    {"text":"视频", "type":2}
                                ]
                            }),
                            // value:0,
                            displayField:'text',
                            valueField:'type',
                            listeners: {
                              change:function(combo,n,o){
                              }
                            }
                        },{
                            fieldLabel: '文章标题',
                            name: 'title',
                            anchor:'100%',
                            xtype:'textareafield',
                            allowBlank: false,
                            rows:2,
                            emptyText:'文章标题',
                            margin:'0 0 -5 0'
                            // labelStyle: 'font-weight:bold;padding-bottom:5px'
                        }, {
                            fieldLabel: '文章简介',
                            xtype: 'textareafield',
                            name: 'description',
                            anchor:'100%',
                            // rows:3,
                            emptyText:'文章简介',
                            margin:'0 0 -5 0'
                        }]
                    },{
                        xtype:'form',
                        title:'额外信息',
                        autoScroll:true,
                        // bodyStyle:'overflow-x:hidden;overflow-y:auto;padding-right:10px',
                        fieldDefaults: {
                            labelAlign: 'top',
                            labelStyle: 'font-weight:bold;margin-bottom:2px',
                            labelWidth:'65',
                            // msgTarget: 'side'
                            margin:'0 0 2 0'
                            // anchor:'100%'
                        },
                         items: [{
                            fieldLabel: '文章索引',
                            xtype:'textfield',
                            labelAlign: 'top',
                            name:'indexing',
                            allowBlank: true,
                            emptyText:'文章索引',
                            anchor:'100%',
                            stripCharsRe:new RegExp(/[\W]/i)
                        },{
                            xtype:'textfield',
                            name:'author',
                            fieldLabel:'文章作者',
                            emptyText:'文章作者',
                            labelAlign: 'top',
                            anchor:'100%',
                            labelStyle: 'font-weight:bold;padding-bottom:5px'
                        },{
                            xtype:'textfield',
                            name:'source',
                            fieldLabel:'文章来源',
                            emptyText:'文章来源',
                            labelAlign: 'top',
                            anchor:'100%',
                            labelStyle: 'font-weight:bold;padding-bottom:5px'
                        },{
                            xtype:'textfield',
                            vtype:'url',
                            name:'source_url',
                            fieldLabel:'来源链接',
                            emptyText:'来源链接',
                            labelAlign: 'top',
                            anchor:'100%',
                            labelStyle: 'font-weight:bold;padding-bottom:5px'
                        },{
                            xtype:'numberfield',
                            name:'views',
                            minValue: 0,
                            fieldLabel:'浏览数量',
                            emptyText:'浏览数量',
                            value:0,
                            labelAlign: 'top',
                            anchor:'100%',
                            labelStyle: 'font-weight:bold;padding-bottom:5px'
                        },
                        {
                            xtype:'numberfield',
                            name:'sort',
                            minValue: 0,
                            maxValue:255,
                            fieldLabel:'排　　序',
                            anchor:'100%',
                            value:99,
                            labelStyle: 'font-weight:bold;padding-bottom:5px'
                        },
                        {
                            fieldLabel: '备　　注',
                            xtype: 'textareafield',
                            name: 'remark',
                            anchor:'100%',
                            // rows:3,
                            emptyText:'备注',
                            margin:'0 0 -5 0'
                        }]
                    },{
                        xtype:'form',
                        title:'封面图片',
                        autoScroll:true,
                        // bodyStyle:'overflow-x:hidden;overflow-y:auto;padding-right:10px',
                        fieldDefaults: {
                            labelAlign: 'top',
                            labelStyle: 'font-weight:bold;margin-bottom:2px',
                            labelWidth:'65',
                            // msgTarget: 'side'
                            margin:'0 0 2 0'
                            // anchor:'100%'
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
                            fieldLabel:'选择封面',
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
                            anchor:'100%',
                            listeners:{
                                render:function(){
                                    // this.up('form').setBodyStyle('width','260px');
                                },
                                show:function(){
                                    // this.up('form').setBodyStyle('width','260px');
                                },
                                hide:function(){
                                    // this.up('form').setBodyStyle('width','260px');
                                }
                            }
                        })]
                    }],
                    listeners:{
                        resize:function(){
                        }
                    }
                },{
                    region:'center',
                    bodyPadding:'5 5 5 0',
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
                        render:function(me){
                            me.setLoading(true);
                        },
                        afterrender:function(me){
                            me.setLoading(false);
                        },
                        afterlayout:function(me){
                            me.down('tinymce').editor.settings.height = me.el.dom.clientHeight-69;
                        },
                        resize:function(me){
                            if(Ext.get(me.down('tinymce').id+'-inputEl_ifr')){
                                Ext.get(me.down('tinymce').id+'-inputEl_ifr').set({style:'height:'+(me.el.dom.clientHeight-69)+'px'});
                            }
                        }
                    }
                }],
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'bottom',
                    ui: 'footer',
                    items: [{
                            xtype: 'datefield',
                            format: 'Y-m-d',
                            name: 'release_date',
                            fieldLabel: '发布日期',
                            labelWidth: 60,
                            allowBlank: false,
                            labelStyle: 'font-weight:bold',
                            margin: '0 5 0 0',
                            width:165,
                            value: new Date(),
                            minValue: '1970-01-01',
                            maxValue: new Date(),
                            listeners:{
                                change:function(self, newValue, oldValue, eOpts){

                                    var next = self.nextSibling();

                                    var o_date = Ext.Date.format(self.getValue(),'Y-m-d');

                                    var n_time = Ext.Date.format(next.getValue(),'H:i:s');

                                    var c_date = Ext.Date.format(new Date(),'Y-m-d');

                                    var release_time = Date.parse(c_date+' '+n_time);

                                    var new_times = Date.parse(new Date());

                                    if(o_date==c_date){
                                        next.setMaxValue(new Date());
                                        if(release_time>new_times){
                                            next.markInvalid('错误的时间选择');
                                        }
                                    }else{
                                        next.setMaxValue('23:45:00');
                                        next.clearInvalid();
                                    }

                                    next.up('form').getForm().checkValidity();

                                }
                            }
                        }, {
                            xtype: 'timefield',
                            name: 'release_time',
                            format:'H:i:s',
                            width:90,
                            value: new Date(),
                            maxValue: new Date(),
                            anchor: '100%',
                            listeners:{
                                change:function(self, newValue, oldValue, eOpts){
                                    self.up('form').getForm().checkValidity();
                                }
                            }
                       },{
                            xtype: 'tbseparator'
                       },{
                            xtype: 'combobox',
                            name:"enabled",
                            //allowBlank: false,
                            fieldLabel:'是否发布',
                            labelWidth: 60,
                            width:140,
                            labelStyle: 'font-weight:bold',
                            emptyText : '请选择',
                            anchor:'100%',
                            mode : 'local',// 数据模式，local代表本地数据
                            //readOnly : false,// 是否只读
                            editable : false,// 是否允许输入
                            //forceSelection : true,// 必须选择一个选项
                            //blankText : '请选择',// 该项如果没有选择，则提示错误信息,
                            store:Ext.create('Ext.data.Store', {
                                fields: ['text', 'enabled'],
                                data : [
                                    {"text":"是", "enabled":1},
                                    {"text":"否", "enabled":0}
                                ]
                            }),
                            value:1,
                            displayField:'text',
                            valueField:'enabled',
                            listeners: {
                              change:function(combo,n,o){
                                if(n==1){
                                    combo.setValue(combo.store.getAt(0));
                                }else{
                                    combo.setValue(combo.store.getAt(1));
                                }
                              }
                            }
                        },{
                            xtype: 'tbfill'
                        },{
                        text: '取消',
                        formBind: true,
                        handler: function(self) {
                            var form = self.up('form').getForm();
                            form.reset();
                            var pid = form.findField('pid').getStore().getRootNode().internalId;
                            form.findField('pid').setValue(pid);
                            self.up('panel').queryById('base').expand();
                        }
                    },{
                        text: '确认添加',
                        formBind: true,
                        handler: function(self) {
                            var form = self.up('form').getForm();
                            var forms = self.up('form');
                            var values = form.getFieldValues(true);
                            var pid = form.findField('pid').getStore().getRootNode().internalId;
                            if(values.pid==pid || !values.pid){
                                pids = 0;
                                form.setValues({pid:0});
                            }else{
                                pids = values.pid;
                            }
                            if(form.isValid()){
                                form.submit({
                                        waitMsg:'正在处理数据...',
                                        params:{pid:pids},
                                        method:'POST',
                                        submitEmptyText:false,
                                        url:'admin/article/insert',
                                        success:function(f, response){
                                            var panel = Ext.getCmp('article_list');
                                            if(panel){
                                                panel.child('gridpanel').getStore().reload();
                                                panel.child('gridpanel').getSelectionModel().deselectAll();
                                            }
                                            form.reset();
                                            form.setValues({pid:pid});
                                            self.up('panel').queryById('base').expand();
                                            var center = Ext.getCmp('center');
                                            var articlelist = center.getComponent('ArticleManage');
                                            if(articlelist){
                                                center.setActiveTab(articlelist);
                                            }
                                            Ext.create('Xnfy.util.common').uxNotification(true,'添加数据成功',3000);
                                        },
                                        failure:function(f, response){
                                            form.setValues({pid:values.pid});
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