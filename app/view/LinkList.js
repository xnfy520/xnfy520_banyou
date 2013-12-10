Ext.define('Xnfy.view.LinkList', {
    extend: 'Ext.panel.Panel',
    requires: [
        'Ext.ux.ProgressBarPager',
        'Xnfy.util.common'
    ],
    alias: 'widget.linklist',
    layout: {
        type: 'border'
    },
    title: 'Tab',
    closable: true,
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'gridpanel',
                    selType:'checkboxmodel',
                    selModel: {
                        injectCheckbox:'last'
                    },
                    region: 'center',
                    border:false,
                    style: {
                        borderStyle: 'solid',
                        borderWidth:"0 5px 0 0",
                        borderColor:"#ADD2ED"
                    },
                    columns: [
                        {
                            text: '#',
                            dataIndex: 'id',
                            width:60,
                            hidden:true
                        },
                        {
                            text: '链接名称',
                            dataIndex: 'title',
                            flex: 1
                        },
                        { text: '链接索引', width:100, dataIndex: 'indexing',hidden:true },
                        {
                            text: '启用',
                            dataIndex: 'enabled',
                            align:'center',
                            renderer:function(value){
                                if(value){
                                    if(value==1){
                                        return '<span style="color:blue">是</span>';
                                    }else{
                                        return '<span style="color:red">否</span>';
                                    }
                                }
                            }
                        },
                        {
                            text: '排序',
                            dataIndex: 'sort',
                            width:70,
                            align:'center',
                            hidden:true
                        },
                        {
                            text: '创建时间',
                            dataIndex: 'create_date',
                            align:'center',
                            xtype: 'datecolumn',
                            width:150,
                            hidden:true,
                            renderer:function(value){
                                if(value){
                                    var v = Ext.util.Format.date(new Date(parseInt(value,0)*1000),"Y-m-d H:i:s");
                                    return '<span style="color:red">'+v+'</span>';
                                }else{
                                    return '<span style="text-align:center">-</span>';
                                }
                            }
                        },
                        {
                            text: '修改时间',
                            dataIndex: 'modify_date',
                            hidden:true,
                            align:'center',
                            xtype: 'datecolumn',
                            width:150,
                            renderer:function(value){
                                if(value){
                                    var v = Ext.util.Format.date(new Date(parseInt(value,0)*1000),"Y-m-d H:i:s");
                                    return '<span style="color:blue">'+v+'</span>';
                                }else{
                                    return '<span style="text-align:center">-</span>';
                                }
                            }
                        }
                    ],
                    dockedItems: [
                        {
                            xtype: 'toolbar',
                            dock: 'top',
                            items: [
                                {
                                    id:'link_search_treepicker',
                                    xtype: 'treepicker',
                                    // fieldLabel:'所属分类',
                                    // flex: 1,
                                    autoScroll:true,
                                    minPickerHeight:'auto',
                                    maxPickerHeight:200,
                                    emptyText:'无分类选择',
                                    blankText:'无分类选择',
                                    displayField : 'title',
                                    value:{},
                                    // margin:'25px 0 0 0',
                                    labelStyle: 'font-weight:bold;padding-bottom:5px',
                                    store:Ext.create('Xnfy.store.ClassifyMenu').load({params:{indexing:'link'},callback:function(records,operation,success){
                                        var response = Ext.decode(operation.response.responseText);
                                        var link_search_treepicker = me.queryById('link_search_treepicker');
                                        if(success && records.length>0){
                                            link_search_treepicker.store.setRootNode({title:'全部链接',id:response.pid,expanded:true});
                                            link_search_treepicker.store.getRootNode().appendChild({title:'未分类链接',id:-1,leaf:true});
                                            link_search_treepicker.setValue(response.pid);
                                            link_search_treepicker.store.getRootNode().expand(true);
                                        }else{
                                            link_search_treepicker.disable();
                                        }
                                    }}),
                                    listeners:{
                                        afterrender:function( self, eOpts ){
                                        },
                                        select:function( self, record, eOpts ){
                                            self.collapse();
                                            if(record.data.root){
                                                self.up('gridpanel').getStore().load();
                                            }else if(record.data.id<0){
                                                self.up('gridpanel').getStore().reload({params:{pid:0}});
                                            }else{
                                                if(record.data.leaf || record.childNodes.length<=0){
                                                    self.up('gridpanel').getStore().reload({params:{pid:record.data.id}});
                                                }else{
                                                    var datas = record.serialize();
                                                    var pids = [];
                                                    pids.push(record.data.id);
                                                    if(datas.children && datas.children.length>0){
                                                        Ext.Array.forEach(datas.children,function(items, indexs){
                                                            if(items.leaf){
                                                                pids.push(items.id);
                                                            }else{
                                                                if(items.children.length>0){
                                                                     Ext.Array.forEach(items.children, function(itemx, indexx){
                                                                        if(itemx.leaf){
                                                                            pids.push(itemx.id);
                                                                        }else{
                                                                            if(itemx.children.length>0){
                                                                                Ext.Array.forEach(itemx.children, function(item, index){
                                                                                    pids.push(item.id);
                                                                                });
                                                                            }
                                                                        }
                                                                    });
                                                                }
                                                            }
                                                        });
                                                        self.up('gridpanel').getStore().reload({params:{pid:pids.toString()}});
                                                    }
                                                }
                                            }
                                        },
                                        focus:function(self){
                                        }
                                    }
                                },
                                {
                                    xtype: 'searchfield',
                                    emptyText: '输入搜索关键字',
                                    store:Ext.create('Xnfy.store.LinkList'),
                                    width:200
                                },
                                {
                                    xtype: 'tbfill'
                                },
                                {
                                    itemId:'add',
                                    xtype: 'button',
                                    text: '添加链接',
                                    iconCls:'icon-file',
                                    listeners:{
                                        scope:this,
                                        click:function(button){
                                            var gridpanel = button.up('gridpanel');
                                            var form = gridpanel.nextSibling('form');
                                            form.setTitle('添加 链接');
                                            form.getDockedItems('toolbar [itemId=addEdit]')[0].setText('确认添加');
                                            form.queryById('base').expand();
                                            var gridselectionmodel = gridpanel.getSelectionModel();
                                            if(gridselectionmodel.getCount()>0){
                                                gridselectionmodel.deselectAll(true);
                                            }
                                            gridpanel.getDockedItems('toolbar [itemId=delete]')[0].setDisabled(true);
                                            form.getForm().reset();
                                            var treepicker = form.getForm().findField('pid');
                                            if(treepicker.disabled){
                                                treepicker.setValue(0);
                                            }else{
                                                var pid = treepicker.getStore().getRootNode().internalId;
                                                treepicker.setValue(pid);
                                            }
                                        }
                                    }
                                },
                                {
                                    itemId:'delete',
                                    xtype: 'button',
                                    text: '删除链接',
                                    iconCls:'icon-trash',
                                    disabled:true,
                                    listeners:{
                                        scope:this,
                                        click:function(t){
                                            var gridpanel = t.up('gridpanel');
                                            var form = gridpanel.nextSibling('form');
                                            if(gridpanel.getSelectionModel().getCount()<=0){
                                                Ext.create('Xnfy.util.common').uxNotification(false,'请选择要删除的数据');
                                                return false;
                                            }
                                            var datas = gridpanel.getSelectionModel().getSelection();
                                            var ids = [];
                                            Ext.Array.forEach(datas,function(item,index,all){
                                                ids.push(parseInt(item.internalId,0));
                                            });
                                            Ext.MessageBox.show({
                                                title:'删除数据?',
                                                msg: '确认删除所选数据?',
                                                buttons: Ext.MessageBox.YESNO,
                                                buttonText:{
                                                    yes: "确认",
                                                    no: "取消"
                                                },
                                                fn: function(btn){
                                                    if(btn=='yes'){
                                                        if(ids.length>0){
                                                            Ext.Ajax.request({
                                                                url:"admin/link/delete",
                                                                method:'POST',
                                                                params:{ids:ids.toString()},
                                                                callback:function(records, operation, success){
                                                                    var response = Ext.JSON.decode(success.responseText);
                                                                    if(response.success){
                                                                        gridpanel.getSelectionModel().deselectAll();
                                                                        gridpanel.getStore().reload();
                                                                        form.setTitle('添加 链接');
                                                                        form.getDockedItems('toolbar [itemId=addEdit]')[0].setText('确认添加');
                                                                        form.getForm().reset();
                                                                        var pid = form.getForm().findField('pid').getStore().getRootNode().internalId;
                                                                        form.getForm().setValues({pid:pid});
                                                                        form.queryById('base').expand();
                                                                        Ext.create('Xnfy.util.common').uxNotification(true,'删除数据成功');
                                                                    }else{
                                                                        Ext.create('Xnfy.util.common').uxNotification(false,'删除数据失败');
                                                                    }
                                                                }
                                                            });
                                                        }
                                                    }
                                                },
                                                icon: Ext.MessageBox.QUESTION
                                            });
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'pagingtoolbar',
                            dock: 'bottom',
                            width: 360,
                            displayInfo: true,
                            plugins: Ext.create('Ext.ux.ProgressBarPager', {})
                        }
                    ],
                    listeners:{
                        scope:this,
                        selectionchange:function(t, r){
                            var form = this.child('form');
                            form.getDockedItems('toolbar [itemId=addEdit]')[0].setText('确认修改');
                            if(r.length>0){
                                var treepicker = form.getForm().findField('pid');
                                var combobox_image = form.getForm().findField('combobox_image');

                                form.getForm().loadRecord(t.lastSelected);
                                form.setTitle('修改 链接');
                                var pid = treepicker.getStore().getRootNode().internalId;
                                var image = form.queryById('cover');
                                if(treepicker.disabled){
                                    treepicker.setValue(0);
                                }else{
                                    if(t.lastSelected.data.pid==0){
                                        treepicker.setValue(pid);
                                    }else{
                                        treepicker.setValue(t.lastSelected.data.pid);
                                    }
                                }

                                if(t.lastSelected.data.cover!=''){
                                    combobox_image.setValue(1);
                                    image.setSrc(t.lastSelected.data.cover);
                                    image.show();
                                }else{
                                    combobox_image.setValue(0);
                                    image.hide();
                                    image.setSrc('');
                                }
                                this.child('gridpanel').getDockedItems('toolbar [itemId=delete]')[0].setDisabled(false);
                            }else{
                                this.child('gridpanel').getDockedItems('toolbar [itemId=delete]')[0].setDisabled(true);
                            }

                        },
                        celldblclick:function(){
                            var form = this.child('form');
                            form.queryById('base').expand();
                        }
                    }
                },
                {
                    xtype: 'form',
                    region: 'east',
                    layout:'accordion',
                    title:'添加链接',
                    header:false,
                    flex: 0.34,
                    defaults:{
                        bodyPadding:'5'
                    },
                    items:[{
                        xtype:'form',
                        title:'基本信息',
                        itemId:"base",
                        autoScroll:true,
                        defaultType: 'textfield',
                        fieldDefaults: {
                            labelAlign: 'top',
                            anchor: '100%',
                            labelStyle: 'font-weight:bold;padding-bottom:5px'
                        },
                        items: [{
                                xtype:'hiddenfield',
                                name:'id'
                            },{
                                labelAlign: 'top',
                                anchor:'100%',
                                xtype: 'treepicker',
                                name:'pid',
                                id:'link-treepicker',
                                fieldLabel:'所属分类',
                                flex: 1,
                                autoScroll:true,
                                minPickerHeight:'auto',
                                maxPickerHeight:200,
                                value:{},
                                emptyText:'分类选择',
                                blankText:'无分类选择',
                                displayField : 'title',
                                // margin:'25px 0 0 0',
                                labelStyle: 'font-weight:bold;padding-bottom:5px',
                                store:Ext.create('Xnfy.store.ClassifyMenu'),
                                listeners:{
                                    afterrender:function( self, eOpts ){
                                        self.store.load({params:{indexing:'link'},callback:function(records,operation,success){
                                            var response = Ext.decode(operation.response.responseText);
                                            if(success && records.length>0){
                                                self.store.setRootNode({title:'选择分类',id:response.pid}).expand();
                                                self.setValue(response.pid);
                                                self.store.getRootNode().expand(true);
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
                                    expand:function( field, eOpts ){
                                    },
                                    select:function( self, record, eOpts ){
                                        self.collapse();
                                    }
                                }
                            },
                            {
                                fieldLabel: '链接标题',
                                labelAlign: 'top',
                                allowBlank: false,
                                emptyText:'链接标题',
                                name:'title',
                                maxLength:15
                            },
                            {
                                fieldLabel: '链接地址',
                                labelAlign: 'top',
                                name:'link',
                                allowBlank: true,
                                emptyText:'链接地址',
                                vtype:'url'
                            },{
                                xtype: 'combobox',
                                name:"enabled",
                                //allowBlank: false,
                                fieldLabel:'启　　用',
                                emptyText : '请选择',
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
                        }]
                        },{
                            xtype:'form',
                            title:'额外信息',
                            autoScroll:true,
                            defaultType: 'textfield',
                            // bodyStyle:'overflow-x:hidden;overflow-y:inherit;',
                            fieldDefaults: {
                                labelAlign: 'top',
                                anchor: '100%',
                                labelStyle: 'font-weight:bold;padding-bottom:5px'
                                // msgTarget:'side'
                            },
                            items:[{
                                    fieldLabel: '链接索引',
                                    labelAlign: 'top',
                                    name:'indexing',
                                    allowBlank: true,
                                    emptyText:'链接索引',
                                    maxLength:15,
                                    stripCharsRe:new RegExp(/[\W]/i)
                                },{
                                    xtype:'numberfield',
                                    name:'sort',
                                    minValue: 0,
                                    maxValue:255,
                                    fieldLabel:'排　　序',
                                    value:99
                                },
                                {
                                    xtype: 'textareafield',
                                    name:'remark',
                                    fieldLabel: '备　　注',
                                    height: 120,
                                    margin: '0',
                                    allowBlank: true,
                                    msgTarget:'under',
                                    maxLength:200
                            }]
                        },{
                        xtype:'form',
                        title:'封面图片',
                        autoScroll:true,
                        defaultType: 'textfield',
                        // bodyStyle:'overflow-x:hidden;overflow-y:inherit;',
                        fieldDefaults: {
                            labelAlign: 'top',
                            anchor: '100%',
                            labelStyle: 'font-weight:bold;padding-bottom:5px'
                            // msgTarget:'side'
                        },
                        items:[{
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
                                //allowBlank: false,
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
                                                    width:880,
                                                    height:580,
                                                    html:'<iframe id="'+iframeid+'" style="width:100%;height:100%;border:0" src="public/filemanager/dialog.php?type=1&random="'+Math.random()+'></iframe>',
                                                    closable: true,
                                                    style: {
                                                        borderStyle: '0 solid #fff'
                                                    },
                                                    listeners:{
                                                        scope:this,
                                                        close:function(){
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
                                padding:'2px 0 0 0',
                                anchor:'100%'
                            })]
                    }],
                    listeners:{
                    },
                    dockedItems: [{
                            xtype: 'toolbar',
                            dock: 'bottom',
                            ui: 'footer',
                            items: [
                                {
                                    xtype: 'tbfill'
                                },
                                {
                                    text: '取消',
                                    formBind: true,
                                    handler:function(button){
                                        var panel = button.up('form').up('panel');
                                        var form = button.up('form').getForm(); //获取表单组件
                                        var values = form.getFieldValues(true);
                                        var pid = form.findField('pid').getStore().getRootNode().internalId;
                                        if(values.id){
                                            button.up('form').setLoading(true);
                                            var store = panel.child('gridpanel').getStore();
                                            var datas = store.findRecord('id',values.id);
                                            form.loadRecord(datas);
                                            if(datas.data.pid==0){
                                                form.setValues({pid:pid});
                                            }
                                            if(datas.data.cover){
                                                form.findField('combobox_image').setValue(1);
                                                form.owner.queryById('cover').setSrc(datas.data.cover);
                                                form.owner.queryById('cover').setVisible(true);
                                            }else{
                                                form.findField('combobox_image').setValue(0);
                                                form.owner.queryById('cover').setSrc('');
                                                form.owner.queryById('cover').setVisible(false);
                                            }
                                            button.up('form').setLoading(false);
                                        }else{
                                            form.reset();
                                            form.setValues({pid:pid});
                                        }
                                    }
                                },
                                {
                                    text: '确认添加',
                                    itemId:'addEdit',
                                    formBind: true,
                                    handler:function(button){
                                        var panel = button.up('form').up('panel');
                                        var form = button.up('form'); //获取表单组件
                                        var center = Ext.getCmp("center");
                                        var values = form.getForm().getFieldValues(true);
                                        var pid = form.getForm().findField('pid').getStore().getRootNode().internalId;
                                        if(values.pid==pid || !values.pid){
                                            form.getForm().setValues({pid:0});
                                            pids = 0;
                                        }else{
                                            pids = values.pid;
                                        }
                                        if(form.getForm().findField('id') && form.getForm().findField('id').value>0){
                                            form.getForm().submit({
                                                waitMsg:'正在处理数据...',
                                                method:'POST',
                                                params:{pid:pids},
                                                url:'admin/link/update',
                                                submitEmptyText:false,
                                                success:function(f, response){
                                                    form.getForm().setValues({pid:values.pid});
                                                    panel.child('gridpanel').getStore().reload();
                                                    Ext.create('Xnfy.util.common').uxNotification(true,'修改数据成功',3000);
                                                },
                                                failure:function(f, response){
                                                    Ext.create('Xnfy.util.common').uxNotification(false,response.result.errors.msg,5000);
                                                }
                                            });
                                        }else{
                                            form.getForm().submit({
                                                    params:{pid:pids},
                                                    waitMsg:'正在处理数据...',
                                                    method:'POST',
                                                    submitEmptyText:false,
                                                    url:'admin/link/insert',
                                                    success:function(f, response){
                                                        panel.child('gridpanel').getStore().reload();
                                                        form.getForm().reset();
                                                        form.getForm().setValues({pid:pid});
                                                        form.queryById('base').expand();
                                                        Ext.create('Xnfy.util.common').uxNotification(true,'添加数据成功',3000);
                                                    },
                                                    failure:function(f, response){
                                                        Ext.create('Xnfy.util.common').uxNotification(false,response.result.errors.msg,5000);
                                                    }
                                                });
                                        }
                                    }
                                }
                            ]
                        }]
                }
            ]
        });
        me.callParent(arguments);
    }

});