Ext.define('Xnfy.model.CommodityList', {
    extend: 'Ext.data.Model',
    fields:[
		// {name:'id',type:'int'},
		'id',
		'name',
		'title',
		{name:'pid',type:'int'},
		'views',
		'market_price',
		'selling_price',
		'enabled',
		'cover',
		'master',
		'create_date',
		'modify_date',
		{name:'brand',type:'int'}
	]
});