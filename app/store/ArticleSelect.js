Ext.define('Xnfy.store.ArticleSelect', {
    extend: 'Ext.data.Store',
    requires: [
        'Xnfy.model.ArticleSelect'
    ],
    model: 'Xnfy.model.ArticleSelect',
    storeId: 'ArticleSelect',
    autoLoad: false,
    pageSize: 10,
    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            proxy: {
                type: 'jsonp',
                url : 'http://www.sencha.com/forum/topics-remote.php',
                reader: {
                    type: 'json',
                    root: 'topics',
                    totalProperty: 'totalCount'
                }
            }
        }, cfg)]);
    }
});