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
        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'tabpanel',
                    tabPosition:"bottom",
                    items: [
                        {
                            xtype: 'panel',
                            title: '基本信息',
                            html:'heihei',
                            dockedItems: [
                                {
                                    xtype: 'toolbar',
                                    dock: 'top',
                                    frame:true,
                                    items: [
                                        {
                                            xtype: 'searchfield',
                                            emptyText: '输入搜索关字',
                                            store:Ext.create('Xnfy.store.ClassifyList'),
                                            width:300
                                        },
                                        {
                                            xtype: 'tbfill'
                                        },
                                        {
                                            itemId:'add',
                                            xtype: 'button',
                                            text: '添加分类'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            html:'1111',
                            title: '产品详情'
                        },
                        {
                            xtype: 'panel',
                            html:'3333',
                            title: '详细参数'
                        },
                        {
                            xtype: 'panel',
                            html:'3333',
                            title: '库存状态'
                        },
                        {
                            xtype: 'panel',
                            html:'3333',
                            title: '优惠套装' //配件没有这一项
                        },
                        {
                            xtype: 'panel',
                            html:'3333',
                            title: '推荐组合' //配件没有这一项
                        },
                        {
                            xtype: 'panel',
                            html:'3333',
                            title: '相关资讯'
                        },
                        {
                            xtype: 'panel',
                            html:'3333',
                            title: '相关视频'
                        }
                    ]
                }
            ]
        });
        me.callParent(arguments);
    }
});