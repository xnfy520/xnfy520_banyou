Ext.define('Xnfy.view.UserList', {
    extend: 'Ext.panel.Panel',
    requires: [
        'Ext.ux.ProgressBarPager',
        'Xnfy.util.common'
    ],
    alias: 'widget.userlist',
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
                            text: '用户名',
                            dataIndex: 'username',
                            flex: 1
                        },
                        {
                            text: '邮箱',
                            width:200,
                            dataIndex: 'email'
                        },
                        {
                            text: '启用',
                            width:70,
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
                            text: '注册日期',
                            dataIndex: 'register_date',
                            // align:'center',
                            xtype: 'datecolumn',
                            width:150,
                            renderer:function(value){
                                if(value){
                                    var v = Ext.util.Format.date(new Date(parseInt(value,0)*1000),"Y-m-d H:i:s");
                                    return v;
                                }else{
                                    return '';
                                }
                            }
                        },
                        {
                            text: '最后登录',
                            dataIndex: 'last_login_date',
                            hidden:false,
                            // align:'center',
                            xtype: 'datecolumn',
                            width:150,
                            renderer:function(value){
                                if(value){
                                    var v = Ext.util.Format.date(new Date(parseInt(value,0)*1000),"Y-m-d H:i:s");
                                    return v;
                                }else{
                                    return '';
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
                                    id:'user_search_treepicker',
                                    xtype: 'treepicker',
                                    // fieldLabel:'所属分类',
                                    // flex: 1,
                                    autoScroll:true,
                                    minPickerHeight:'auto',
                                    maxPickerHeight:200,
                                    emptyText:'分组选择',
                                    blankText:'无分组选择',
                                    displayField : 'title',
                                    // value:0,
                                    // margin:'25px 0 0 0',
                                    labelStyle: 'font-weight:bold;padding-bottom:5px',
                                    store:Ext.create('Xnfy.store.UserGroupTree').load({callback:function(records,operation,success){
                                        var search_treepicker = me.queryById('user_search_treepicker');
                                        if(success && records.length>0){
                                            search_treepicker.store.setRootNode({title:'全部用户',id:'0',expanded:true});
                                            search_treepicker.store.getRootNode().appendChild({title:'未分组用户',id:-1,leaf:true});
                                            search_treepicker.setValue('0');
                                        }else{
                                            search_treepicker.disable();
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
                                                self.up('gridpanel').getStore().reload({params:{group_id:0}});
                                            }else{
                                                self.up('gridpanel').getStore().reload({params:{group_id:record.data.id}});
                                            }
                                        }
                                    }
                                },
                                {
                                    xtype: 'searchfield',
                                    emptyText: '输入搜索关键字',
                                    store:Ext.create('Xnfy.store.UserList'),
                                    width:200
                                },
                                {
                                    xtype: 'tbfill'
                                },
                                {
                                    itemId:'add',
                                    xtype: 'button',
                                    text: '添加用户',
                                    iconCls:'icon-file',
                                    listeners:{
                                        scope:this,
                                        click:function(button){
                                            var gridpanel = button.up('gridpanel');
                                            var form = gridpanel.nextSibling('form');
                                            var gridselectionmodel = gridpanel.getSelectionModel();
                                            if(gridselectionmodel.getCount()>0){
                                                gridselectionmodel.deselectAll(true);
                                            }

                                            gridpanel.getDockedItems('toolbar [itemId=delete]')[0].setDisabled(true);
                                            form.setTitle('添加 用户');
                                            form.getForm().findField('password').allowBlank = false;
                                            form.getForm().reset();
                                            form.getDockedItems('toolbar [itemId=addEdit]')[0].setText('确认添加');
                                            form.queryById('base').expand();

                                            var treepicker = form.getForm().findField('group_id');
                                            if(treepicker.disabled){
                                                treepicker.setValue(0);
                                            }else{
                                                var pid = treepicker.getStore().getRootNode().internalId;
                                                treepicker.setValue(pid);
                                            }
                                            form.expand();
                                        }
                                    }
                                },
                                {
                                    itemId:'delete',
                                    xtype: 'button',
                                    text: '删除用户',
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
                                                                url:"admin/user/delete",
                                                                method:'POST',
                                                                params:{ids:ids.toString()},
                                                                callback:function(records, operation, success){
                                                                    var response = Ext.JSON.decode(success.responseText);
                                                                    if(response.success){
                                                                        gridpanel.getSelectionModel().deselectAll();
                                                                        gridpanel.getStore().reload();
                                                                        form.setTitle('添加 用户');
                                                                        form.getDockedItems('toolbar [itemId=addEdit]')[0].setText('确认添加');
                                                                        form.getForm().reset();
                                                                        form.getForm().findField('password').allowBlank = false;
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
                                form.setTitle('修改 用户');
                                form.getForm().findField('password').allowBlank = true;
                                form.getForm().clearInvalid();

                                var treepicker = form.getForm().findField('group_id');
                                var combobox_image = form.getForm().findField('combobox_image');

                                form.getForm().loadRecord(t.lastSelected);
                                var pid = treepicker.getStore().getRootNode().internalId;
                                var image = form.queryById('avatar');
                                if(treepicker.disabled){
                                    treepicker.setValue(0);
                                }else{
                                    if(t.lastSelected.data.group_id==0){
                                        treepicker.setValue(pid);
                                    }else{
                                        treepicker.setValue(t.lastSelected.data.group_id);
                                    }
                                }
                                if(t.lastSelected.data.avatar!=''){
                                    combobox_image.setValue(1);
                                    image.setSrc(t.lastSelected.data.avatar);
                                    image.setVisible(true);
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
                    title:'添加用户',
                    layout:'accordion',
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
                        },
                        {
                            labelAlign: 'top',
                            anchor:'100%',
                            xtype: 'treepicker',
                            name:'group_id',
                            id:'user-treepicker',
                            fieldLabel:'所属分组',
                            autoScroll:true,
                            minPickerHeight:'auto',
                            maxPickerHeight:200,
                            // value:0,
                            emptyText:'分组选择',
                            blankText:'无分组选择',
                            displayField : 'title',
                            // margin:'25px 0 0 0',
                            labelStyle: 'font-weight:bold;padding-bottom:5px',
                            store:Ext.create('Xnfy.store.UserGroupTree'),
                            listeners:{
                                afterrender:function( self, eOpts ){
                                    self.store.load({callback:function(records,operation,success){
                                        if(success && records.length>0){
                                            self.store.setRootNode({title:'选择分组',id:'0',expanded:true});
                                            self.setValue('0');
                                        }else{
                                            self.store.setRootNode({id:'0',title:'无分组选择'});
                                            self.setValue('0');
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
                            fieldLabel: '用户名',
                            labelAlign: 'top',
                            allowBlank: false,
                            emptyText:'用户名',
                            name:'username',
                            maxLength:15,
                            minLength:5,
                            stripCharsRe:new RegExp(/[^\u4e00-\u9fa5_a-z0-9]/i)
                        },
                        {
                            fieldLabel: '密　　码',
                            inputType:'password',
                            labelAlign: 'top',
                            allowBlank: false,
                            emptyText:'密码',
                            name:'password',
                            maxLength:15,
                            minLength:6,
                            stripCharsRe:new RegExp(/[\s]/i)
                        },
                        {
                            fieldLabel: '邮　　箱',
                            labelAlign: 'top',
                            allowBlank: true,
                            emptyText:'邮箱',
                            name:'email',
                            vtype: 'email'
                        },
                        {
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
                        title:'用户头像',
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
                                name:'avatar',
                                itemId:'avatar_filed',
                                fieldLabel:'头像地址',
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
                                fieldLabel:'选择头像',
                                emptyText : '选择头像',
                                mode : 'local',// 数据模式，local代表本地数据
                                //readOnly : false,// 是否只读
                                editable : false,// 是否允许输入
                                //forceSelection : true,// 必须选择一个选项
                                //blankText : '请选择',// 该项如果没有选择，则提示错误信息,
                                labelStyle: 'font-weight:bold;padding-bottom:5px',
                                store:Ext.create('Ext.data.Store', {
                                    fields: ['text', 'selected_image'],
                                    data : [
                                        {"text":"无头像", "selected_image":0},
                                        {"text":"选择头像", "selected_image":1}
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
                                                    custom_variables:{image_id:'avatar',filed_id:'avatar_filed'},
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
                                                            if(this.up('form').getForm().findField('avatar').value==''){
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
                                                this.up('form').getForm().findField('avatar').setValue('');
                                            }
                                        }
                                    }
                                },
                                listeners: {
                                    scope: this,
                                    change:function(combo,n,o){
                                        if(n==0){
                                            var img_cover = combo.up('form').queryById('avatar');
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
                                itemId:'avatar',
                                src: '',
                                hidden:true,
                                padding:'2px 0 0 0',
                                anchor:'100%'
                            })]
                    }],
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
                                        var group_id = form.findField('group_id').getStore().getRootNode().internalId;
                                        if(values.id){
                                            button.up('form').setLoading(true);
                                            var store = panel.child('gridpanel').getStore();
                                            var datas = store.findRecord('id',values.id);
                                            form.loadRecord(datas);
                                            if(datas.data.group_id==0){
                                                form.setValues({group_id:group_id});
                                            }
                                            if(datas.data.avatar){
                                                form.findField('combobox_image').setValue(1);
                                                form.owner.queryById('avatar').setSrc(datas.data.avatar);
                                                form.owner.queryById('avatar').setVisible(true);
                                            }else{
                                                form.findField('combobox_image').setValue(0);
                                                form.owner.queryById('avatar').setSrc('');
                                                form.owner.queryById('avatar').setVisible(false);
                                            }
                                            form.setValues({password:null});
                                            button.up('form').setLoading(false);
                                        }else{
                                            form.reset();
                                            form.setValues({group_id:group_id});
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
                                        var group_id = form.getForm().findField('group_id').getStore().getRootNode().internalId;
                                        if(values.group_id==group_id || !values.group_id){
                                            form.getForm().setValues({group_id:0});
                                            pids = 0;
                                        }else{
                                            pids = values.group_id;
                                        }
                                        if(form.getForm().findField('id') && form.getForm().findField('id').value>0){
                                            form.getForm().submit({
                                                waitMsg:'正在处理数据...',
                                                method:'POST',
                                                params:{group_id:pids},
                                                url:'admin/user/update',
                                                submitEmptyText:false,
                                                success:function(f, response){
                                                    form.getForm().setValues({group_id:values.group_id});
                                                    panel.child('gridpanel').getStore().reload();
                                                    Ext.create('Xnfy.util.common').uxNotification(true,'修改数据成功',3000);
                                                },
                                                failure:function(f, response){
                                                    Ext.create('Xnfy.util.common').uxNotification(false,response.result.errors.msg,5000);
                                                }
                                            });
                                        }else{
                                            form.getForm().submit({
                                                    params:{group_id:pids},
                                                    waitMsg:'正在处理数据...',
                                                    method:'POST',
                                                    submitEmptyText:false,
                                                    url:'admin/user/insert',
                                                    success:function(f, response){
                                                        panel.child('gridpanel').getStore().reload();
                                                        form.getForm().reset();
                                                        form.getForm().setValues({group_id:group_id});
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