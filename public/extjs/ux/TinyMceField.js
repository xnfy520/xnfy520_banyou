Ext.define('Ext.ux.TinyMceField', {
    extend: 'Ext.form.field.TextArea',
    alias: 'widget.tinymce',
    /**
     * TinyMCE editor configuration.
     *
     * @cfg {Object}
     */
    editorConfig: undefined,
    afterRender: function() {
        this.callParent(arguments);

        var me = this,
            id = this.inputEl.id;
        var editor = tinymce.createEditor(id,
            Ext.apply({
                selector: '#' + id,
                //resize: true,
                // height: me.height-36,
                // width: this.width,
                // autoresize_min_height: 300,
                // autoresize_max_height: 800,
                toolbar_items_size: 'small',
                menubar: false,
                language : 'zh_CN',
                statusbar : false,
                //forced_root_block:'',
                plugins: [
                    "upload_image advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker",
                    "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
                    "table contextmenu directionality emoticons template textcolor paste fullpage textcolor responsivefilemanager"
                ],//fullpage searchreplace print | 
                toolbar1:"fontselect | fontsizeselect | link unlink anchor | upload_image media responsivefilemanager | table charmap hr pagebreak nonbreaking | inserttime | visualblocks code preview fullscreen",
                toolbar2: "undo redo removeformat | forecolor backcolor | bold italic underline strikethrough subscript superscript | alignleft aligncenter alignright alignjustify | outdent indent | ltr rtl | bullist numlist blockquote",
                autosave_ask_before_unload: false,
                plugin_preview_width : "800",
                code_dialog_width : "800",
                external_filemanager_path:"public/filemanager/",
                filemanager_title:"文件管理器",
                external_plugins: { "filemanager" : "../filemanager/plugin.js"},
                init_instance_callback:function(inst){
                    //inst.execCommand('mceAutoResize');
                }
            },this.editorConfig));

        this.editor = editor;
        // set initial value when the editor has been rendered            
        editor.on('init', function() {
            editor.setContent(me.value || '');
        });

        // render
        editor.render();

        // --- Relay events to Ext

        editor.on('focus', function() {
            me.previousContent = editor.getContent();
            me.fireEvent('focus', me);
        });

        editor.on('blur', function() {
            me.fireEvent('blur', me);
        });

        editor.on('change', function(e) {
            var content = editor.getContent(),
                previousContent = me.previousContent;
            if (content !== previousContent) {
                me.previousContent = content;
                me.fireEvent('change', me, content, previousContent);
            }
        });

        editor.on('BeforeSetContent', function(e){
        });

        editor.on('NodeChange', function(){
            var images = [];
            var image = editor.dom.select('[data-mce-src]');
            if(image){
                Ext.Array.forEach(image, function(items, indexs){
                    var uri = items.dataset.mceSrc;
                    var exp = uri.split('/');
                    images.push(exp[exp.length-1]);
                });
                if(images.length>0){
                    var form = me.ownerCt.up('form').getForm();
                    var details_image_list = form.findField('details_image_list');
                    details_image_list.setValue(Ext.JSON.encode(images));
                }
            }
        });
    },
    getRawValue: function() {
        var editor = this.editor,
            value = editor && editor.initialized ? editor.getContent() : Ext.value(this.rawValue, '');
        this.rawValue = value;
        return value;
    },
    setRawValue: function(value) {
        this.callParent(arguments);

        var editor = this.editor;
        if (editor && editor.initialized) {
            editor.setContent(value);
        }

        return this;
    }
});