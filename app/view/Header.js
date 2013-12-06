Ext.define('Xnfy.view.Header', {
    extend: 'Ext.panel.Panel',
    region: 'north',
    // minHeight: 20,
    header: false,
    // id: 'instructions',
    // layout: {
    //     type: 'fit'
    // },
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        items: [
            {
                baseCls:'',
                xtype:'button',
                href:'admin',
                hrefTarget:'_self',
                style:'text-decoration:none;cursor: pointer;',
                text:'<strong style="color:#157FCC;font-size:20px">伴友商城</strong> <strong style="color:#157FCC;font-size:15px">后台管理系统</strong>'
            },
            '->',
            {
                iconCls:'icon-home',
                xtype: 'button',
                href:'./',
                text: '网站首页'
            },
            {
                // iconCls:'icon-user',
                xtype: 'button',
                id:'admin@',
                // width:130,
                text: '<strong style="color:#F8626C;font-size:14px">管理员：</strong>',
                minWidth:130,
                menuAlign:'tr-br?',
                menu: [{
                    iconCls:'icon-signout',
                    text:'<strong style="color:#f75963;">退出系统</strong>',
                    listeners:{
                        click:function(button){
                            Ext.MessageBox.show({
                                        title:'退出系统',
                                        msg: '确认退出系统?',
                                        buttons: Ext.MessageBox.YESNO,
                                        buttonText:{
                                            yes: "确认",
                                            no: "取消"
                                        },
                                        icon: Ext.MessageBox.QUESTION,
                                        fn: function(btn){
                                            if(btn=='yes'){
                                                Ext.getCmp('mainviewport').setLoading(true);
                                                Ext.Ajax.request({
                                                    url:"admin/common/logout",
                                                    method:'get',
                                                    callback:function(records, operation, success){
                                                        // var response = Ext.JSON.decode(success.responseText);
                                                        window.location.reload();
                                                    }
                                                });
                                            }
                                        }
                                    });
                        }
                    }
                }]
            }
            // ,
            // {
            //     xtype: 'button',
            //     id:'admin@',
            //     iconCls:'icon-user',
            //     text : ''
            // },
            // {
            //     xtype: 'button',
            //     text : '退出',
                // listeners:{
                //     click:function(button){
                //         Ext.MessageBox.show({
                //                     title:'退出系统',
                //                     msg: '确认退出系统?',
                //                     buttons: Ext.MessageBox.YESNO,
                //                     buttonText:{
                //                         yes: "确认",
                //                         no: "取消"
                //                     },
                //                     icon: Ext.MessageBox.QUESTION,
                //                     fn: function(btn){
                //                         if(btn=='yes'){
                //                             Ext.getCmp('mainviewport').setLoading(true);
                //                             Ext.Ajax.request({
                //                                 url:"admin/common/logout",
                //                                 method:'get',
                //                                 callback:function(records, operation, success){
                //                                     // var response = Ext.JSON.decode(success.responseText);
                //                                     window.location.reload();
                //                                 }
                //                             });
                //                         }
                //                     }
                //                 });
                //     }
                // }
            // }
            ]
    }],
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            // items:[{
            //     html:'<a href="./admin"><img width="56" height="56" src="./public/images/logo.jpg" /></a>',
            //     width:20,
            //     height:20,
            //     padding:'2',
            //     margin:'0 0 0 5'
            // },{
            //     columnWidth:1,
            //     html:'<span style="visibility:hidden">hello</span>'
            // },{
            //     layout:{
            //         type: 'vbox'
            //     },
            //     items:[{
            //         xtype:'toolbar',
            //         padding:'4 0 0 8',
            //         items: [
            //             {
            //                 xtype: 'button',
            //                 id:'admin@',
            //                 iconCls:'icon-user',
            //                 text : ''
            //             },
            //             {
            //                 xtype: 'button',
            //                 text : '退出',
            //                 listeners:{
            //                     click:function(button){
            //                         Ext.MessageBox.show({
            //                                     title:'退出系统',
            //                                     msg: '确认退出系统?',
            //                                     buttons: Ext.MessageBox.YESNO,
            //                                     buttonText:{
            //                                         yes: "确认",
            //                                         no: "取消"
            //                                     },
            //                                     icon: Ext.MessageBox.QUESTION,
            //                                     fn: function(btn){
            //                                         if(btn=='yes'){
            //                                             Ext.getCmp('mainviewport').setLoading(true);
            //                                             Ext.Ajax.request({
            //                                                 url:"admin/common/logout",
            //                                                 method:'get',
            //                                                 callback:function(records, operation, success){
            //                                                     // var response = Ext.JSON.decode(success.responseText);
            //                                                     window.location.reload();
            //                                                 }
            //                                             });
            //                                         }
            //                                     }
            //                                 });
            //                     }
            //                 }
            //             }
            //         ]
            //     }]
            // }]
        });
        me.callParent(arguments);
    }

});