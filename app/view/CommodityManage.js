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
                            selModel: {
                                injectCheckbox:'last'
                            },
                            viewConfig: {
                                stripeRows: false
                            },
                            border:false,
                            columns: [
                                {
                                    text: '#',
                                    dataIndex: 'id',
                                    width:60,
                                    hidden:true
                                },{
                                    text: '商品名称',
                                    dataIndex: 'name',
                                    width:150,
                                    renderer:function(value,metaData,record,rowIndex,colIndex,store,view){
                                        var flag = record.data.master==1 ? ' <span class="icon-circle" style="float:right;color:red"></span>' : '';
                                        return value+flag;
                                    }
                                },
                                {
                                    text: '商品标题',
                                    dataIndex: 'title',
                                    flex: 1
                                },
                                {
                                    text:'商品价格',
                                    dataIndex: 'selling_price',
                                    align:'right',
                                    renderer:function(value,metaData,record,rowIndex,colIndex,store,view){
                                        return '&yen; '+Ext.util.Format.number(value,'0,000.00');
                                    }
                                },
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
                                    text: '创建时间',
                                    dataIndex: 'create_date',
                                    align:'center',
                                    hidden:true,
                                    xtype: 'datecolumn',
                                    width:150,
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
                                                        Ext.apply(this.proxy.extraParams, { category: me.data.id});
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
                                                    button.up('gridpanel').nextSibling('form').expand();
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
                                                click:function(t){
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
                            ]
                        }
                    ]
        });
        me.callParent(arguments);
    }
});