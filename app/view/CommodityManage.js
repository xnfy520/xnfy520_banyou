var store = Ext.create('Ext.data.Store', {
    storeId:'employeeStore',
    fields:['name', 'seniority', 'department'],
    groupField: 'department',
    data: {'employees':[
        { "name": "Michael Scott",  "seniority": 7, "department": "Management" },
        { "name": "Dwight Schrute", "seniority": 2, "department": "Sales" },
        { "name": "Jim Halpert",    "seniority": 3, "department": "Sales" },
        { "name": "Kevin Malone",   "seniority": 4, "department": "Accounting" },
        { "name": "Angela Martin",  "seniority": 5, "department": "Accounting" }
    ]},
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            root: 'employees'
        }
    }
});

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
                                },
                                {
                                    text: '商品标题',
                                    dataIndex: 'title',
                                    flex: 1
                                },{
                                    text: '商品名称',
                                    dataIndex: 'name',
                                    width:150
                                },
                                { text: '商品索引',  dataIndex: 'indexing' },
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
                            ],
                            store: Ext.create('Xnfy.store.CommodityList'),
                            features: [{
                                ftype: 'grouping',
                                groupByText:'字段分组',
                                showGroupsText:'显示分组',
                                groupHeaderTpl: '{name}',
                                listeners:{
                                    groupclick:function( view, node, group, e, eOpts ){
                                        console.log(view);
                                    }
                                }
                                // hideGroupedHeader: false,
                                // startCollapsed: true
                            }]
                        }
                    ]
        });
        me.callParent(arguments);
    }
});