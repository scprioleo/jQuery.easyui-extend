/**
 * Created with IntelliJ IDEA.
 * @author: 爱看书不识字<zjh527@163.com>
 *
 *
 *
 * 扩展说明：
 *      1、这个扩展可以在含有iframe的页面中创建跨越iframe定位在最顶层的window。
 *
 *      2、此扩展通过参数locate来指定窗体依附在哪个dom对象上。
 *          top:                表示定位在最顶层
 *          document:           当含有iframe时，窗体定位在iframe的document中
 *          某个dom元素的id:     窗体被定位在指定的dom元素中。
 *
 *          注意: 当content和href中使用相对路径时，此参数的不同设置会影响页面加载，请通过调整content和href中的相对路径来解决。
 *
 *      3、此方法不接受inline=true的设置。
 *
 *      4、其他参数请参考easyui.window。
 *
 *      5、onLoad方法接收两个参数win、body
 *          win:    一个Object对象，包含以下两个方法:
 *                      getData: 参数name。用来获取data中设置的属性
 *                      close: 无参数，关闭当前窗体
 *
 *          body:   一个指向window.top或window.self的引用。当在没有开启useiframe=true的前提下，
 *                  要在onLoad中对easyui.window中的内容进行设置时，请使用类似如下形式操作:
 *                      body.$('#username').val('Tom')；
 *
 *
 *      6、toolbar和buttons中定义的每个元素的handler方法都接收一个参数win。参数win说明参见5
 *
 */
(function($){

    function getTop(w, options){
        var _doc;
        try{
            _doc = w['top'].document;
            _doc.getElementsByTagName;
        }catch(e){
            return w;
        }

        if(options.locate=='document' || _doc.getElementsByTagName('frameset').length >0){
            return w;
        }

        return w['top'];
    }


    $.extend({
        /**
         *
         * @param options
         *
         * 1、新增属性：
         *      useiframe: true|false，指定是否使用iframe加载页面。
         *      locate:  top|document|id 默认:top
         *      data:  方法回调参数
         *
         * 2、增强属性：
         *      content: 支持使用前缀url指定要加载的页面。
         */
        showWindow: function(options){
            options = options || {};
            var target;
            var winOpts = $.extend({},{
                iconCls:'icon-form',
                useiframe: false,
                locate: 'top',
                data: undefined,
                width: 500,
                height: 400,
                cache: false,
                minimizable: true,
                maximizable: true,
                collapsible: true,
                resizable: true,
                onClose: function(){target.dialog('destroy');}
            }, options);


            var callbackArguments={
                getData: function(name){
                    return winOpts.data ? winOpts.data[name]:null;
                },
                close: function(){
                    target.panel('close');
                }
            };

            var _top = getTop(window, winOpts);
            var iframe = null;

            if(/^url:/.test(winOpts.content)){
                var url = winOpts.content.substr(4, winOpts.content.length);
                if(winOpts.useiframe){
                    iframe = $('<iframe>')
                        .attr('height', '98%')
                        .attr('width', '100%')
                        .attr('marginheight', 0)
                        .attr('marginwidth', 0)
                        .attr('frameborder', 0);

                    setTimeout(function(){
                        iframe.attr('src', url);
                    }, 10);

                }else{
                    winOpts.href = url;
                }

                delete winOpts.content;
            }


            var warpHandler = function(handler){
                if(typeof handler == 'function'){
                    return function(){
                        handler(callbackArguments);
                    };
                }

                if(typeof handler == 'string' && winOpts.useiframe){
                    return function(){
                        iframe[0].contentWindow[handler](callbackArguments);
                    }
                }

                if(typeof handler == 'string'){
                    return function(){
                        eval(_top[handler])(callbackArguments);
                    }
                }
            }

            //包装toolbar中各对象的handler
            if(winOpts.toolbar && $.isArray(winOpts.toolbar)){
                $.each(winOpts.toolbar, function(i, button){
                    button.handler = warpHandler(button.handler);
                });
            }

            //包装buttons中各对象的handler
            if(winOpts.buttons && $.isArray(winOpts.buttons)){
                $.each(winOpts.buttons, function(i, button){
                    button.handler = warpHandler(button.handler);
                });
            }


            var onLoadCallback = winOpts.onLoad;
            winOpts.onLoad = function(){
                onLoadCallback && onLoadCallback.call(this, callbackArguments, _top);
            }

            if(winOpts.locate == 'top' || winOpts.locate == 'document'){
                if(winOpts.useiframe && iframe){
                    iframe.bind('load', function(){
                        onLoadCallback && onLoadCallback.call(this, callbackArguments, iframe[0].contentWindow);
                    });

                    target = _top.$('<div>').append(iframe).dialog(winOpts);
                }else{
                    target = _top.$('<div>').dialog(winOpts);
                }
            }else{
                var locate = /^#/.test(winOpts.locate)? winOpts.locate:'#'+winOpts.locate;
                target = $('<div>').appendTo(locate).dialog($.extend({}, winOpts, {inline: true}));
            }


        },
        showModalDialog: function(options){
            options = options || {};
            var opts = $.extend({}, options, {modal: true, minimizable: false, maximizable: false, resizable: false, collapsible: false});
            $.showWindow(opts);
        }
    })
})(jQuery);
