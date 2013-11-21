Ext.define('Xnfy.model.ClassifyList', {
    extend: 'Ext.data.Model',
    fields:[{name:'id',type:'int'},'title','alias','pid','indexing', 'leaf','path',{name:'number',type:'int'},{name:'sort',type:'int'}, 'enabled','remark','create_date','modify_date','cover','configuration','attach']
});