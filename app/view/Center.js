Ext.define('Xnfy.view.Center', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.xnfycenter',
    region: 'center',
    id: 'center',
    activeTab: 0,
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'panel',
                    title: '首页'
                    // html:'<img style="width:100%" src="public/images/ls.jpg" />'
                    // bodyStyle:'background:url(public/images/ls2.jpg) no-repeat center center'
                }
            ]
        });
        me.callParent(arguments);
    },
    listeners:{
        tabchange:function(tabPanel, newCard, oldCard, eOpts){
            // if(newCard.child('form')){
            //     console.log(newCard.child('form').getComponent('user-avatar'));
            // }
            // console.log(tabPanel.child('userlist').child('form').getComponent('user-avatar').setSrc('abc'));
            // if(oldCard.child('form')){
            //     console.log(oldCard.child('form').getComponent('user-avatar'));
            // }
        }
    }

});