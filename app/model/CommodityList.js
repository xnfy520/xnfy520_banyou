Ext.define('Xnfy.model.CommodityList', {
    extend: 'Ext.data.Model',
    fields:[
		{name:'id',type:'int'},
		'name',
		'title',
		'indexing',
		{name:'pid',type:'int'},
		'views',
		'market_price',
		'selling_price',
		'enabled',
		'cover',
		'master',
		'release_date',
		'create_date',
		'modify_date',
		{name:'brand',type:'int'}
	]
});