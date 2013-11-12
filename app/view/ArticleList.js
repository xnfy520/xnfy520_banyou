Ext.define('Xnfy.view.ArticleList', {
    extend: 'Ext.panel.Panel',
    requires: [
        'Ext.ux.ProgressBarPager',
        'Xnfy.util.common'
    ],
    id:'article_list',
    alias: 'widget.articlelist',
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
                    // style: {
                    //     borderStyle: 'solid',
                    //     borderWidth:"0 5px 0 0",
                    //     borderColor:"#ADD2ED"
                    // },
                    columns: [
                        {
                            text: '#',
                            dataIndex: 'id',
                            width:60,
                            hidden:true
                        },
                        {
                            text: '文章标题',
                            dataIndex: 'title',
                            flex: 1
                        },
                        {
                            text: '标识索引',
                            dataIndex: 'indexing',
                            width:100,
                            hidden:true
                        },
                        {
                            text: '浏览',
                            dataIndex: 'views',
                            align:'center',
                            width:70
                        },
                        {
                            text: '排序',
                            dataIndex: 'sort',
                            width:70,
                            align:'center',
                            hidden:true
                        },
                        {
                            text: '来源',
                            dataIndex: 'source',
                            width:100,
                            hidden:true,
                            renderer:function(value,metaData,record,rowIndex,colIndex,store,view){
                                if(record.data.source_url){
                                    return '<a target="_blank" style="color:#999;text-decoration:none" href="'+record.data.source_url+'">'+value+'</a>';
                                }else{
                                    return '<a target="_blank" style="text-decoration:none">'+value+'</a>';
                                }
                            }
                        },
                        {
                            text: '作者',
                            dataIndex: 'author',
                            width:100,
                            hidden:true
                        },
                        {
                            text: '发布',
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
                            text: '发布日期',
                            dataIndex: 'release_date',
                            align:'center',
                            xtype: 'datecolumn',
                            width:150,
                            hidden:false,
                            renderer:function(value){
                                if(value){
                                    var v = Ext.util.Format.date(new Date(parseInt(value,0)*1000),"Y-m-d H:i:s");
                                    return '<span style="color:red">'+v+'</span>';
                                }else{
                                    return '<span style="text-align:center">-</span>';
                                }
                            }
                        },{
                            text: '创建日期',
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
                            text: '最后修改日期',
                            dataIndex: 'modify_date',
                            align:'center',
                            xtype: 'datecolumn',
                            width:150,
                            hidden:true,
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
                                    id:'search_treepicker',
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
                                    store:Ext.create('Xnfy.store.ClassifyMenu').load({params:{indexing:'article'},callback:function(records,operation,success){
                                        var response = Ext.decode(operation.response.responseText);
                                        var this_treepicker = me.queryById('search_treepicker');
                                        if(success && records.length>0){
                                            this_treepicker.store.setRootNode({title:'所有文章',id:response.pid,expanded:true});
                                            this_treepicker.store.getRootNode().appendChild({title:'未分类文章',id:-1,leaf:true});
                                            this_treepicker.setValue(response.pid);
                                            this_treepicker.store.getRootNode().expand(true);
                                        }else{
                                            this_treepicker.disable();
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
                                                self.up('gridpanel').getStore().reload({params:{pid:record.data.id}});
                                            }
                                        }
                                    }
                                },
                                {
                                    xtype: 'combobox',
                                    id:'search_combobox',
                                    name:"type",
                                    //allowBlank: false,
                                    // fieldLabel:'文章类型',
                                    // labelWidth: 60,
                                    width:115,
                                    emptyText : '所有文章类型',
                                    mode : 'local',// 数据模式，local代表本地数据
                                    //readOnly : false,// 是否只读
                                    editable : false,// 是否允许输入
                                    //forceSelection : true,// 必须选择一个选项
                                    //blankText : '请选择',// 该项如果没有选择，则提示错误信息,
                                    store:Ext.create('Ext.data.Store', {
                                        fields: ['text', 'type'],
                                        data : [
                                            {"text":"所有文章类型", "type":0},
                                            {"text":"图文", "type":1},
                                            {"text":"视频", "type":2}
                                        ]
                                    }),
                                    // value:0,
                                    displayField:'text',
                                    valueField:'type',
                                    listeners: {
                                      change:function(self,n,o){
                                        self.up('gridpanel').getStore().reload({params:{type:n}});
                                      }
                                    }
                                },
                                {
                                    xtype: 'searchfield',
                                    emptyText: '输入搜索关键字',
                                    store:Ext.create('Xnfy.store.ArticleList'),
                                    width:200
                                },
                                {
                                    xtype: 'tbfill'
                                },
                                {
                                    itemId:'add',
                                    xtype: 'button',
                                    text: '添加文章',
                                    iconCls:'icon-file',
                                    listeners:{
                                        scope:this,
                                        click:function(button){
                                            var center = Ext.getCmp("center");
                                            var panel = center.getComponent(this.id+'-add');
                                            if(panel){
                                                center.setActiveTab(panel);
                                            }else{
                                                panel = Ext.create('Xnfy.view.ArticleAdd');
                                                panel.setTitle('添加 文章');
                                                panel.id = this.id+'-add';
                                                center.setActiveTab(center.add(panel));
                                            }
                                        }
                                    }
                                },
                                {
                                    itemId:'edit',
                                    xtype: 'button',
                                    text: '修改文章',
                                    iconCls:'icon-edit',
                                    disabled:true,
                                    listeners:{
                                        scope:this,
                                        click:function(button){
                                            var gridpanel = button.up('gridpanel');
                                            var gridselectionmodel = gridpanel.getSelectionModel();
                                            var lastmodel = gridselectionmodel.getLastSelected();
                                            me.edit_article(this.id,lastmodel.data.id);
                                        }
                                    }
                                },
                                {
                                    itemId:'delete',
                                    xtype: 'button',
                                    text: '删除文章',
                                    iconCls:'icon-trash',
                                    disabled:true,
                                    listeners:{
                                        scope:this,
                                        click:function(t){
                                            var gridpanel = t.up('gridpanel');
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
                                                                url:"admin/article/delete",
                                                                method:'POST',
                                                                params:{ids:ids.toString()},
                                                                callback:function(records, operation, success){
                                                                    var response = Ext.JSON.decode(success.responseText);
                                                                    if(response.success){
                                                                        gridpanel.getSelectionModel().deselectAll();
                                                                        gridpanel.getStore().reload();
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
                            if(r.length==1){
                                this.child('gridpanel').getDockedItems('toolbar [itemId=edit]')[0].setDisabled(false);
                                this.child('gridpanel').getDockedItems('toolbar [itemId=delete]')[0].setDisabled(false);
                            }else if(r.length>0){
                                this.child('gridpanel').getDockedItems('toolbar [itemId=edit]')[0].setDisabled(true);
                                this.child('gridpanel').getDockedItems('toolbar [itemId=delete]')[0].setDisabled(false);
                            }else{
                                this.child('gridpanel').getDockedItems('toolbar [itemId=edit]')[0].setDisabled(true);
                                this.child('gridpanel').getDockedItems('toolbar [itemId=delete]')[0].setDisabled(true);
                            }
                        },
                        celldblclick:function(self, td, cellIndex, record, tr, rowIndex, e, eOpts){
                            if(record){
                                me.edit_article(this.id,record.data.id);
                            }
                        }
                    }
                }
            ]
        });
        me.callParent(arguments);
    },
    edit_article:function(cmpid,dataid){
        var center = Ext.getCmp("center");
        var panel = center.getComponent(cmpid+'-edit');
        if(panel){
            center.setActiveTab(panel);
            panel.queryById('base').expand();
        }else{
            panel = Ext.create('Xnfy.view.ArticleEdit');
            panel.setTitle('修改 文章');
            panel.id = this.id+'-edit';
            center.setActiveTab(center.add(panel));
        }
        panel.setLoading(true);
        panel.down('form').load({
            url:'admin/article/getdata',
            params:{id:dataid},
            success:function(form,action){
                var pid = form.findField('pid').getStore().getRootNode().data.id;
                var form_values = form.getValues();
                form.findField('type').setValue(parseInt(form_values.type,10));
                if(form_values.pid==0){
                    form.setValues({pid:pid});
                }
                if(form_values.cover){
                    form.findField('combobox_image').setValue(1);
                    form.owner.queryById('cover').setSrc(form_values.cover);
                    form.owner.queryById('cover').setVisible(true);
                }else{
                    form.findField('combobox_image').setValue(0);
                    form.owner.queryById('cover').setSrc('');
                    form.owner.queryById('cover').setVisible(false);
                }
                panel.setLoading(false);
            },
            failure:function(form,action){
                panel.setLoading(false);
                Ext.create('Xnfy.util.common').uxNotification(false,'异常操作',3000);
            }
        });
    }

});