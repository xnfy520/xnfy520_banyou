Ext.define('Xnfy.model.ArticleList', {
    extend: 'Ext.data.Model',
    fields:[{name:'id',type:'int'},{name:'type',type:'int'},'title','author','indexing',{name:'pid',type:'int'},'views',{name:'sort',type:'int'},'enabled','source','source_url','release_date','create_date','modify_date']
});