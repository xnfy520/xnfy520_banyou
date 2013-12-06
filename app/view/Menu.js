Ext.define('Xnfy.view.Menu', {
    extend: 'Ext.panel.Panel',

    alias: 'widget.xnfymenu',

    region: 'west',
    split: true,
    width: 200,
    minWidth:200,
    maxWidth:300,
    layout: {
        type: 'accordion'
    },
    collapsible: true,
    title: '系统菜单',
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
			items: [{
                    xtype: 'treepanel',
                    title: '配置管理',
                    itemId:'Configuration',
                    rootVisible: false,
                    lines:false,
                    root: {
                        text: 'root',
                        id: 'root',
                        expanded:true,
                        children:[{
                            id:'baseConfiguration',
                            leaf: true,
                            text:'基本配置'
                        },{
                            id:'brandAllocation',
                            leaf: true,
                            text:'品牌分配'
                        }]
                    }
                },{
                    xtype: 'treepanel',
                    title: '类别管理',
                    itemId:'ClassifyMenu',
                    // rootVisible: false,
                    displayField: 'title',
                    store: 'ClassifyMenu',
                    listeners:{
                        load:function(self,node){
                            node.eachChild(function(i){
                                i.updateInfo(true,{title:i.data.title+(i.data.alias ? '（'+i.data.alias+'）' : '')});
                            });
                        }
                    }
                },
				{
					xtype: 'treepanel',
					title: '模块管理',
                    itemId:'ModuleMenu',
                    rootVisible: false,
                    // lines:false,
                    root: {
                        text: 'text',
                        id: 'root',
                        expanded:true,
                        children:[
                            {
                                id:'FileManage',
                                disabled:false,
                                leaf: true,
                                text:'文件管理'
                            },
                            {
                                id:'FileManager',
                                leaf: true,
                                text:'文件管理'
                            },{
                                id:'ArticleManage',
                                leaf: true,
                                text:'文章管理'
                            },{
                                id:'LinkManage',
                                leaf: true,
                                text:'链接管理'
                            },{
                                id:'CommodityManage',
                                leaf: false,
                                text:'商品管理'
                            }]
                    }
				},
                {
                    xtype: 'treepanel',
                    title: '用户管理',
                    itemId:'User',
                    rootVisible: false,
                    lines:false,
                    root: {
                        text: 'root',
                        id: 'root',
                        expanded:true,
                        children:[{
                            id:'UserGroup',
                            leaf: true,
                            text:'用户分组'
                        },{
                            id:'UserManage',
                            leaf: true,
                            text:'用户管理'
                        }]
                    }
                }]
        });
        me.callParent(arguments);
    }

});