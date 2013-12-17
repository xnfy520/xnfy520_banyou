Ext.define('Xnfy.model.CommodityList', {
    extend: 'Ext.data.Model',
    fields:[
		{name:'id',type:'int'},
		// 'id',
		'name',
		'title',
		{name:'pid',type:'int'},
		'views',
		'market_price',
		'selling_price',
		{name:'enabled',type:'int'},
		{name:'sort',type:'int'},
		{name:'master',type:'int'},
		'cover',
		'create_date',
		'modify_date',
		{name:'brand',type:'int'}
	]
});