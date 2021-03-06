Ext.define('Xnfy.view.CommodityManage', {
    extend: 'Ext.panel.Panel',
    requires: [
        'Ext.ux.ProgressBarPager',
        'Xnfy.util.common'
    ],
    alias: 'widget.commoditymanage',
    title: 'Tab',
    closable: true,
    layout: {
        type: 'fit'
    },
    initComponent: function() {
        var me = this;
        // console.log(category);
        Ext.applyIf(me, {
            items: [
                        {
                            xtype: 'gridpanel',
                            selType:'checkboxmodel',
                            features: [{
                                ftype:'grouping',
                                groupHeaderTpl:[
                                '商品: <strong style="color:#157FCC">{rows:this.getName}</strong> <i>( {rows.length} )</i>',{
                                    getName: function(datas) {
                                        return datas[0].data.name;
                                    }
                                }],
                                hideGroupedHeader: true,
                                startCollapsed: false,
                                enableGroupingMenu:false
                            }],
                            selModel: {
                                injectCheckbox:'last'
                            },
                            viewConfig: {
                                stripeRows: true
                            },
                            // plugins: [
                            //     Ext.create('Ext.grid.plugin.CellEditing', {
                            //         clicksToEdit: 1,
                            //         listeners : {
                            //             beforeedit : function(e,obj) {
                            //             },
                            //             edit:function(editor, context){
                            //             }
                            //         }
                            //     })
                            // ],
                            border:false,
                            store: Ext.create('Xnfy.store.CommodityList'),
                            columns: [
                                {
                                    text: '#',
                                    dataIndex: 'id',
                                    width:60,
                                    hidden:true,
                                    groupable:false
                                },
                                {
                                    text: '',
                                    dataIndex: 'master',
                                    width:45,
                                    // align:'center',
                                    groupable:false,
                                    renderer:function(value,metaData,record,rowIndex,colIndex,store,view){
                                        var i;
                                        if(value==1){
                                            i = '<img src="public/images/online.png" />';
                                        }else{
                                            i = '<img src="public/images/offline.png" />';
                                        }
                                        // value = (value==1) ? ' <span class="icon-circle" style="color:red"></span>' : '';
                                        return i;
                                    }
                                },
                                {
                                    text: '商品名称',
                                    dataIndex: 'name',
                                    width:150,
                                    hidden:true,
                                    groupable:false
                                },
                                {
                                    text: '商品标题',
                                    dataIndex: 'title',
                                    flex: 1,
                                    groupable:false
                                },
                                {
                                    text:'商品价格',
                                    dataIndex: 'selling_price',
                                    align:'right',
                                    groupable:false,
                                    filter: {type: 'numeric'},
                                    renderer:function(value,metaData,record,rowIndex,colIndex,store,view){
                                        if(value){
                                            return '&yen; '+Ext.util.Format.number(value,'0,000.00');
                                        }
                                    }
                                },
                                {
                                    text: '启用',
                                    dataIndex: 'enabled',
                                    width:70,
                                    align:'center',
                                    groupable:false,
                                    renderer:function(value){
                                        if(value){
                                            if(value==1){
                                                return '<span style="color:blue">是</span>';
                                            }else{
                                                return '<span style="color:red">否</span>';
                                            }
                                        }
                                    }
                                },{
                                    text: '排序',
                                    dataIndex: 'sort',
                                    width:70,
                                    editor: {
                                        xtype: 'numberfield',
                                        style: 'text-align: right'
                                    },
                                    align:'center',
                                    groupable:false
                                },
                                {
                                    text: '创建时间',
                                    dataIndex: 'create_date',
                                    align:'center',
                                    hidden:true,
                                    xtype: 'datecolumn',
                                    width:150,
                                    groupable:false,
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
                                    groupable:false,
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
                                            fieldLabel: '选择品牌',
                                            itemId:'brandSearch',
                                            hideLabel:true,
                                            store: Ext.create('Ext.data.Store', {
                                                autoLoad: true,
                                                fields: ['title', 'id'],
                                                proxy: {
                                                     type: 'ajax',
                                                     url: 'admin/commodity/getBrand',
                                                     reader: {
                                                         type: 'json',
                                                         root: 'data'
                                                     }
                                                 },
                                                 listeners:{
                                                     beforeload: function(t){
                                                        if(me.data){
                                                            Ext.apply(this.proxy.extraParams, { category: me.data.id});
                                                        }
                                                     }
                                                 }
                                            }),
                                            emptyText:'选择品牌',
                                            // editable : false,
                                            xtype:'combobox',
                                            queryMode: 'local',
                                            displayField: 'title',
                                            valueField: 'id',
                                            // value:0,
                                            listeners:{
                                                afterrender:function(self){
                                                    self.setValue(0);
                                                },
                                                select:function( self, record, eOpts ){
                                                    var brand = record[0].data.id;
                                                    var panel = self.up('commoditymanage');
                                                    self.up('gridpanel').getStore().reload();
                                                    // if(brand==0){
                                                    //     self.up('gridpanel').getStore().load();
                                                    // }else if(brand<0){
                                                    //     self.up('gridpanel').getStore().reload({params:{brand:0}});
                                                    // }else{
                                                    //     self.up('gridpanel').getStore().reload({params:{brand:brand}});
                                                    // }
                                                }
                                            }
                                        },
                                        {
                                            xtype: 'searchfield',
                                            emptyText: '输入搜索关字',
                                            store:Ext.create('Xnfy.store.CommodityList'),
                                            width:300
                                        },
                                        {
                                            xtype: 'tbfill'
                                        },
                                        {
                                            itemId:'add',
                                            xtype: 'button',
                                            text: '添加商品',
                                            iconCls:'icon-file',
                                            listeners:{
                                                scope:this,
                                                click:function(button){
                                                    var center = Ext.getCmp("center");
                                                    var panel = center.getComponent(this.data.indexing+'-add-'+this.data.id);
                                                    if(panel){
                                                        center.setActiveTab(panel);
                                                    }else{
                                                        panel = Ext.create('Xnfy.view.CommodityManageAdd');
                                                        panel.setTitle('添加 '+this.data.text+'商品');
                                                        panel.id = this.data.indexing+'-add-'+this.data.id;
                                                        panel.data = this.data;
                                                        center.setActiveTab(center.add(panel));
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            itemId:'edit',
                                            xtype: 'button',
                                            text: '修改商品',
                                            iconCls:'icon-edit',
                                            disabled:true,
                                            listeners:{
                                                scope:this,
                                                click:function(button){
                                                    var center = Ext.getCmp("center");
                                                    var panel = center.getComponent(this.data.indexing+'-add-'+this.data.id);
                                                    if(panel){
                                                        center.setActiveTab(panel);
                                                    }else{
                                                        panel = Ext.create('Xnfy.view.CommodityManageAdd');
                                                        panel.setTitle('添加 '+this.data.text+'商品');
                                                        panel.id = this.data.indexing+'-add-'+this.data.id;
                                                        panel.data = this.data;
                                                        center.setActiveTab(center.add(panel));
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            itemId:'delete',
                                            xtype: 'button',
                                            text: '删除商品',
                                            iconCls:'icon-trash',
                                            disabled:true,
                                            listeners:{
                                                scope:this,
                                                click:function(button){
                                                    var gridpanel = button.up('gridpanel');
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
                                                                        url:"admin/commodity/delete",
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
                                        console.log(record);
                                        // me.edit_article(this.id,record.data.id);
                                    }
                                }
                            }
                        }
                    ]
        });
        me.callParent(arguments);
    }
});